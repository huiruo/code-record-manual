参考：https://cloud.tencent.com/developer/article/1405259?from=15425

#### webpack 构建速度优化

1. webpack 在启动时会从配置的 Entry 出发，解析出文件中的导入语句，再递归解析。
2. 对于导入语句 Webpack 会做出以下操作：  
   1.根据导入语句寻找对应的要导入的文件；

   2.在根据要导入的文件后缀，使用配置中的 Loader 去处理文件（如使用 ES6 需要使用 babel-loader 处理）

针对这两点可以优化查找途径

#### 方式 1 优化 Loader 配置

方式 1-1.减少查找过程
对 webpack 的 resolve 参数进行合理配置，使用 resolve 字段告诉 webpack 怎么去搜索文件。
Loader 处理文件的转换操作是很耗时的，所以需要让尽可能少的文件被 Loader 处理

1.例如在配置 Loader 时通过 include 去缩小命中范围
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

noParse:忽略对部分没采用模块化的文件的递归解析和处理。提高构建性能。
一些库如 jq,chartJS 大而没采用模块化标准让 webpack 解析耗时又没意义

parser:细粒度地配置哪些模块被哪些模块解析

```javaScript
module:{
		noParse:/jquery/, //不去解析jquery中的依赖库
    {
      test: /\.js$/,
      use: [ 'babel-loader?cacheDirectory'],//开启转换结果缓存
      include: path.resolve(__dirname, 'src'),//只对src目录中文件采用babel-loader
      exclude: path.resolve(__dirname,' ./node_modules'),//排除node_modules目录下的文件
    },
}
```

方式 1-2 缩小构建目标
排除 Webpack 不需要解析的模块，即使用 loader 的时候，在尽量少的模块中去使用。
我们可以借助 include 和 exclude 这两个参数，规定 loader 只在那些模块应用和在哪些模块不应用。

```javaScript
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
```

#### 方式 2 优化 resolve.modules 配置

Resolve：Webpack 在启动后会从配置的入口模块出发找出所有依赖的模块,这个属性告诉 webpack 解析模块时应该搜索的目录，绝对路径和相对路径都能使用。使用绝对路径之后，将只在给定目录中搜索，从而减少模块的搜索层级

webpack 内置 js 模块化语法解析功能，也可以自定义规则：
1.alias:通过别名来将导入路径映射成一个新的导入路径
2.mainFields
3.extensions:当没有文件后缀，webpack 配置在尝试过程中用到地后缀列表：

resolve.modules 用于配置 webpack 去哪些目录下寻找第三方模块，默认是['node_modules']，但是，它会先去当前目录的./node_modules 查找，没有的话再去../node_modules 最后到根目录；

所以当安装的第三方模块都放在项目根目录时，就没有必要安默认的一层一层的查找，直接指明存放的绝对位置

```javaScript
// config/webpack.common.js

/*
优化 resolve.extensions 配置
1.后缀尝试列表要尽可能的小，不要把项目中不可能存在的情况写到后缀尝试列表中。
2.频率出现最高的文件后缀要优先放在最前面，以做到尽快的退出寻找过程。
3.在源码中写导入语句时，要尽可能的带上后缀，从而可以避免寻找过程。
*/
// ...

const commonConfig = {
  // ...
  resolve: {
    extensions: ['.js', '.jsx'],
    mainFiles: ['index', 'list'],
    alias: {
        'com': resolve('src/components'),
        'mod': resolve('src/modules'),
        'util': resolve('src/util'),
      '@': resolve('src')
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

#### 方式 3 优化 resolve.extensions 配置:合理使用 resolve.extensions

在导入没带文件后缀的路径时，webpack 会自动带上后缀去尝试询问文件是否存在，而 resolve.extensions 用于配置尝试后缀列表；
默认为 extensions:['js','json'];

当遇到 require('./data')时 webpack 会先尝试寻找 data.js，没有再去找 data.json；如果列表越长，或者正确的后缀越往后，尝试的次数就会越多；

所以在配置时为提升构建优化需遵守：

- 频率出现高的文件后缀优先放在前面；
- 列表尽可能的小；
- 书写导入语句时，尽量写上后缀名

因为项目中用的 jsx 较多，所以配置 extensions: [".jsx",".js"],
