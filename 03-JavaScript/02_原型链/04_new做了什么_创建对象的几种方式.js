function Test() { }
const objTest = new Test();
/*
1.创建一个空对象，然后设置新对象的constructor属性为构造函数的名称，设置新对象的**proto**属性指向构造函数的prototype对象。
var objTest = {};  // 01.创建一个空对象
objTest.constructor = Test
objTest.__proto__ = Test.prototype

2.使用新对象调用函数，函数中的this被指向新实例对象
Test.call(objTest)

3.将初始化完毕的新对象地址，保存到等号左边的变量中
创建一个新的空的对象
把这个对象链接到原型对象上
这个对象被绑定为this
如果这个函数不返回任何东西，那么就会默认return this

总结：
1、创建一个空对象，并且 this 变量引用该对象，同时还继承了该函数的原型。
2、属性和方法被加入到 this 引用的对象中。
3、新创建的对象由 this 所引用，并且最后隐式的返回this。
* */

/*
 * ## 1.创建对象方式2：字面量,效率比较高
 * {}是字面量，可以立即求值，而new Object()本质上是方法（只不过这个方法是内置的）调用，既然是方法调用，就涉及到在
 * proto链中遍历该方法，当找到该方法后，又会生产方法调用必须的堆栈信息，方法调用结束后，还要释放该堆栈
 * */

console.log("分割线======》");
/*
* ## 2.Object.create()
Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的proto

具体三个步骤就是：
1. 创建一个对象
2. 继承指定父对象
3. 为新对象扩展新属性
//自己实现一个Object.create()：
Object.myCreate = function (obj, properties)  {
  var F = function ()  {}
  F.prototype = obj
  if (properties) {
     Object.defineProperties(F, properties)
  }
  return new F()
}
Object.myCreate({}, {a: {value: 1}}) //{a: 1}
* */
const person = {
  isHuman: false,
  printIntroduction: function () {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  },
};

const me = Object.create(person);

me.name = "Matthew"; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten

me.printIntroduction();
// expected output: "My name is Matthew. Am I human? true"
