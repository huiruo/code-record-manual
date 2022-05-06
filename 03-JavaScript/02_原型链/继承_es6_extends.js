/*
* ES6 的继承机制完全不同，实质上是先创建父类的实例对象 this（所以必须先调用父类的 super()方法），然后再用子类的构造函数修改 this。
*

1.class 可以理解为function,由于class本质还是一个function,因此它也会拥有一个的prototype属性，当new一个class时，
会把class的 porototype 属性赋值给这个新对象的 __proto属性。

2.constructor 方法是默认添加的方法，在new一个对象时，自动调用该方法，constructor里面定义自己的属性。

3.继承extends和super，class 子类名 extends 父类名实现继承，当然还得在constructor里面写上super(父类的参数)，意思就是在子类中
获得父类的this指针，相当于Animal.call(this)
* */
class Person {
  constructor(name, age) {
    //一,类的构造方法
    this.name = name;
    this.age = age;
  }
  //类的一般方法
  showName() {
    console.log(this.name);
  }
  eat() {
    console.log(this.name + ":" + "eat");
  }
  walk() {
    console.log(this.name + ":" + "walk");
  }
}

class ChinesePerson extends Person {
  constructor(name, age, salary) {
    //props是继承过来的属性，myAttribute是自己的属性
    // 调用实现父类的构造函数,子类必须在constructor方法中调用super方法，否则新建实例时会报错
    super(name, age); //重点必须的：通过super调用父类的构造方法：调用父类的constructor(),Person.call(this, name,name);
    this.salary = salary;
  }

  showName() {
    //父类方法重写
    console.log(this.name, this.age, this.salary);
  }
  // 私有方法
  writeChinese() {
    console.log(this.name + "write chinese");
  }
}
let p1 = new ChinesePerson("Tom", 25, 200); //重点：对应的
console.log(p1); //ChinesePerson{ name: "Tom", age: 25, salary: 200}
p1.showName(); //name3 25 200
p1.walk();
