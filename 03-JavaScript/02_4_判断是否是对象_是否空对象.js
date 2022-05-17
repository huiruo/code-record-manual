
/*
* typeof 操作符返回一个字符串，表示未经计算的操作数的类型。
* */
console.log(typeof true)           //  'boolean'
console.log(typeof 123)            //  'number'
console.log(typeof "abc")          // 'string'

console.log(typeof {})             // 'object'
console.log(typeof [])             //  'object'
console.log(typeof null)           // 'object'
console.log(typeof function() {})  // 'function'
console.log(typeof undefined)      // 'undefined'

/*
* 判断对象
* */
const obj = {}
const arr = []
// toString（推荐）
// 之所以使用Object.prototype.toString，而不是obj.toString是因为有些对象的原型可能重写了toString方法，
// 所以我们要显示的去调用Object.prototype.toString方法
console.log('1.',Object.prototype.toString.call(obj) === '[object Object]')

console.log('Object.prototype.toString.call(obj)',Object.prototype.toString.call(obj))
console.log('test:',Object.prototype.toString.call([]) === '[object Array]')  // true

// 方式2.instanceof 注意的是由于数组也是对象，因此用 arr instanceof Object 也为true。
// true
console.log('方式2：',obj instanceof Object)
// arr instanceof Object: true
console.log('arr instanceof Object:',arr instanceof Object)

// 方法3： 多重判断
let result = { a: '22' }
let result2 = []
console.log('是否对象1:', typeof result === 'object' && result !== null) // true
console.log('是否对象2_过滤不了数组:', typeof result2 === 'object' && result !== null) // true
console.log('数组是否对象3:', typeof result === 'object' && result instanceof Array  && result !== null) // false
// let target = result
let target = result2
console.log('{}是否对象4:', typeof target === 'object' && target instanceof Array  && target !== null) // true

/*
* 是否空对象
* */
//方法1: Object.keys
// 缺点：如同使用for in循环进行判断一样，Object.keys方法也只返回可枚举属性，所以并不是很完美。
let obj2 = { a: 12 }
console.log('是否空对象:', Object.keys(obj2).length === 0)

// getOwnPropertyNames 排除不可枚举属性
let obj3 = {}
// 增加不可枚举的属性age
Object.defineProperty(obj3, "age", {value:"18", enumerable:false});
const names = Object.getOwnPropertyNames(obj3)
console.log('排除不可枚举属性:',names,obj3.age)
console.log('排除不可枚举属性,见是非空对象:',names.length === 0)
console.log('排除不可枚举属性,使用keys,是空对象:',Object.keys(obj3).length === 0)

// 不常用stringify
let objA = {}
console.log('是否空对象:', JSON.stringify(objA) === '{}')


/*
* 3.判断是否数组
* */
// 方法1
console.log('test:',Object.prototype.toString.call([]) === '[object Array]')  // true

// 方法2
console.log('arr instanceof Array:',arr instanceof Array); // true

// 方法3：
console.log(Array.isArray(arr)) // true

// 方法4：对象的 constructor 属性
const arrA = [1,2,3,4]
console.log(arrA.constructor === Array) // true
