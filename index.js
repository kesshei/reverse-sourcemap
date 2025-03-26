const path = require('path');
const fs = require('fs-extra');
const sourceMap = require('source-map');

async function reverse(input) {
  const data = fs.readFileSync(input, 'utf8');
  const consumer = new sourceMap.SourceMapConsumer(data);
  const result = await consumer;
  let map = {};
  result.sources.forEach((source) => {
    const contents = result.sourceContentFor(source);
    map[path.normalize(source).replace(/^(\.\.[/\\])+/, '').replace(/[|\&#,+()?$~%'":*?<>{}]/g, '').replace(' ', '.')] = contents;
  });
  return map;
}

function getJsMapFiles(dir) {
  const jsMapFiles = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
          const subFiles = getJsMapFiles(filePath);
          jsMapFiles.push(...subFiles);
      } else if (file.endsWith( '.js.map')) {
          jsMapFiles.push(filePath);
      }
  });

  return jsMapFiles;
}

async function process(inputDir,outputDir) {
    const list = getJsMapFiles(inputDir);
    list.forEach(async (file) => {
      console.log("processing :" + file);
        try {
           const output = await reverse(file);
           Object.keys(output).forEach((item) => {
                  const outfile = path.join(outputDir, item);
                  const b = output[item];
                  if (!fs.existsSync(outfile) && b) {
                      
                      try {
                          let dir = path.dirname(outfile);
                          fs.ensureDirSync(dir);
                          fs.writeFileSync(outfile, b, 'utf8');   
                      } catch (error) {
                          console.log(error);
                      }
                  }
            })
        } catch (error) {
            console.log(error);
        }
    });
    console.log("done");
}

const outdir = path.resolve("out");

process("app/dist",outdir);