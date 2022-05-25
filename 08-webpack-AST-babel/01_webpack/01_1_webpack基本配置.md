### 常用配置

webpack 是一个打包模块化 javaScript 的工具，它会从 main.js 出发，识别出源码中的模块化导入语句，递归地
找出出入口文件的所有依赖，将入口和其所有依赖打包到一个单独的文件中。

```
* Loader 配置处理模块的规则
* resolve.modules 寻找模块的规则
* Plugins 扩展插件
* Entry 配置模块的入口
* Output 配置如何输出
* DevServer

```

## 2.loaders 告诉 webpack 在遇到哪些文件时使用 哪些 Loader 去加载和转换。

模块里面肯定有不同的 rules(规则) 它里面有 2 个必选属性:

- test:该属性标识应该转换哪个或哪些文件。
- use:属性指示应该使用哪个 loader 来进行转换。

三种方式： 1.条件匹配:通过 test,include,exclude,来选中 loader 要应用规则的文件 2.应用规则：对选中的文件通过 use 配置项来应用 Loader,
test: 匹配文件,可以是数组
include: 包含某文件
exclude: 排除某文件
use: use 是每一个 rule 的属性，指定要用什么 loader

例如：借助 webpack style-loader 和 css-loader 我们可以在.js 文件中引入 css 文件并让样式生效。
css-loader 和 style-loader 的区别和使用

```
webpack是用JS写的，运行在node环境，所以默认webpack打包的时候只会处理JS之间的依赖关系
因为像 .css 这样的文件不是一个 JavaScript 模块，你需要配置 webpack 使用 css-loader 或者 style-loader 去合理地处理它们;

css-loader: 加载.css文件

style-loader:使用<style>将css-loader内部样式注入到我们的HTML页面

style-loader 是通过一个JS脚本创建一个style标签，里面包含一些样式。style-loader是不能单独使用的，应为它并不负责解析 css 之前的依赖关系，每个loader的功能都是单一的，各自拆分独立。
```

> webpack.config.js

```javaScript
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

## 3.Entry

类型:

```javaScript
string  './app'
array  ['.app/entry3','./app/entry2']
object {a:'app/entry3',b:'app/'}
```

实例：

```javaScript
entry: {
    app: ["babel-polyfill", "./src/index.js"]
},
```

## 4.output

```javaScript
output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
    publicPath: process.env.BUILD_ENV === 'production'
    ? config.build.assetsPublicPath
    : config.dev.assetsPublicPath
},
```

3.1 output.filename.配置输出文件的名称，string 类型
3.2 path
3.3 publicPath 配置发布到线上资源 url 前缀，（在复杂的项目可能会有一些构建出的资源需要异步加载）
