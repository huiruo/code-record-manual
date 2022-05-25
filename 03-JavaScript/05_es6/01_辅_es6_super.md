## super 这个关键字，既可以当作函数使用，也可以当作对象使用。
```
1.作为方法使用只能在子类的构造函数中。
2.作为对象使用，在普通方法中，指向父类的原型对象;在静态方法中，指向父类
```

### 1.作为函数调用
```js
class A {}
class B extends A {
  constructor() {
    // 此时代表父类的构造函数，表示执行父类A 的构造函数
    super(); //ES6 要求，子类的构造函数必须执行一次super函数
  }
}
注意：虽然super 代表了A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例。
super()在这里相当于A.protyty.constructor.call(this);
```

### 2.作为对象使用
1.在普通方法中，指向父类的原型对象
```js
class A {
  c() {
    return 2;
  }
}
class B extends A {
  constructor() {
    super();
    console.log(super.c()); // 2 这时，super在普通方法之中，指向A.prototype，所以super.c()就相当于A.prototype.c()
  }
}
let b = new B();
```
实例2：
```js
class A {
  constructor() {
    this.x = 1;
  }
  fn(){
  }
  // x(){
  // }
}
class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}
let b = new B();
console.log("A:",A.prototype)
解析：
上面代码中，super.x赋值为3，这时等同于对this.x赋值为3。而当读取super.x的时候，读的是A.prototype.x，所以返回undefined。
注意，使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错
```
