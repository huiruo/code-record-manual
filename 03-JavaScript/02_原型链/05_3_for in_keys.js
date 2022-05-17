
/*
* #### 为了遍历一个对象的所有属性时忽略掉继承属性，使用 hasOwnProperty()来过滤该对象上的继承属性。
* for...in的本意是用来遍历对象的属性，这就会导致遍历时上升到原型链的层次，不仅会遍历自身的属性，还会遍历继承获得的属性，然而有时这是不需要的。
* 总结2.Object.defineProperty把 数据属性之一的enumerable修改成true 才被for in 遍历
*
* 区别：Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组
 * */

const object1 = {
    property1: 42,
};
Object.defineProperty(object1, "age", {value:"18", enumerable:false});// 增加不可枚举的属性age
Object.defineProperty(object1, "age2", {value:"18", enumerable:true});// 增加不可枚举的属性age2
Object.defineProperty(Object, "prototype2", {value:"18", enumerable:false});// 增加不可枚举的属性age
Object.defineProperty(Object, "prototype3", {value:"18", enumerable:true});// 增加不可枚举的属性age
Object.prototype.protoPer_4 = 2;


for (let i in object1) {
    if (object1.hasOwnProperty(i)) {
        console.log("OwnProperty:", i);
    }else {
        console.log("in:", i);
    }
}
/*
OwnProperty: property1
OwnProperty: age2
in: protoPer_4
in-分割线======>
* */

console.log("in-分割线======>");
console.log("in-分割线======>");

/*
 * #### 1-3.扩展：
 * Object.keys()：返回一个数组，数组值为对象自有的属性，不会包括继承原型的属性,
 * 不包括继承自原型的属性和不可枚举的属性
 * for in :遍历对象可枚举属性，包括自身属性，以及继承自原型的属性
 * */
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype = { sex: "男" };
const man = new Person("张三", 18);
// 增加不可枚举的属性info
Object.defineProperty(man, "info", { value: "18", enumerable: false });
// 通过原型链增加属性，为一个函数
Object.prototype.protoPer1 = function () {
    console.log("name is tom");
};
// 通过原型链增加属性，为一个整型值2
Object.prototype.protoPer2 = 2;

for (let key in man) {
    console.log("1-3:", key);
}
// 可见for in  迭代了 Person 的原型对象: sex
// Object 的 protoPer1,protoPer2
/*
1-3: name
1-3: age
1-3: sex
1-3: protoPer1
1-3: protoPer2
* */

// 但是Object.keys 只遍历自身的属性: [ 'name', 'age' ]
console.log("Object.keys:", Object.keys(man));
