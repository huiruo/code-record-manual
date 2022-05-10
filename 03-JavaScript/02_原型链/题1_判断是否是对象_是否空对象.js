
/*
* typeof 操作符返回一个字符串，表示未经计算的操作数的类型。
* */
console.log(typeof true)              //  'boolean'
console.log(typeof 123)              //  'number'
console.log(typeof "abc")          // 'string'

console.log(typeof function() {})  // 'function'
console.log(typeof {})              // 'object'
console.log(typeof [])              //  'object'
console.log(typeof undefined)      // 'undefined'
console.log(typeof null)              // 'object'

/*
* 2.如何判断对象
* */

const obj = {}
const arr = []
// toString（推荐）
// 之所以使用Object.prototype.toString，而不是obj.toString是因为有些对象的原型可能重写了toString方法，所以我们要显示的去调用Object.prototype.toString方法
console.log('1.',Object.prototype.toString.call(obj) === '[object Object]')

console.log('Object.prototype.toString.call(obj)',Object.prototype.toString.call(obj))

console.log('test:',Object.prototype.toString.call([]) === '[object Array]')  // true

// 2.instanceof
// 注意的是由于数组也是对象，因此用 arr instanceof Object 也为true。
console.log('方式2：',obj instanceof Object)
console.log('arr instanceof Object:',arr instanceof Object) // false
console.log('arr instanceof Array:',arr instanceof Array); // true


/*
* 是否空对象
* */
// 使用Object.keys方法判断
// Object.keys能返回对象自身上所有可枚举属性的名称所构成的数组，因此如果数组长度为0，那么就是一个空对象。
// 缺点：如同使用for in循环进行判断一样，Object.keys方法也只返回可枚举属性，所以并不是很完美。
// const isEmptyObj = obj => Object.keys(obj).length === 0
console.log('判断是否空对象1：',Object.keys(obj).length === 0)