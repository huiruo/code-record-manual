##### 常用配置
webpack是一个打包模块化javaScript的工具，它会从main.js出发，识别出源码中的模块化导入语句，递归地
找出出入口文件的所有依赖，将入口和其所有依赖打包到一个单独的文件中。

```
* Module 配置处理模块的规则
* Resolve 寻找模块的规则
* Plugins 扩展插件
* Entry 配置模块的入口
* Output 配置如何输出
* DevServer

```

#### 2.loaders 告诉webpack 在遇到哪些文件时使用 哪些Loader去加载和转换。
模块里面肯定有不同的rules(规则) 它里面有 2 个必选属性:
+ test:该属性标识应该转换哪个或哪些文件。
+ use:属性指示应该使用哪个loader来进行转换。

三种方式：
1.条件匹配:通过test,include,exclude,来选中loader要应用规则的文件
2.应用规则：对选中的文件通过use 配置项来应用 Loader,
test: 匹配文件,可以是数组
include: 包含某文件
exclude: 排除某文件
use: use是每一个rule的属性，指定要用什么loader



例如：借助webpack style-loader和css-loader我们可以在.js文件中引入css文件并让样式生效。
css-loader和style-loader的区别和使用
```
webpack是用JS写的，运行在node环境，所以默认webpack打包的时候只会处理JS之间的依赖关系
因为像 .css 这样的文件不是一个 JavaScript 模块，你需要配置 webpack 使用 css-loader 或者 style-loader 去合理地处理它们;

css-loader: 加载.css文件

style-loader:使用<style>将css-loader内部样式注入到我们的HTML页面

style-loader 是通过一个JS脚本创建一个style标签，里面包含一些样式。style-loader是不能单独使用的，应为它并不负责解析 css 之前的依赖关系，每个loader的功能都是单一的，各自拆分独立。
```

webpack.config.js
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

2.noParse:忽略对部分没采用模块化的文件的递归解析和处理。提高构建性能。
一些库如jq,chartJS大而没采用模块化标准让webpack 解析耗时又没意义

3.parser:细粒度地配置哪些模块被哪些模块解析
```javaScript
module:{
	rules:[
		{
			test://,
			noParse:'',
			parser:{

			}
	},
		{}
	]
}
```

##### 1-1.优化构建速度。在项目庞大时构建耗时可能会变的很长，每次等待构建的耗时加起来也会是个大数目。
1.在配置 Loader 时通过 include 去缩小命中范围
例如指定文件目录:babel-loader
```javaScript
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
```javaScript
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


#### 2.resolve 配置webpack 如何寻找模块所对应地文件。
Resolve：Webpack 在启动后会从配置的入口模块出发找出所有依赖的模块

webpack 内置js模块化语法解析功能，也可以自定义规则：
1.alias:通过别名来将导入路径映射成一个新的导入路径
2.mainFields
3.extensions:当没有文件后缀，webpack配置在尝试过程中用到地后缀列表：
```javaScript
/*
优化 resolve.extensions 配置
1.后缀尝试列表要尽可能的小，不要把项目中不可能存在的情况写到后缀尝试列表中。
2.频率出现最高的文件后缀要优先放在最前面，以做到尽快的退出寻找过程。
3.在源码中写导入语句时，要尽可能的带上后缀，从而可以避免寻找过程。
*/
extensions:['.js','.json']
```

```javaScript
    resolve: {
        extensions: [".vue", ".js", ".json"],
        alias: {
            'com': resolve('src/components'),
            'mod': resolve('src/modules'),
            'util': resolve('src/util'),
	        '@': resolve('src')
        }
    },
```

#### 3.Entry
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
#### 4.output
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
3.3 publicPath 配置发布到线上资源url 前缀，（在复杂的项目可能会有一些构建出的资源需要异步加载）


#### Pulgin:扩展Webpack的功能
接收一个数组，数组里的每一项都是一个要使用的Pulgin的实例，Pulgin需要的参数通过构造函数传入
```javaScript
module.exports = {
	pulgins:[]
}
```
#### 常用插件
1.webpack.optimize.UglifyJsPlugin
2.html-webpack-plugin:webpack打包后自动生成html页面
```javaScript
为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
可以生成创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
github上有些关于htmlwebpackplugin的属性介绍
```
3.HotModuleReplacementPlugin（webpack自带）：热更新模块
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