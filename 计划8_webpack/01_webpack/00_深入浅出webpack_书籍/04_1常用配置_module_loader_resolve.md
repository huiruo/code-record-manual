# 一.module:配置处理模块的规则

## 1.loader 配置模块的读取和 解析规则规则，通常用来配置Loader,类型为数组
数组里的每一项都描述了如何处理部分文件
类型为数组,数组里的每一项都描述了如何处理部分文件
```
三种方式：
1.条件匹配:通过test,include,exclude,来选中loader要应用规则的文件
2.应用规则：对选中的文件通过use 配置项来应用 Loader,
test: 匹配文件,可以是数组
include: 包含某文件
exclude: 排除某文件
use: use是每一个rule的属性，指定要用什么loader
```
```js
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

## 2.noParse:忽略对部分没采用模块化的文件的递归解析和处理。提高构建性能。
一些库如jq,chartJS大而没采用模块化标准让webpack 解析耗时又没意义

## 3.parser:细粒度地配置哪些模块被哪些模块解析

# 二.resolve 配置webpack 如何寻找模块所对应地文件。
webpack 内置js模块化语法解析功能，也可以自定义规则：
```js
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
## 1.alias:通过别名来将导入路径映射成一个新的导入路径
## 2.mainFields
## 3.extensions:当没有文件后缀，webpack配置在尝试过程中用到地后缀列表：
```js
extensions:['.js','.json']
```
## 3.其他

