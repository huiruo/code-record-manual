var F = function (){}

Object.prototype.a = function (){}

Function.prototype.b = function (){}

var f = new F()
console.log(f.a)
console.log(f.b) // undefined
/*
f.a === Object.prototype.a //=> true
f.b === Function.prototype.b //=> false

var F = function(){};
Object.prototype.a = function(){};
F.prototype.b = function(){};
var f = new F(); 才可以取到 a b
* */

/*
new的过程拆分成以下三步：

1、 var f={}; 也就是说，初始化一个对象p。

2、 f.__proto__=F.prototype;

3、 F.call(f);也就是说构造p，也可以称之为初始化p。
* */
console.log(f.__proto__===F.prototype);  // 返回值为true，证明第2点

console.log(F.__proto__===Function.prototype);  // 返回值为true

console.log(F.prototype.__proto__===Object.prototype);  // 返回值为true

// 重点部分：console.log(f.__proto__.__proto__===Object.prototype);  // 返回值为true
/*
那么__proto__是什么？我们在这里简单地说下。每个对象都会在其内部初始化一个属性，就是__proto__，当我们访问一个对象的属性 时，如果这个
对象内部不存在这个属性，那么他就会去__proto__里找这个属性，这个__proto__又会有自己的__proto__，于是就这样 一直找下去，也就是我们平时所说的原型链的概念。

首先var F = function(){}; 可以得出 f.__proto__=F.prototype。

那么当我们调用 f.a 或者 f.b 时，首先 f 中没有 a 或者 b 这个属性， 于是，他就需要到他的__proto__中去找，也就是F.prototype，由于F.prototype中也没有 a 或者 b；

那就去 f.__proto__.__proto__找，也就是Object.prototype中去找，于是就找到了a这个属性。
说白了 这就是原型链的实现原理。
最后，我个人认为，其实prototype只是一个假象，它在原型链实现中只是起到了一个辅助作用，换言之，它只是在new的时候有着一定的价值，而原型链的本质，其实在于__proto__.
* */
