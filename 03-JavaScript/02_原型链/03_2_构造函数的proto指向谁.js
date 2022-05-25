/*
 * ## 2021.7.15 面试重点
 * 构造函数的 proto 指向什么?
 * 答：指向构造A的构造函数Function的原型对象，也就是指向Function.prototype
 *
 * 构造函数的 prototype 指向什么?
 * 答：aPrototype: "test"
 * constructor: ƒ A()
 * [[Prototype]]: Object  ------->也就是 proto
 *
 * 构造出来的myA __proto__指向谁？
 * aPrototype: "test"
 * constructor: ƒ A()
 * [[Prototype]]: Object
 *
 *  当我们访问一个对象的属性时，如果对象内部找不到该属性，就会去实例化对象的属性__proto__指向的对象里面去找这个属性，
 * __proto__里面有它自己的__proto__ 属性，然后一直找下去，直到找到为止。如果直到最顶层的Object.prototype还是找不到，则返回undefined.
 * */
function A() { }
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
console.log("A.prototype:", A.prototype); // 见答案

console.log("myA:", myA);
console.log("myA:", myA.aPrototype); // test
console.log("myA.__proto__:", myA.__proto__);

console.log("A.prototype.constructor", A.prototype.constructor); //ƒ A() {}:A的原型的构造函数指向自己
console.log("2.是否等", A.prototype.constructor === A); //true
/*
A.prototype就是原型对象。原型对象也是对象，所以它也有proto属性，连接它的原型，
原型对象A.prototype的原型就是Object.prototype这个大boss，所有原型对象都是Object构造函数生成的
*/
