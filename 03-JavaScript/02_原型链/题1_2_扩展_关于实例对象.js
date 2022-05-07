
/*
//Object是Function的实例对象，即:
Object.__proto__.constructor;
//结果：ƒ Function() { [native code] }

// Function.prototype是Object的实例对象
Function.prototype.__proto__.constructor;
//结果：ƒ Object() { [native code] }

Object,Function都属于构造函数；
所有的构造函数是Function的实例，也就是说Function.prototype是所有构造函数的原型
Object是Function的实例对象
Function.prototype是Object的实例对象（prototype本质上也是一个对象）
* */

/*1.Object,Function都属于构造函数*/
Function;
//结果：ƒ Function() { [native code] }
Object;
//结果：ƒ Object() { [native code] }

/*Function.prototype是所有构造函数的原型*/
var F = function () { };
F.__proto__ == Function.prototype;
//结果：true
/*Object是Function的实例对象*/
Object.__proto__.constructor;
//结果：ƒ Function() { [native code] }

/*Function.prototype是Object的实例对象*/
Function.prototype.__proto__.constructor;
//结果：ƒ Object() { [native code] }

/*
结论：
Object.__proto__ ==  Function.prototype;
Function.__proto__ ==  Function.prototype;

Function.prototype.__proto__  ==  Object.prototype;
Function.__proto__.__proto__  ==  Object.prototype;
* */


