
# 定义：
打包模块化 JavaScript的工具，在 Webpack 里面一切文件皆模块，通过Loader转换文件，
通过 plugin 注入钩子,最后输出由多个模块组合成的文件。webpack 专注与构建模块化项目。
```
一切文件如 js,css,scss,图片对于webpack都是一个个模块，这样的好处是能清晰描述各个模块之间的依赖关系，以便webpck 对模块进行组合和
打包。经过webpack 的处理，最终会输出浏览器使用的静态资源。
```
```js
module.exports = {
	//所有模块的入口，webpack 从入口开始递归解析出所有依赖的模块
	entry:'./app.js',
	output:{
		//将入口所依赖的所有模块打包成一个文件bundle.js输出
		filename:'bundle.js'
	}
}
```

# 安装webpck到本项目，推荐，全局的话可能会冲突
```npm
npm i -D webpack
```

# 使用webpack

1.存放工具函数的show.js
```js
// 操作 DOM 元素，把 content 显示到网页上
function show(content) {
  window.document.getElementById('app').innerText = 'Hello,' + content;
}

// 通过 CommonJS 规范导出 show 函数
module.exports = show;
```

2.包含执行入口main.js
```js
// 通过 CommonJS 规范导入 show 函数
const show = require('./show.js');
// 执行 show 函数
show('Webpack');
```

3.webpack 在执行构建时默认会从项目根目录  webpack.config.js 文件中读取配置，所以我们还需要新建它：
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
  }
};
```

4.package.json
```json
{
  "name": "dive-into-webpack",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack"
  },
  "dependencies": {},
  "devDependencies": {
    "webpack": "^3.4.0"
  }
}
```

4.目录结构
```html
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
<div id="app"></div>
<!--导入 webpack 输出的 JS 文件-->
<script src="./dist/bundle.js"></script>
</body>
</html>
```
```text
index.html
main.js
show.js
webpack.config.js
```

## webpack是一个打包模块化javaScript的工具，它会从main.js出发，识别出源码中的模块化导入语句，递归地
找出出入口文件的所有依赖，将入口和其所有依赖打包到一个单独的文件中。

