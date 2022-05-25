## 前端工程化

模块化、组件化、规范化、自动
简单来说，模块化就是将一个大文件拆分成相互依赖的小文件，再进行统一的拼装和加载。只有这样，才有多人协作的可能。
在 ES6 之前，JavaScript 一直没有模块系统，这对开发大型复杂的前端工程造成了巨大的障碍。对此社区制定了一些模块加载方案，如 CommonJS、AMD 和 CMD 等

现在 ES6 已经在语言层面上规定了模块系统，完全可以取代现有的 CommonJS 和 AMD 规范，而且使用起来相当简洁，并且有静态加载的特性。

规范确定了，然后就是模块的打包和加载问题：

1. 用 Webpack+Babel 将所有模块打包成一个文件同步加载，也可以打成多个 chunk 异步加载；

### 资源的模块化

Webpack 的强大之处不仅仅在于它统一了 JS 的各种模块系统，取代了 Browserify、RequireJS、SeaJS 的工作。更重要的是它的万能模块加载理念，即所有的资源都可以且也应该模块化。
资源模块化后，有三个好处：

- 1.依赖关系单一化。所有 CSS 和图片等资源的依赖关系统一走 JS 路线，无需额外处理 CSS 预处理器的依赖关系，也不需处理代码迁移时的图片合并、字体图片等路径问题；
- 2.资源处理集成化。现在可以用 loader 对各种资源做各种事情，比如复杂的 vue-loader 等等。
- 3.项目结构清晰化。使用 Webpack 后，你的项目结构总可以表示成这样的函数：
  dest = webpack(src, config)

## 常用 loader 和 plugin

### 一、常用 loader

```
JavaScript 相关，如下所示：

babel-loader：把 ES6 转换成 ES5；
script-loader：可以将指定的模块 JavaScript 文件转成纯字符串通过 eval 方式执行；
exports-loader：可以导出指定的对象，例如 window.Zepto；
ts-loader：把 TypeScript 转换成 JavaScript；
imports-loader：将任意三方的对象添加到 window 对象中。

样式相关，如下所示：
style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS；
css-loader：加载 CSS，支持模块化、压缩、文件导入等特性；
postcss-loader：CSS 后处理器 postcss 的 loader；
less-loader：把 less 代码转换成 CSS 代码；
sass-loader：把 SCSS/SASS 代码转换成 CSS 代码；
fast-sass-loader：并行处理 SCSS/SASS 文件，比 Sass-loader 快 5~10 倍的 loader；
stylus-loader：把 Stylus 代码转换成 CSS 代码；
mini-css-extract-plugin 的 loader：将 CSS 样式内容提取到 CSS 文件中。

静态资源相关，如下所示：
raw-loader：把文本文件的内容加载到代码中去；
file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件；
url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64的方式把文件内容注入到代码中去；
html-loader：HTML 语法的 loader，可以处理 HTML 中的图片、CSS等；
svg-url-loader：把压缩后的 SVG 内容注入到代码中；
markdown-loader：把 Markdown 文件转换成 HTML；
ejs-loader：把 EJS 模版编译成函数返回；
pug-loader：把 Pug 模版转换成 JavaScript 函数返回；
image-webpack-loader：加载并且压缩图片文件；
csv-loader：加载 csv 文件内容；
xml-loader：加载 xml 文件内容。


工程相关，如下所示：
eslint-loader：通过 ESLint 检查 JavaScript 代码；
tslint-loader：通过 TSLint 检查 TypeScript 代码；
mocha-loader：加载 Mocha 测试用例代码。
```

### 二、常用 plugin,扩展 Webpack 的功能

接收一个数组，数组里的每一项都是一个要使用的 Pulgin 的实例，Pulgin 需要的参数通过构造函数传入

```javaScript
module.exports = {
	pulgins:[]
}
```

### 三个构建大小插件

- 实际上 webpack4.0 默认是使用 terser-webpack-plugin 这个压缩插件，在此之前是使用 uglifyjs-webpack-plugin

- optimize-css-assets-webpack-plugin 插件来压缩 css，其默认使用的压缩引擎是 cssnano。

- 借助 image-webpack-loader 帮助我们来实现。它是基于 imagemin 这个 Node 库来实现图片压缩的。只要在 file-loader 之后加入 image-webpack-loader 即可

  1.webpack.optimize.UglifyJsPlugin
  2.html-webpack-plugin:webpack 打包后自动生成 html 页面

```javaScript
为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
可以生成创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
github上有些关于htmlwebpackplugin的属性介绍
```

3.HotModuleReplacementPlugin（webpack 自带）：热更新模块
4.extract-text-webpack-plugin

```javaScript
webpack默认会将css当做一个模块打包到一个chunk中，extract-text-webpack-plugin的作用就是将css提取成独立的css文件
首先安装和引入：
const ExtractTextPlugin = require('extract-text-webpack-plugin');
注册：
new ExtractTextPlugin({
    filename: 'css/[name].css',
})
注册之后，还要在css的loader中使用：
{
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        use: ['css-loader','postcss-loader','less-loader'],
        fallback: 'vue-style-loader',  #使用vue时要用这个配置
    })
},
```

5.webpack-merge

```
随着我们业务逻辑的增多，图片、字体、css、ES6以及CSS预处理器和后处理器逐渐的加入到我们的项目中来，进而导致配置文件的增多，使得配置文件书写起来比较繁琐，更严重者（书写特定文件的位置会出现错误）。更由于项目中不同的生产环境和开发环境的配置，使得配置文件变得更加糟糕。
```

```
分离配置文件
我们在根目录下创建config文件夹，并创建四个配置文件：

webpack.comm.js 公共环境的配置文件
webpack.development.js 开发环境下的配置文件
webpack.production.js 生产环境下的配置文件
webpack.parts.js 各个配置零件的配置文件
```

使用：

```js
const merge = require("webpack-merge");
const parts = require("./webpack.parts")    //引入配置零件文件
const config = {
    //书写公共配置
}
module.exports = merge([
    config,
    parts......
])
```

```
Webpack 内置的插件，如下所示：

webpack.DefinePlugin：定义全局常量插件；
webpack.EnvironmentPlugin：定义环境变量插件；
webpack.BannerPlugin：在代码中添加版权注释等；
webpack.DllPlugin：使用 DLL 思想来加快编译速度的插件；
webpack.HashedModuleIdsPlugin：可以修改文件 Hash 算法的插件；
webpack.optimize.SplitChunksPlugin：代码拆分优化插件；
webpack.HotModuleReplacementPlugin：开启模块热替换功能，通过监听文件变化并自动加载被修改的文件来减少烦人的浏览器手动重新加载；
webpack.ProgressPlugin：构建进度插件；
webpack.ProvidePlugin：自动加载模块，例如出现 $ 则加载 jQuery 等常用库；
webpack.IgnorePlugin：用于忽略部分文件

非内置的插件，如下所示：
mini-css-extract-plugin：CSS 文件提取，并且在生产环境构建是可以用于优化 CSS 文件大小；
optimize-css-assets-webpack-plugin：压缩 CSS 文件；
clean-webpack-plugin：在编译之前清理指定目录指定内容；
html-webpack-plugin：html 插件，可以根据 JavaScript模板文件生成 HTML；
preload-webpack-plugin：html-webpack-plugin 的插件，给页面添加 <link rel="preload"> 资源；
i18n-webpack-plugin：帮助网页做国际化的插件；
webpack-manifest-plugin：生成 Webpack 打包文件清单的插件；
html-webpack-inline-source-plugin：在 HTML 中内联打包出来的资源；
webpack-bundle-analyzer：webpack bundle 分析插件；
copy-webpack-plugin：文件拷贝插件，可以指定文件夹的文件复制到 output文件夹，方便打包上线；
terser-webpack-plugin：JavaScript代码压缩插件，这个插件兼容 ES6 语法，推荐使用这个插件，而不是用 uglifyjs；
serviceworker-webpack-plugin：生成 PWA service worker 插件；
hard-source-webpack-plugin：通过缓存提升非首次编译速度；
friendly-errors-webpack-plugin：减少 Webpack 无用的构建 log；
stylelint-webpack-plugin：StyleLint 的插件。
```
