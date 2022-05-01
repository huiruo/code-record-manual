/*
* 1.官方
* */
let testArr = [1,2,3]
// let testArr = {}
console.log(Array.isArray(testArr));//true

/*
* 方式2：Object.prototype.toString().call()可以获取到对象的不同类型，例如
* */

console.log('is arr2:',Object.prototype.toString.call(testArr) === '[object Array]')

/*
* 方式3：instanceof运算符用于检验构造函数的prototype属性是否出现在对象的原型链中的任何位置，返回一个布尔值。
* 需要注意的是，prototype属性是可以修改的，所以并不是最初判断为true就一定永远为真。
* */

console.log('is arr3:',testArr instanceof Array)
