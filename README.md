# reverse-sourcemap
还原 webpack 生成的 js.map文件，还原整个文件夹。

## 原因
参考了 [reverse-sourcemap](https://github.com/davidkevork/reverse-sourcemap) 和 [shuji]https://github.com/paazmaya/shuji/

发现对有问题的js.map无法处理

所以，自己分析内部逻辑，自己实现，直接还原整个项目到out目录下。


