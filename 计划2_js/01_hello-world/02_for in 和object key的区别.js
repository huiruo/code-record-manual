/*
* #### 两者之间最主要的区别就是Object.keys( )不会走原型链，而for in 会走原型链；
* #### 区别2：Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组
* 一个数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致
* */

Object.prototype.test = 'test';

let testObj= { a:1, b:2, }

//Object.keys不会输出原型链中的数据；
console.log('Object.keys不会输出原型链中的数据:',Object.keys(testObj))
// ["a", "b"]

for(let key in testObj){
    console.log('for in 会把原型链中test 输出:',key)
}
// a
// b
// test　　　　//for in 会把原型链中test 输出