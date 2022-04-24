


# vue性能优化可以从以下三个方面入手:
vue代码层
webpack配置层
基础的web技术层面
##### 不要把所有东西都放进data
```
如果你的data属于纯展示的数据，你根本不需要对这个数据进行监听，特别是一些比这个例子还复杂的列表/对象，放进data中纯属浪费性能
放进computed中:
因为我们的computedList中，没有依赖，即没有任何访问响应式数据（如data/props上的属性/其他依赖过的computed等）的操作，根据Vue的依赖收集机制，只有在computed中引用了实例属性，触发了属性的getter，getter会把依赖收集起来，等到setter调用后，更新相关的依赖项
```
##### 提取公共代码:
相同的资源被重复加载，浪费用户的流量和服务器的成本。
每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。

##### v-if 和 v-show 区分使用场景
##### computed 和 watch 区分使用场景
```
computed多用于数值计算，且依赖其他属性。比如说：购物车结算。
watch多用于监听一个数据变化后进行一些异步操作或者开销较大的操作。
```
##### v-for的遍历循环的item添加key，且不与v-if同时使用

##### 长列表的性能优化
1.vue-virtual-scroll-list,虚拟滚动列表来支持大数据
2.Object.freeze 
```
Vue 是通过 Object.defineProperty 方法来进行对数据的劫持，从而实现视图响应数据的变化。如果我们一个组件的数据只是一些不会变化的数据，那么我们就需要禁止这种劫持来提高性能。

Object.freeze 方法的作用是冻结一个对象，一旦对象被冻结，它就再也不能被修改了。
export default {
  data: () => ({
    users: {}
  }),
  async created() {
    const users = await axios.get("/api/users");
    this.users = Object.freeze(users);
  }
};
```
#### 路由懒加载
Vue 是单页面应用，可能会有很多的路由引入 ，这样使用 webpcak 打包后的文件很大，当进入首页时，加载的资源过多，页面会出现白屏的情况，不利于用户体验。

路由懒加载方式
```
const Foo = () => import('./Foo.vue')
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```
#### 数据持久化问题（防抖、节流）
# Webpack 层面的优化



# 浏览器缓存
为了提高用户加载页面的速度，对静态资源进行缓存是非常必要的，根据是否需要重新向服务器发起请求来分类，将 HTTP 缓存规则分为两大类（强制缓存，对比缓存），如果对缓存机制还不是了解很清楚的，可以参考作者写的关于 HTTP 缓存的文章《深入理解HTTP缓存机制及原理》，这里不再赘述。

# CDN 的使用
浏览器从服务器上下载 CSS、js 和图片等文件时都要和服务器连接，而大部分服务器的带宽有限，如果超过限制，网页就半天反应不过来。而 CDN 可以通过不同的域名来加载文件，从而使下载文件的并发连接数大大增加，且CDN 具有更好的可用性，更低的网络延迟和丢包率 。


总文档：
http://webpack.wuhaolin.cn/
简书：http://webpack.wuhaolin.cn/

Resolve：Webpack 在启动后会从配置的入口模块出发找出所有依赖的模块，Resolve 配置 Webpack 如何寻找模块所对应的文件。 Webpack 内置 JavaScript 模块化语法解析功能，默认会采用模块化标准里约定好的规则去寻找，但你也可以根据自己的需要修改默认的规则。
---------->解析之后是数组：
但是这并不是我们想要的，因为是个数组，页面是无法直接使用，这时我们需要用到零外一个style-loader来处理。
借助webpack style-loader和css-loader我们可以在.js文件中引入css文件并让样式生效。
```
style-loader和css-loader作用是不同的。
css-loader: 加载.css文件
style-loader:使用<style>将css-loader内部样式注入到我们的HTML页面
style-loader 是通过一个JS脚本创建一个style标签，里面包含一些样式。style-loader是不能单独使用的，应为它并不负责解析 css 之前的依赖关系，每个loader的功能都是单一的，各自拆分独立。
```
# css-loader和style-loader的区别和使用
webpack是用JS写的，运行在node环境，所以默认webpack打包的时候只会处理JS之间的依赖关系
因为像 .css 这样的文件不是一个 JavaScript 模块，你需要配置 webpack 使用 css-loader 或者 style-loader 去合理地处理它们;
```
如果在JS中导入了css，那么就需要使用 css-loader 来识别这个模块，通过特定的语法规则进行转换内容最后导出
```

## 1.优化构建速度。在项目庞大时构建耗时可能会变的很长，每次等待构建的耗时加起来也会是个大数目。
1.在配置 Loader 时通过 include 去缩小命中范围
例如指定文件目录:babel-loader
```js
{
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [
                path.resolve(__dirname, "app/src"),
                path.resolve(__dirname, "app/test")
            ],
            exclude: /node_modules/
        }]
    }
}
```
2.优化 module.noParse 配置
```js
module:{
		noParse:/jquery/,//不去解析jquery中的依赖库
		rules:[
			{
				test:/\.js$/,
				use:{
					loader:'babel-loader',
					options:{
						presets:[
							'@babel/preset-env',
							'@babel/preset-react'
						]
					}
				}
			}
		]
	},
```

## 2.优化 resolve.modules 配置，指明存放第三方模块的绝对路径，以减少寻找，配置如下：
```
module.exports ={
	resolve:{
		//_dirname表示当前根目录
		modules:[path.resolve(_dirname,'node_modules')]
	}
}
```

###  优化 resolve.alias 配置

###  优化 resolve.extensions 配置
1.后缀尝试列表要尽可能的小，不要把项目中不可能存在的情况写到后缀尝试列表中。
2.频率出现最高的文件后缀要优先放在最前面，以做到尽快的退出寻找过程。
3.在源码中写导入语句时，要尽可能的带上后缀，从而可以避免寻找过程。

## 3.优化使用体验_____用webpack服务器的热更新和构建完成自动弹出浏览器的酷炫效果:webpack-dev-server
npm install webpack-dev-server -g


# 优化输出质量
优化输出质量的目的是为了给用户呈现体验更好的网页，例如减少首屏加载时间、提升性能流畅度等。 这至关重要，因为在互联网行业竞争日益激烈的今天，这可能关系到你的产品的生死。

## 优化输出质量本质是优化构建输出的要发布到线上的代码，分为以下几点：

### 1.减少用户能感知到的加载时间，也就是首屏加载时间。
```
4-7 区分环境
4-8 压缩代码:UglifyJS:http://webpack.wuhaolin.cn/4%E4%BC%98%E5%8C%96/4-8%E5%8E%8B%E7%BC%A9%E4%BB%A3%E7%A0%81.html
4-9 CDN 加速:http://webpack.wuhaolin.cn/4%E4%BC%98%E5%8C%96/4-9CDN%E5%8A%A0%E9%80%9F.html
4-10 使用 Tree Shaking
Tree Shaking 可以用来剔除 JavaScript 中用不上的死代码（没用到的代码）。它依赖静态的 ES6 模块化语法，例如通过 import 和 export 导入导出。
4-11 提取公共代码
4-12 按需加载
```

### 2.提升流畅度，也就是提升代码性能。
4-13 使用 Prepack
4-14 开启 Scope Hoisting


# 常用插件
1.webpack.optimize.UglifyJsPlugin
2.html-webpack-plugin:webpack打包后自动生成html页面
```js
为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
可以生成创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
github上有些关于htmlwebpackplugin的属性介绍
```
3.HotModuleReplacementPlugin（webpack自带）：热更新模块
4.1. extract-text-webpack-plugin
```js
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

### webpack-merge
```
var merge = require('webpack-merge')
var prodEnv = require('./prod')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    httpUrl: '"http://10.1.47.145:8082"'
})
```
