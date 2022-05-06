/*
 * 1.函数中的this是在运行时决定的，而不是函数定义时
 * */
function foo(name1, name2) {
  console.log(this.fruit);
  if (name1 || name2) {
    console.log("apply和call得区别：", "name1:", name1, "name2:", name2);
  }
}

var fruit = "apple";

foo(); // apple 注意：这是在浏览中运行结果，在node中为 undefined

var pack = {
  fruit: "orange",
  foo: foo,
};

pack.foo(); // "orange"

/*
 * call和bind传参都是参数列表
 * 而apply 传参是以参数数组，bind返回的是函数
 * */
// 1-2.apply 和 call 用法
foo.apply(pack, ["name1", "name2"]);
foo.call(pack, "name3", "name3");

console.log("分割线--------->");
/*
 * 2.例子:apply改变了this,但是再次调用还是指向原本的作用域,即只有时效性
 * */
function FnA() {
  this.flag = "A";
  this.tip = function () {
    console.log("log1", this.flag);
  };
}

function FnB() {
  this.flag = "B";
}

const objA = new FnA();
const objB = new FnB();

objA.tip.apply(objB); // log1 B
objA.tip(); // log1 A
