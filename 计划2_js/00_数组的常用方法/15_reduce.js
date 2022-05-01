/*
* arr.reduce(callback, initialValue) 迭代数组的所有项，累加器，数组中的每个值（从左到右）合并，最终计算为一个值
* 参数： callback:
        previousValue 必选 --上一次调用回调返回的值，或者是提供的初始值（initialValue）
          currentValue 必选 --数组中当前被处理的数组项
          index 可选 --当前数组项在数组中的索引值
          array 可选 --原数组
     initialValue: 可选 --初始值

  实行方法：回调函数第一次执行时，preValue 和 curValue 可以是一个值，如果 initialValue 在调用 reduce() 时被提供，
* 那么第一个 preValue 等于 initialValue ，并且curValue 等于数组中的第一个值；
* 如果initialValue 未被提供，那么preValue 等于数组中的第一个值.
* */

let arr = [0, 1, 2, 3, 4]
let arr1 = arr.reduce((preValue, curValue) =>
    preValue + curValue
)
console.log(arr1)    // 10
