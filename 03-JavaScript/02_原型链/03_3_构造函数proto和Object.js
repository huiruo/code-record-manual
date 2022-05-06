/*
步骤2：探究 A.prototype.__proto__ 和 object
* */

function A() {}
A.prototype.aPrototype = "test";

var myA = new A();
console.log("A.prototype.__proto__:", A.prototype.__proto__); //指向Object
console.log("3-1.是否等", A.prototype.__proto__ === Object); //false,Object 是一个构造函数
console.log("3-2.是否等", A.prototype.__proto__ === Object.prototype); //true
console.log("Object", Object); //console.log(Object.prototype) //输出{}
console.log(
  "A.prototype.__proto__.__proto__:",
  A.prototype.__proto__.__proto__
); //null，所以它就是前面所提到的尽头
