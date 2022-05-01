/*
* 数组在原数组上进行排序，不生成副本
*/
let testArr = [6, 9, 2, 5]

console.log('升序：', testArr.sort((a, b) => a - b)) //[2, 5, 6, 9]

console.log('升序：', testArr.sort((a, b) => b - a)) // [9, 6, 5, 2]