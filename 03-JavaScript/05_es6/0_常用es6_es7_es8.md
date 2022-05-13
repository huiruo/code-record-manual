### es6

#### 1.let，const

#### 2.默认参数

#### 3.模板字符串

#### 4.箭头函数=>
```
1.不需要 function 关键字来创建函数
2.省略 return 关键字
3.继承当前上下文的 this 关键字
箭头函数中，函数体内的`this`对象，就是定义时所在作用域的对象，而不是使用时所在的作用域的对象。
```

#### 5.解构

#### 6.新增方法 -- assign()
```
Object.assign(target, source1, ...source2);
```

#### 7.class 
extends 允许一个子类继承父类，需要注意的是，子类的constructor 函数中需要执行 super() 函数。
```javaScript
class Student {
  constructor() {
    console.log("I'm a student.");
  }
 
  study() {
    console.log('study!');
  }
 
  static read() {
    console.log("Reading Now.");
  }
}
 
console.log(typeof Student); // function
let stu = new Student(); // "I'm a student."
stu.study(); // "study!"
stu.read(); // "Reading Now."
```

#### 8.数组常用方法
Array.from() 目的：将类数组对象和可遍历对象转化为数组．
Array.of() 目的：将一组值转化为数组．
find()和findIndex()

#### 9.Promise es6 以及 async/await es7

#### 10. 模块化
```
export：用于规定模块的对外接口，即通过 export 可以获取模块的内容。
import：用于导入模块，即通过 import 可以与其他模块建立起联系。
```


### ES7

#### 1.Array.prototype.includes()
```javaScript
['a', 'b', 'c'].includes('a')  // true
```

### ES8
#### 1.async await

#### 2.Object.entries()
作用：将一个对象中可枚举属性的键名和键值按照二维数组的方式返回。
若对象是数组，则会将数组的下标作为键值返回。
```javaScript
Object.entries({ one: 1, two: 2 })    //[['one', 1], ['two', 2]]
Object.entries([1, 2])                //[['0', 1], ['1', 2]]
```

#### 3.Object.values()
只返回自己的键值对中属性的值。它返回的数组顺序，也跟Object.entries()保持一致
```javaScript
Object.values({ one: 1, two: 2 })            //[1, 2]
Object.values({ 3: 'a', 4: 'b', 1: 'c' })    //['c', 'a', 'b']
```

#### 4.padStart()和padEnd()

#### 5.Object.getOwnPropertyDescriptors()
该方法会返回目标对象中所有属性的属性描述符，该属性必须是对象自己定义的，不能是从原型链继承来的。

注意：
与getOwnPropertyDescriptor()比较
ES6中也有一个返回目标对象可枚举属性的方法
两者的区别：一个是只返回知道属性名的描述对象,一个返回目标对象所有自身属性的描述对象


```javaScript
const obj = {
    id: 1,
    name: 'test',
    get gender() {
        console.log('gender')
    },
    set grad(d) {
        console.log(d)
    }
}

console.log(Object.getOwnPropertyDescriptor(obj, 'id'))
        
//输出结果
{
id: {
  configurable: true,
  enumerable: true,
  value: 1,
  writable: true
}
```


```javaScript
const obj = {
    id:  1,
    name: 'test',
    get gender() {
        console.log('gender')
    },
    set grad(d) {
        console.log(d)
    }
}
console.log(Object.getOwnPropertyDescriptors(obj))
 //输出   
{
  gender: {
    configurable: true,
    enumerable: true,
    get: f gender(),
    set: undefined
  },
  grade: {
    configurable: true,
    enumerable: true,
    get: undefined,
    set: f grade(g)
  },
  id: {
    configurable: true,
    enumerable: true,
    value: 1,
    writable: true
  },
  name: {
    configurable: true,
    enumerable: true,
    value: 'test',
    writable: true
  }
}
```

#### 6.修饰器Decorator

