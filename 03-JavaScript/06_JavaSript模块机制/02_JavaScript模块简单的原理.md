
```javascript
'use strict';

var s = 'Hello';

function greet(name) {
    console.log(s + ', ' + name + '!');
}

module.exports = greet;


// 其他模块使用
'use strict';

// 引入hello模块:其实变量greet就是在hello.js中我们用module.exports = greet;输出的greet函数。
var greet = require('./hello');

var s = 'Michael';

greet(s); // Hello, Michael!
```
### CommonJS规范 与实现
这种模块加载机制被称为CommonJS规范。在这个规范下，每个.js文件都是一个模块，它们内部各自使用的变量名和函数名都互不冲突

要实现“模块”这个功能，并不需要语法层面的支持。Node.js也并不会增加任何JavaScript语法。实现“模块”功能的奥妙就在于JavaScript
是一种函数式编程语言，它支持闭包。

如果我们把一段JavaScript代码用一个函数包装起来，这段代码的所有“全局”变量就变成了函数内部的局部变量。
hello.js
```javascript
var s = 'Hello';
var name = 'world';

console.log(s + ' ' + name + '!');
```

Node.js加载了hello.js后，它可以把代码包装一下。
这样一来，原来的全局变量s现在变成了匿名函数内部的局部变量。
如果Node.js继续加载其他模块，这些模块中定义的“全局”变量s也互不干扰。
所以，Node利用JavaScript的函数式编程的特性，轻而易举地实现了模块的隔离
```javascript
(function () {
    // 读取的hello.js代码:
    var s = 'Hello';
    var name = 'world';

    console.log(s + ' ' + name + '!');
    // hello.js代码结束
})();
```

#### 模块的输出module.exports怎么实现？
Node可以先准备一个对象module：
hello.js
```javascript
// 准备module对象:
var module = {
    id: 'hello',
    exports: {}
};
var load = function (module) {
    // 读取的hello.js代码:
    function greet(name) {
        console.log('Hello, ' + name + '!');
    }
    
    module.exports = greet;
    // hello.js代码结束
    return module.exports;
};
var exported = load(module);
// 保存module:
save(module, exported);
```
可见，变量module是Node在加载js文件前准备的一个变量，并将其传入加载函数，我们在hello.js中可以直接使用变量
module原因就在于它实际上是函数的一个参数：
```javascript
module.exports = greet;
```

通过把参数module传递给load()函数，hello.js就顺利地把一个变量传递给了Node执行环境，Node会把module变量保存到某个地方。

由于Node保存了所有导入的module，当我们用require()获取module时，Node找到对应的module，把这个module的exports变量返回，
这样，另一个模块就顺利拿到了模块的输出：
```javascript
var greet = require('./hello');
```
以上是Node实现JavaScript模块的一个简单的原理介绍。
