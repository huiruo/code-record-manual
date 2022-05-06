但是随着项目涉及到的页面越来越多，功能和业务代码也会越来越多，相应的 webpack 的构建时间也会越来越久。
### 体积优化
###### js 压缩
```
实际上 webpack4.0 默认是使用 terser-webpack-plugin 这个压缩插件，在此之前是使用 uglifyjs-webpack-plugin，

两者的区别是后者对 ES6 的压缩不是很好，同时我们可以开启 parallel 参数，使用多进程压缩，加快压缩。
```
```js
// config/webpack.common.js
const TerserPlugin = require('terser-webpack-plugin');
// ...
const commonConfig = {
  // ...
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4, // 开启几个进程来处理压缩，默认是 os.cpus().length - 1
      }),
    ],
  },
  // ...
}
```
###### 压缩 CSS
我们可以借助 optimize-css-assets-webpack-plugin 插件来压缩 css，其默认使用的压缩引擎是 cssnano。 具体使用如下：
```js
// config/webpack.prod.js
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// ...
const prodConfig = {
  // ...
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.optimize\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true,
      })
    ]
  },
}
```
###### 图片压缩
借助 image-webpack-loader 帮助我们来实现。它是基于 imagemin 这个 Node 库来实现图片压缩的。
只要在 file-loader 之后加入 image-webpack-loader 即可:
```js
// config/webpack.common.js
// ...
module: {
  rules: [
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'images/',
          }
        },
        {
          loader: 'image-webpack-loader',
          options: {
            // 压缩 jpeg 的配置
            mozjpeg: {
              progressive: true,
              quality: 65
            },
            // 使用 imagemin**-optipng 压缩 png，enable: false 为关闭
            optipng: {
              enabled: false,
            },
            // 使用 imagemin-pngquant 压缩 png
            pngquant: {
              quality: '65-90',
              speed: 4
            },
            // 压缩 gif 的配置
            gifsicle: {
              interlaced: false,
            },
            // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
            webp: {
              quality: 75
            }
          }
        }
      ]
    },
  ]
}         
// ...
```

### 速度优化
###### 减少查找过程
对 webpack 的 resolve 参数进行合理配置，使用 resolve 字段告诉 webpack 怎么去搜索文件。

###### 合理使用 resolve.extensions
```
在导入语句没带文件后缀时，webpack 会自动带上后缀后去尝试询问文件是否存在，查询的顺序是按照我们配置 的 resolve.extensions 顺序从前到后查找，webpack 默认支持的后缀是 js 与 json。
如果我们配置 resolve.extensions= ['js', 'json']，那么 webpack 会先找 xxx.js

如果没有则再查找 xxx.json，所以我们应该把常用到的文件后缀写在前面，或者 我们导入模块时，尽量带上文件后缀名。
```
###### 优化 resolve.modules
1.这个属性告诉 webpack 解析模块时应该搜索的目录，绝对路径和相对路径都能使用。使用绝对路径之后，将只在给定目录中搜索，从而减少模块的搜索层级

2.alias 的意思为 别名，能把原导入路径映射成一个新的导入路径。
```js
// config/webpack.common.js
// ...

const commonConfig = {
  // ...
  resolve: {
    extensions: ['.js', '.jsx'],
    mainFiles: ['index', 'list'],
    alias: {
      alias: path.resolve(__dirname, '../src/alias'),
    },
    modules: [
      path.resolve(__dirname, 'node_modules'), // 指定当前目录下的 node_modules 优先查找
      'node_modules', // 将默认写法放在后面
    ]
  },
  // ...
}
// ...
```
###### 缩小构建目标
排除 Webpack 不需要解析的模块，即使用 loader 的时候，在尽量少的模块中去使用。
我们可以借助 include 和 exclude 这两个参数，规定 loader 只在那些模块应用和在哪些模块不应用。
```js
// config/webpack.common.js
// ...
const commonConfig = {
  // ...
  module: {
    rules: [
      { 
        test: /\.js|jsx$/, 
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src'),
        use: ['babel-loader']
      },
      // ...
    ]
  },
}
// ...
```
