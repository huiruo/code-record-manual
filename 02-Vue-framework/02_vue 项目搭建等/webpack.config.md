
https://blog.csdn.net/weixin_44869002/article/details/105819462
# 0.从Vue CLI 3.0 开始，Webpack的配置文件从webpack.config.js变为了vue.config.js。此外，Vue 对配置文件的写法也进行了一些改动。因此，本文参考其他大神的对webpack的说明以及Vue CLI 4.0 关于webpack的说明文档。起草了一份Vue CLI 4.0 的基本配置，供大家参考：
```
test
```
# 1.vue.config.js
```
vue.config.js 是一个可选的配置文件，如果项目的 (和 package.json 同级的) 根目录中存在这个文件，那么它会被 @vue/cli-service 自动加载。你也可以使用 package.json 中的 vue 字段，但是注意这种写法需要你严格遵照 JSON 的格式来写。


第一点：vue.config.js是可选配置文件；
第二点：vue.config.js必须存在与项目根目录，不然无法生效。这里要提及的一点，项目的根目录是更具package,json文件来定义的。
第三点：Vue.config.js会被自动加载（前提是位置正确）。所以我们只需要添加好vue.config.js，并做好配置就行了。
```
# 2.webpack.config.js
```
实际上，VueCLI 3.0及以上构建的项目是有webpack.config.js的，只是被Vue隐藏起来了。里面是VueCLI的默认webpack配置。

而vue.config.js是vue 对webpack.config.js的扩展文件。最终编译时，vue.config.js会被合并到webpack.config.js中。

如果我们想查看最终编译的webpack配置，可进行一下操作：
vue inspect

在控制台的Vue项目根目录下运行上面代码，webpack配置将在控制台打印出来。

如果，想要webpack配置存储到一个文件中，可以这样：
vue inspect > output.js
```

# 实例：
```
const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
  publicPath: './', // 基本路径
  outputDir: 'dist', // 输出文件目录
  filenameHashing: true, // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  productionSourceMap: true, // 生产环境是否生成 sourceMap 文件

  chainWebpack: config => {
    // 开启图片压缩
    config.module.rule('images')
    .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    .use('url-loader')
        .loader('url-loader')
        .options({
           limit: 10240    // 图片小于10k转为base64,默认4k
    	})
        .end()
    .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({ bypassOnDebug: true })
        .end()
      
     // 配置Jquery
    config.plugin('provide').use(webpack.ProvidePlugin, [{
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    }]);
      
    // 开启js、css压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin')
      .use(new CompressionPlugin({
        test:/\.js$|\.html$|.\css/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 不删除源文件
      }))
    }
  },
    
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'

      // 将每个依赖包打包成单独的js文件
      const optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000, // 依赖包超过20000bit将被单独打包
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name (module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`
              }
            }
          }
        },

        // 移除console
        minimizer: [new UglifyPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true, // console
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })]
      }
      Object.assign(config, {
        optimization
      })
    } else {
      // 为开发环境修改配置...
      config.mode = 'development'
    }
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@c': path.resolve(__dirname, './src/components'),
          '@p': path.resolve(__dirname, './src/pages'),
          '@v': path.resolve(__dirname, './src/views'),
        } // 别名配置
      }
    })
  },

  // css相关配置
  css: {
    extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: true, // 开启 CSS source maps?
    requireModuleExtension: true, // 是否仅对文件名包含module的css相关文件使用 CSS Modules
    loaderOptions: {
      css: {
        modules: {
          localIdentName: '[local]_[hash:base64:8]' // 设定 CSS Modules 命名规则
        }
      }
    } // css预设器配置项 详见https://cli.vuejs.org/zh/config/#css-loaderoptions
  },
  parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  // webpack-dev-server 相关配置
  devServer: {
    open: true,
    inline: true, // 开启实时刷新
    host: '0.0.0.0', // 允许外部ip访问
    port: 8024, // 端口
    https: false, // 启用https
    overlay: {
      warnings: true,
      errors: true
    }, // 错误、警告在页面弹出
    proxy: {
      '/api': {
        target: '',
        changeOrigin: true, // 允许websockets跨域
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    } // 代理转发配置，用于调试环境
  },
  // 第三方插件配置
  pluginOptions: {}
}
```
