
安装：
npm install -g create-react-app

然后继续输入:
create-react-app -V
create-react-app react-ts-demo




# 用webpack 搭建react项目  
文档：https://juejin.im/post/5d0ccc9ff265da1b934e0a44
文档：https://www.cnblogs.com/ssw-men/p/11155699.html
### 1.新建react-ts-template

### 2.初始化项目,填写项目信息
yarn init -y 或者 npm init -y
npm init -y && tsc --init
tsc --init

### 3.安装webpack
```
yarn add webpack -D 或者 npm i webpack -D
yarn add webpack-cli -D 或者 npm i webpack-cli -D
```
webpack也可以全局安装，不过要注意配置PATH
webpack4将命令行相关的操作抽离到了webpack-cli中，比如init、migrate、serve等等，不过都没用过


### 4.安装完毕后在根目录新建build文件夹，并新建一个webpack.common.js文件，用来存放webpack的公共配置
4.1然后在webpack.common.js中简单的配置入口(entry)跟输出(output)。
```js
const path = require('path');
module.exports={
  entry: path.join(__dirname, '../src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../dist')
  }
}
```
4.2接着在根目录下再新建src文件夹，用来存放主要代码，并新建index.js，随便写点东西。
```
console.log('hello world')
```

4.3在package.json中加入一个脚本，并在控制台中运行它
npm run build
```js
"scripts": {
    "build": "webpack --config build/webpack.common.js"
}
```

4.4 之后会发现生成了一个dist文件夹，并且还有一个bundle.js，同时控制台还会有报错
```
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```
webpack4中提供了 mode 配置选项，告知 webpack 使用相应模式的内置优化，上面这个警告写着如果不提供mode，webpack将会使用production模式。我们把scripts修改一下。
```js
"scripts": {
    "build": "webpack --config build/webpack.common.js --mode production"
}
```
这样的webpack简单的打包功能就有了。


# Bable
```
Bable这里使用的是7版本，与之前版本不同的是安装依赖时的包名，像babel-core、babel-preset-env、babel-polyfill等，名字已经更换成了@babel/core、@babel/preset-env、@babel/polyfill，这里先安装主要的包。

yarn add @babel/core @babel/preset-env @babel/preset-react babel-loader -D
```
然后在根目录下新建一个babel.config.js，这个配置文件跟.babelrc.js是有区别的，根据官网来看babel.config.js是项目级别的一个配置，详细信息可以参照官网 Config Files，在其中添加如下内容：

### 修改webpack.common.js，增加 js 文件的 loader 配置，之后还会改。
```js
module: {
    rules: [{
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.join(__dirname, '../src')
    }]
}
```


# React
接下来加入React，也是最重要的部分。
yarn add react react-dom

### 修改 src/index.js 中的内容
```js
import React from 'react';
import ReactDom from 'react-dom';

ReactDom.render(<div>Hello React!</div>, document.getElementById('root'));
```

### 然后在根目录下新建一个public文件夹，并在里面新建一个index.html
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>React-TS-Tempalte</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```


### 想要 webpack 能以这个html为模板，还需要一个html-webpack-plugin插件

安装它yarn add html-webpack-plugin -D并在webpack.common.js中增加如下配置，这也是用到的第一个插件：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
...
plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      inject: true
    })
]
```
让我们打包后打开dist下的index.html看看效果，成功地展示了Hello React。


# 开发环境配置
### 接下来安装 webpack-dev-server 来启动一个简单的服务器。
修改webpack.common.config.js，增加webpack-dev-server的配置。
```js
  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    overlay: {
      //当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
      errors: true
    },
    inline: true,
    hot: true
  }
```

### 接下来需要在package.json中增加一个script
```js
"dev": "webpack-dev-server --config webpack.common.js --mode development --open"
```
在控制台中输入npm run dev，便可以在http://localhost:3000 中看到启动的项目。



# Typescript
下面加入Typescript依赖，关键的依赖包就是 typescript，不过还需要安装对应的types：@types/react、@types/react-dom。
```
yarn add typescript @types/react @types/react-dom -D
```
接下来需要把之前的 js、jsx 文件替换成对应的 ts、tsx，同时还需要对应的loader，可以使用 ts-loader 以及之前安装过的 babel-loader，这里使用之前安装的 babel-loader，在webpack.common.js中添加配置：
```js
rules: [
  {
    test: /\.(j|t)sx?$/,
    include: [resolve('../src')],
    use: [
      {
        loader: 'babel-loader'
      }
    ],
    // 排除node_modules底下的
    exclude: /node_modules/
  }
]

注意：2020 这个版本并没有配置成功，需要借助：ts-loader
// 增加新的LOADER
{
test: /\.TSX?$/,
loaders: ['BABEL-LOADER', 'TS-LOADER']
},
```

### 修改 webpack 的入口配置
不要忘记把src下的index.js改成index.tsx
```js
module.exports={
  entry: path.join(__dirname, '../src/index.tsx')
}
```

### 配置tsconfig.json，这个文件也是使用ts时很关键的一个文件，下面是官网的推荐配置。
略


# CSS配置
这里我们需要用到 style-loader、css-loader,先安装它们:

* css-loader使你能够使用类似@import 和 url(...)的方法实现 require()的功能；
* style-loader将所有的计算后的样式加入页面中； 二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。
```js
yarn add style-loader css-loader -D
// 然后在webpack.common.js中添加相应的规则
{
    test: /\.css$/, // 正则匹配文件路径
    exclude: /node_modules/,
    use: [
      // 注意loader生效是从下往上的
      'style-loader',
      'css-loader'
    ]
 }
```

### 在根目录下新建一个index.css，以及App.tsx，并在index.tsx中引入它们
index.css
```css
.app {
    background-color: red;
}
```
// App.tsx
```js
import * as React from 'react'

class App extends React.Component {
  render() {
    return (
      <div className="app">
        Hello React
      </div>
    )
  }
}
export default App
```
// index.tsx
```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

ReactDOM.render(<App />, document.getElementById('root'))
```
启动后便可以看到设置的红色背景

# 加入Sass
```
yarn add sass-loader node-sass -D
```
安装完成后在webpack.common.js中加入 .scss 文件的规则
```js
{
    test: /\.scss$/,
    include: path.join(__dirname, '../src'),
    use: [
      'style-loader',
      'css-loader',
      'sass-loader'
    ]
}
```
接下来我们把根目录下的index.css改成index.scss，不要忘记index.tsx中引入的文件后缀也要修改，项目启动后发现可以成功解析scss文件。


# 图片字体等资源加载
首先安装处理这类资源的加载器
yarn add url-loader file-loader -D
```js
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    use: [
      {
      loader: 'url-loader',
      options: {
        //1024 == 1kb  
        //小于10kb时打包成base64编码的图片否则单独打包成图片
        limit: 10240,
        name: path.join('img/[name].[hash:7].[ext]')
      }
    }]
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 10240,
        name: path.join('font/[name].[hash:7].[ext]')
      }
    }]
  }
```
### ts引入图片报错
```js
import Img from "./images/1.png"
<img src={Img} alt=""/>
```
```
如果在js中引入本地静态资源图片时使用import img from './img/bd_logo1.png'这种写法是没有问题的，但是在typscript中是无法识别非代码资源的，所以会报错TS2307: cannot find module '.png'。因此，我们需要主动的去声明这个module。新建一个ts声明文件如：images.d.ts（如下）就可以了。这样ts就可以识别svg、png、jpg等等图片类型文件。项目编译过程中会自动去读取.d.ts这种类型的文件，所以不需要我们手动地加载他们。当然.d.ts文件也不能随便放置在项目中，这类文件和ts文件一样需要被typescript编译，所以一样只能放置在tsconfig.json中include属性所配置的文件夹下。
```
```js
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
```


# ESlint
```yarn
yarn add eslint eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser

npm i -D eslint prettier
npm i -D eslint-config-prettier eslint-plugin-prettier
npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
如果不使用 hook 的话，就不用装 eslint-plugin-react-hooks 这个插件了
```
在根目录下新建.eslintrc.js，并写入配置：
```js
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    "ecmaVersion": 2019,
    "sourceType": "module"
  },
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    "@typescript-eslint",
    "react-hooks"
  ],
  globals: {
    // 这里填入你的项目需要的全局变量
    // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
    // React: false,
    // ReactDOM: false
  },
  settings: {
    react: {
        pragma: "React",
        version: "detect"
    }
  },
  rules: {
  }
}
```



# 更新babel配置  可以略
之前加了 typescript 等依赖，现在来更新一下 babel 的配置，来支持我们后面可能会用到的功能，比如装饰器以及路由的动态引入。
yarn add @babel/preset-typescript @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators @babel/plugin-syntax-dynamic-import -D

```js
修改 babel.config.js

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    ['import', { 
      libraryName: 'antd',
      libraryDirectory: 'lib',
      style: true 
    }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-syntax-dynamic-import'
  ]
}
```

# React-router
router使用最新的5版本，然后路由懒加载使用官方例子中的loadable，首先还是安装依赖
yarn add react-router-dom
yarn add @loadable/component @types/loadable__component @types/react-router-dom -D

让我们在 App.tsx 中使用它们
```js
import * as React from 'react'
import { HashRouter as Router, Route, Link } from "react-router-dom"
import loadable from '@loadable/component'

const HomeComponent = loadable(() => import(/* webpackChunkName: "home" */ './views/Home'))
const AboutComponent = loadable(() => import(/* webpackChunkName: "about" */ './views/About'))

class App extends React.Component {
  
  
  render() {

    return (
      <div className="app">
        <Router>
          <ul>
            <li>
              <Link to="/">To Home</Link>
            </li>
            <li>
              <Link to="/about">To About</Link>
            </li>
          </ul>
          <Route exact path='/' component={HomeComponent}></Route>
          <Route path='/about' component={AboutComponent}></Route>
        </Router>
        <p className="aps">hahahaahhahhahahaha</p>
      </div>
    )
  }
}

export default Ap
```