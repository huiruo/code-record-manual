
/*
* some() 依据判断条件，数组的元素是否有一个满足，若有一个满足则返回ture**
* */
let arr = [1,2,3,4,5]
let arr1 = arr.some( (i, v) => i < 3)
console.log(arr1)    // true

let arr2 = arr.some( (i, v) => i > 10)
console.log(arr2)    // false
