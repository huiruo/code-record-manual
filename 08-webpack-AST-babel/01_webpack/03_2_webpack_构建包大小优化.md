但是随着项目涉及到的页面越来越多，功能和业务代码也会越来越多，相应的 webpack 的构建时间也会越来越久。

###### 方式 1.js 压缩

```
实际上 webpack4.0 默认是使用 terser-webpack-plugin 这个压缩插件，在此之前是使用 uglifyjs-webpack-plugin，

两者的区别是后者对 ES6 的压缩不是很好，同时我们可以开启 parallel 参数，使用多进程压缩，加快压缩。
```

```js
// config/webpack.common.js
const TerserPlugin = require("terser-webpack-plugin");
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
};
```

###### 方式 2：压缩 CSS

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
        cssProcessor: require("cssnano"),
        cssProcessorPluginOptions: {
          preset: ["default", { discardComments: { removeAll: true } }],
        },
        canPrint: true,
      }),
    ],
  },
};
```

###### 方式 3：图片压缩

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
          loader: "file-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
          },
        },
        {
          loader: "image-webpack-loader",
          options: {
            // 压缩 jpeg 的配置
            mozjpeg: {
              progressive: true,
              quality: 65,
            },
            // 使用 imagemin**-optipng 压缩 png，enable: false 为关闭
            optipng: {
              enabled: false,
            },
            // 使用 imagemin-pngquant 压缩 png
            pngquant: {
              quality: "65-90",
              speed: 4,
            },
            // 压缩 gif 的配置
            gifsicle: {
              interlaced: false,
            },
            // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
            webp: {
              quality: 75,
            },
          },
        },
      ],
    },
  ];
}
// ...
```
