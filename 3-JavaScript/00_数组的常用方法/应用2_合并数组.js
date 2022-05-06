/*
* 1. array.push.apply()进⾏数组合并
* 函数的apply⽅法有⼀个特性，那就是obj.func.apply(obj,argv)，argv是⼀个数组。
*
* 用apply将数组添加到另一个数组，调用数组的push函数的apply()
* */

const arr1 = [1, 2];
const arr2 = [3, 4, 5];

arr2.push.apply(arr2, arr1);
console.log('合并之后:', arr2)

/*
* concat()进⾏数组合并
* */
const arr1C = [1, 2];
const arr2C = [3, 4, 5];
console.log('concat:', arr1.concat(arr2));