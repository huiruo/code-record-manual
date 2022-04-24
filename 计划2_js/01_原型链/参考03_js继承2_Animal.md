### 首先声明一个父类

```javascript
function Animal(name) {
    this.name = name || 'Animal';
    this.sleep = function () {
        console.log(this.name + '在睡觉呢~');
    }
}
Animal.prototype.eat = function (food) {
    console.log(this.name + '正在吃' + food);
}
```



01.不成熟的构造函数继承

> 对象dog继承了父类animal身上的属性和方法，不过属性相同，覆盖了父类的属性
>
> 特点： 1 ：子类共享父类的属性和方法
>
> ​            2：可以向父类传递参数
>
> 缺点：子类只能继承父类的属性和方法但并不能继承父类的原型身上的属性和方法

```js
function Dog(name) {
    Animal.call(this);
    this.name = name || 'dog';
}
var dog = new Dog();
console.log(dog);
```

### **2：原型链的继承**

> 特点：1：父类的属性和方法都能继承的到，包括父类原型身上的属性和方法也可以继承
>
> ​           2：简单，方便
>
> 缺点：1：创造子类实例时无法向父类传参
>
> ​           2：修改子类的原型对象的值父类的实例对象也会跟着改变
>
> ​           3：无法判断对象是子类实例化出来的还是父类实例化出来的。

```js
function Dog(name) {
    this.name = name || 'dog';
}
Dog.prototype = new Animal(); //Dog的原型与Animal实例出来的对象指向了同一块空间，改变任意一个值其他的都跟着改变
var dog = new Dog();
console.log(dog);
console.log(dog.constructor);  //指向了Animal
/*

   ƒ Animal(name){
      this.name =name || 'Animal';
      this.sleep=function(){
      console.log(this.name +'在睡觉呢~');
       }
    }

*/
```

### **3组合继承**

```js
function Dog(name) {
    Animal.call(this);
    this.name = name || 'dog';
}
//Dog.prototype=new Animal(); //缺点在子类实力化的过程中父类函数执行了2次
//Dog.prototype=Animal.prototype; //缺点 Dog Animal指向了同一块统建，当改变其中任意一个值另外一个也改变
//Dog.prototype.constructor=Dog造成Animal.prototype.constructor也成了Dog
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
var dog = new Dog();
console.log(dog.constructor);
/*

 ƒ Dog(name){
      Animal.call(this);
      this.name=name || 'dog';
 }

*/
```

