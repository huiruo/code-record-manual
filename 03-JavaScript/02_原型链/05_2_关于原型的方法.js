
/*
#### 1.原型链查找性能:hasOwnProperty 是 JavaScript 中唯一一个处理属性并且不会遍历原型链的方法。
* */
const object1 = {
    property1: 42,
};

console.log(object1.hasOwnProperty("property1"));
// expected output: true

console.log('分割线=========>')

/*
* #### 1-2.扩展：为了遍历一个对象的所有属性时忽略掉继承属性，使用 hasOwnProperty()来过滤该对象上的继承属性。
* */

for (let i in object1) {
    if (object1.hasOwnProperty(i)) {
        console.log('1-2:',i);
    }
    console.log('in:',i)
}

/*
* #### 1-3.扩展：
* Object.keys()：返回一个数组，数组值为对象自有的属性，不会包括继承原型的属性
* for in :遍历对象可枚举属性，包括自身属性，以及继承自原型的属性
* */
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype = {
    sex: "男"
}

var man = new Person("张三", 18);
for (var key in man) {
    console.log('1-3:',key);//name age sex
}