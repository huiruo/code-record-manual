## 步骤1.要引入main.css,需要像引入JavaScript文件那样，修改入口文件main.js:
```js
// 通过 CommonJS 规范导入 css 模块
require('./main.css');
// 通过 CommonJS 规范导入 show 函数
const show = require('./show.js');
// 执行 show 函数
show('Webpack');
```
## 步骤2.同时要修改webpack的配置修改，因为webpack 不原生支持解析css 文件：
webpack.config.js
```js
const path = require('path');

module.exports = {
  // JS 执行入口文件
  entry: './main.js',
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        // 用正则去匹配要用该 loader 转换的 css 文件
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      }
    ]
  }
};
```
## 解析loader---2.1.在执行构建之前，要先安装 npm i -D style-loader css-loader,构建后虎仔bundle.js注入main.css
```
loaders告诉webpack 在遇到哪些文件时使用 哪些Loader去加载和转换。如上：
在遇到.css 的结尾的文件时，先使用 css-load 读取css文件，再由style-loader将css的内容注入JavaScript。
注意：
* use 属性的值需要是一个由Loader 名称组成的数组，Loader 的执行顺序是由后到前的。
* 每个loader都可以通过 URL querystring 的方式传入参数。
```




