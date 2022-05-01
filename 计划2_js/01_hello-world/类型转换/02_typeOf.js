/*
一、若是基本数据类型返回对应的基本类型
二、若是复杂数据类型
*/
console.log('arr 返回:', typeof new Array()); //返回的是object

let fn = function () { };
console.log('function 返回:', typeof fn); //返回的是function

let nul = null;//（特别地）
console.log('null 返回：', typeof nul); //返回的是object

let objA = new Object();
console.log('Object 返回：', typeof objA); //返回的是object

console.log('undefined 返回：', typeof undefined); //  undefined

// 1.是否是函数
const isFun = (fun) => typeof fun === 'function'
console.log('是否是函数:', isFun('test'))

//3.是否对象
// 方法1：
let result = { a: '22' }
console.log('是否对象1:', typeof result === 'object' && result !== null)
//方法2
Object.prototype.toString.call(result) === '[object Object]'
console.log('是否对象2：:', Object.prototype.toString.call(result) === '[object Object]')


//判断是否空对象
//方法1
let obj = {}
console.log('是否空对象:', JSON.stringify(obj) === '{}')

//方法2
let obj2 = { a: 12 }

console.log('是否空对象:', Object.keys(obj2).length === 0)