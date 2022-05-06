var F = function(){};
Object.prototype.a = function(){};
Function.prototype.b = function(){};
var f = new F();

console.log(f.a)
console.log(f.b) // undefined

/*
第一，Function.prototype在声明一个函数的时候就会被实例化；
第二，在var f = new F()时，会创建新的对象，生成新的a方法，在f实例对a,b方法的查找上，原型链里不会去Function.prototype里，而是在Object.prot0type里，
第三， b方法实际一直都存在于构造函数的原型里，因为F是一个构造函数，所以F.b()是可以执行的；
第四， 实际上在此到题目的上下文中，创建的所有的Object.prototype都存在a方法，它对应的实例也都存在a方法,而b方法则是所有的Function.prototype都存在b方法，它对应的实例也都存在b方法;
* */

/*
Object,Function都属于构造函数；
所有的构造函数是Function的实例，也就是说Function.prototype是所有构造函数的原型
Object是Function的实例对象
Function.prototype是Object的实例对象（prototype本质上也是一个对象）
* */

/*1.Object,Function都属于构造函数*/
Function
//结果：ƒ Function() { [native code] }
Object
//结果：ƒ Object() { [native code] }

/*Function.prototype是所有构造函数的原型*/
var F = function(){}
F.__proto__ == Function.prototype
//结果：true
/*Object是Function的实例对象*/
Object.__proto__.constructor
//结果：ƒ Function() { [native code] }

/*Function.prototype是Object的实例对象*/
Function.prototype.__proto__.constructor
//结果：ƒ Object() { [native code] }

/*
结论：
Object.__proto__ ==  Function.prototype;
Function.__proto__ ==  Function.prototype;

Function.prototype.__proto__  ==  Object.prototype;
Function.__proto__.__proto__  ==  Object.prototype;
* */


/*
* 题目解析:
1.在var F = function(){}时，构造函数F已经对Function.prototype实例化了；
2.在Object.prototype.a = function(){};时，Object还没有实例化，prototype中成功添加了a方法；
3.在Function.prototype.b = function(){}时，由于Function.prototype已经被实例化了，此时F.__proto__ == Function.prototype;
4.当var f = new F();后,F构造函数进行了实例化，由于new的作用：
//一个new的过程
var obj = {};
obj.__proto__=F.prototype;
F.call(obj,...arg);

f.__proto__ == F.prototype
//结果： true
F.prototype.__proto__ == Object.prototype
//结果： true

此时，f.__proto__.__proto__ == Object.prototype;,当f.a()调用时，在原型链中就找到了此方法，而f.b()并没有找到。
* */