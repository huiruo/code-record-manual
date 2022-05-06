/*
* ### 2021.7.15 面试重点
* 构造函数的 proto 指向什么?
* */
function A() {}
A.prototype.aPrototype = "test";

var myA = new A();

//步骤1：探究A.constructor 和 A.__proto__
console.log("A.constructor:", A.constructor); //ƒ Function() { [native code] } --->A 的构造函数是 Function
console.log("A.constructor.prototype:", A.constructor.prototype); //ƒ () { [native code] }
//指向构造A的构造函数Function的原型对象，也就是指向Function.prototype
console.log("A.__proto__:", A.__proto__); //ƒ () { [native code] }
//所以二者相等
console.log("0.是否等", A.__proto__ === A.constructor.prototype); // true

//步骤2：探究 A.prototype 和 A.prototype.constructor
console.log("A", A); // ƒ A() {}
console.log("1.是否等", A.prototype === A.__proto__); //false 肯定不等，两个不是一个东西
console.log("A.prototype:", A.prototype); //constructor: ƒ, 包括构造函数:而且构造函数是指向它自己,也就是ƒ A() {}
console.log("A.prototype.constructor", A.prototype.constructor); //ƒ A() {}:A的原型的构造函数指向自己
console.log("2.是否等", A.prototype.constructor === A); //true
/*
A.prototype就是原型对象。原型对象也是对象，所以它也有proto属性，连接它的原型，
原型对象A.prototype的原型就是Object.prototype这个大boss，所有原型对象都是Object构造函数生成的
*/