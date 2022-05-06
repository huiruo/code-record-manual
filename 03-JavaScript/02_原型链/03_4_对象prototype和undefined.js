
//步骤3：重点：探究new myA.prototype--->undefined
// 只有函数才有prototype
// myA.__proto__ === A.prototype
/*
prototype是“类”的原型，__proto__是对象的原型。
JS当然没有“类”，只有constructor。
constructor就是当你new fn()时的那个“fn”。
当new的时候，产生的实例的__proto__指向fn.prototype，两者是同一个东西。
*/
function A() {}
A.prototype.aPrototype = "test";

var myA = new A();
console.log("myA.__proto__", myA.__proto__); //
/*
{
  aPrototype: "test"
  constructor: ƒ A()
  [[Prototype]]: Object
}
*/

console.log("A.prototype", A.prototype);
console.log("myA.aPrototype:", myA.aPrototype); // test,它去proto 找到了 aPrototype
console.log("A.aPrototype:", A.aPrototype); // undefined
console.log("A.prototype.aPrototype:", A.prototype.aPrototype); // test
console.log("步骤3_是否:", myA.__proto__ === A.prototype); // true
console.log("myA.prototype", myA.prototype); // undefine :函数才有prototype