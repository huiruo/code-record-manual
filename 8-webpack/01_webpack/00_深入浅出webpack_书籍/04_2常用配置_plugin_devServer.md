
# 一.Pulgin:扩展Webpack的功能
接收一个数组，数组里的每一项都是一个要使用的Pulgin的实例，Pulgin需要的参数通过构造函数传入
```js
module.exports = {
	pulgins:[]
}
```


# 二.DevServer
只有通过 DevServer 启动webpack时，配置文件里面的DevServer才会生效

## 1.hot:模块热替换，将在不刷新整个页面通过做到实时预览

## 2.inline
## 3.histeryApiFallback:
## 4.contentBase:配置 DevServer HTTP服务器的文件根目录。通常是根目录，一般不用配置
## 5.host:服务监听的地址
## 6.port:服务监听接口，默认8080
## 7.https:
webpack默认使用http服务，它也能使用https 服务。
```js
devServer:{
	https:true
}
```
## 8.compress:是否使用Gzip压缩
## 9.open:自动打开浏览器访问

# 二.target:
指定不同的运行环境：
```js
target:'node' //
target:'web' // 默认
```

# 三.devtool：如何生成 Source Map,默认false

# 四.watch:在文件发生变化重新编译。默认关闭
