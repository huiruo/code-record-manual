
## 在Node环境中，有两种方法可以在一个模块中输出变量：
方法一：对module.exports赋值：
```javascript
// hello.js

function hello() {
    console.log('Hello, world!');
}

function greet(name) {
    console.log('Hello, ' + name + '!');
}

module.exports = {
    hello: hello,
    greet: greet
};
```
方法二：直接使用exports：
```javascript
// hello.js

function hello() {
    console.log('Hello, world!');
}

function greet(name) {
    console.log('Hello, ' + name + '!');
}

function hello() {
    console.log('Hello, world!');
}

exports.hello = hello;
exports.greet = greet;
```

但是你不可以直接对exports赋值：
```javascript
// 代码可以执行，但是模块并没有输出任何变量:
exports = {
    hello: hello,
    greet: greet
};
```

## 我们来分析Node的加载机制：
首先，Node会把整个待加载的hello.js文件放入一个包装函数load中执行。在执行这个load()函数前，Node准备好了module变量：
```javascript
var module = {
    id: 'hello',
    exports: {}
};
```
load()函数最终返回module.exports：
```javaScript
var load = function (exports, module) {
    // hello.js的文件内容
    ...
    // load函数返回:
    return module.exports;
};

var exported = load(module.exports, module);
```
也就是说，默认情况下，Node准备的exports变量和module.exports变量实际上是同一个变量，
并且初始化为空对象{}，于是，我们可以写：
```javaScript
exports.foo = function () { return 'foo'; };
exports.bar = function () { return 'bar'; };

// 也可以写：
module.exports.foo = function () { return 'foo'; };
module.exports.bar = function () { return 'bar'; };
```
换句话说，Node默认给你准备了一个空对象{}，这样你可以直接往里面加东西。

但是，如果我们要输出的是一个函数或数组，那么，只能给module.exports赋值：
```javaScript
module.exports = function () { return 'foo'; };
```
给exports赋值是无效的，因为赋值后，module.exports仍然是空对象{}。

## 结论
可以把exports看成是对module.exports的引用, 可以用exports.foo往里面增加新的属性, 但是如果直接对exports赋值, 
exports就不再是module.exports的引用了, 所以module.exports仍然为空对象{}

如果要输出一个键值对象{}，可以利用exports这个已存在的空对象{}，并继续在上面添加新的键值；
如果要输出一个函数或数组，必须直接对module.exports对象赋值。
所以我们可以得出结论：直接对module.exports赋值，可以应对任何情况：
```javaScript
module.exports = {
    foo: function () { return 'foo'; }
};

// 或者：
module.exports = function () { return 'foo'; };
```
最终，我们强烈建议使用module.exports = xxx的方式来输出模块变量，这样，你只需要记忆一种方法。
