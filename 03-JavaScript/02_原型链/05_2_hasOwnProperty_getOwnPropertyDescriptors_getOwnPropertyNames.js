/*
## 1.原型链查找性能:hasOwnProperty 是 JavaScript 中唯一一个处理属性并且不会遍历原型链的方法。
扩展：Object.getOwnProperty 用于返回对象的自有属性，包括可枚举和不可枚举的
* */
const object1 = {
  property1: 42,
};
Object.defineProperty(object1, "age", { value: "18", enumerable: false });// 增加不可枚举的属性age
Object.defineProperty(Object, "prototype2", { value: "18", enumerable: false });// 增加不可枚举的属性prototype2
Object.defineProperty(Object, "prototype3", { value: "18", enumerable: true });// 增加不可枚举的属性prototype3

console.log(object1.hasOwnProperty("property1")); // true

// Object.getOwnPropertyNames: [ 'property1', 'age' ]
console.log('Object.getOwnPropertyNames:', Object.getOwnPropertyNames(object1));
console.log('Object.prototype:', Object.prototype)

// 返回了对象的所有属性
console.log(Object.getOwnPropertyNames(Object));

console.log('test2:', Object.getOwnPropertyNames(object1))
/*
test2: [ 'property1', 'age' ]
* */

console.log('test1:', Object.getOwnPropertyDescriptors(object1))
/*
test1: {
  property1: { value: 42, writable: true, enumerable: true, configurable: true },
  age: {
    value: '18',
    writable: false,
    enumerable: false,
    configurable: false
  }
}
* */

console.log('obj1:', Object.prototype2)
console.log('obj2:', Object.length)
console.log('obj2:', Object.name)

// [ 'length', 'name', 'prototype', 'isArray', 'from', 'of' ]
console.log(Object.getOwnPropertyNames(Array)); // 返回了Array的属性:[ 'length', 'name', 'prototype', 'isArray', 'from', 'of' ]

console.log(Array.prototype)

