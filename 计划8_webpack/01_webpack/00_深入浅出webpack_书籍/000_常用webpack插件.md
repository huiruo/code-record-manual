


# 1.webpack-merge
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