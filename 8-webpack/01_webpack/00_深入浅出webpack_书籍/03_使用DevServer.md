


# 使用
npm i -D webpack-dev-server
安装后执行 webpack-dev-server命令，就可启动
```js
{
  "name": "dive-into-webpack",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack-dev-server --hot --devtool source-map"
  },
  "dependencies": {},
  "devDependencies": {
    "css-loader": "^0.28.4",
    "style-loader": "^0.18.2",
    "webpack": "^3.4.0",
    "webpack-dev-server": "^2.6.1"
  }
}
```