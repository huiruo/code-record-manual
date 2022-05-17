
/*
#### 重点：原型链和原型对象
> 只有函数才有 prototype,这个属性时一个指针，指向一个对象，它是显示修改对象的原型的属性。当试图访问一个对象的属性时，如果没有在该对象上找到，
它还会搜寻该对象的原型(prototype)，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。 准确地说，这些属
性和方法定义在 Object 的构造器函数(constructor functions)之上的`prototype`属性上，而非对象实例本身。

proto 和 prototype 的区别
proto 是一个对象的内置属性（请注意：prototype 是函数的内置属性，proto 是对象的内置属性）。
proto 指向的是当前对象的原型对象，而 prototype 指向的，是以当前函数作为构造函数构造出来的对象 的原型对象。
* */

//简略代码: myA实例的原型指向构造函数的原型
function FnA() { }
FnA.prototype.aPrototype = "test";

const myA = new FnA();
console.log("步骤3_是否:", myA.__proto__ === FnA.prototype); //true

//-FnA.prototype.constructor (A的原型的构造函数)指向自己
//-FnA 的原型内容
console.log("FnA.prototype:", FnA.prototype); //constructor: ƒ, 包括构造函数:而且构造函数是指向它自己,也就是ƒ FnA() {}
console.log("FnA.prototype.constructor", FnA.prototype.constructor); //ƒ FnA() {}:FnA的原型的构造函数是指向它自己,所以是点不完的

//-A的原型的原型指向 Object
console.log("FnA.prototype.__proto__:", FnA.prototype.__proto__); //指向Object:{}
console.log("3-2.是否等", FnA.prototype.__proto__ === Object.prototype); //true
//-最终指向null
console.log(
  "FnA.prototype.__proto__.__proto__:",
  FnA.prototype.__proto__.__proto__
); //null，所以它就是前面所提到的尽头

console.log("分割线==========>");
