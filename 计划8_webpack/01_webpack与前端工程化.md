### 前端工程化
模块化、组件化、规范化、自动
简单来说，模块化就是将一个大文件拆分成相互依赖的小文件，再进行统一的拼装和加载。只有这样，才有多人协作的可能。
在ES6之前，JavaScript一直没有模块系统，这对开发大型复杂的前端工程造成了巨大的障碍。对此社区制定了一些模块加载方案，如CommonJS、AMD和CMD等

现在ES6已经在语言层面上规定了模块系统，完全可以取代现有的CommonJS和AMD规范，而且使用起来相当简洁，并且有静态加载的特性。

规范确定了，然后就是模块的打包和加载问题：
1. 用Webpack+Babel将所有模块打包成一个文件同步加载，也可以打成多个chunk异步加载；


###### 资源的模块化
Webpack的强大之处不仅仅在于它统一了JS的各种模块系统，取代了Browserify、RequireJS、SeaJS的工作。更重要的是它的万能模块加载理念，即所有的资源都可以且也应该模块化。
资源模块化后，有三个好处：
* 1.依赖关系单一化。所有CSS和图片等资源的依赖关系统一走JS路线，无需额外处理CSS预处理器的依赖关系，也不需处理代码迁移时的图片合并、字体图片等路径问题；
* 2.资源处理集成化。现在可以用loader对各种资源做各种事情，比如复杂的vue-loader等等。
* 3.项目结构清晰化。使用Webpack后，你的项目结构总可以表示成这样的函数：
dest = webpack(src, config)

#### 常用 loader 和 plugin
##### 一、常用 loader
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
##### 二、常用 plugin
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