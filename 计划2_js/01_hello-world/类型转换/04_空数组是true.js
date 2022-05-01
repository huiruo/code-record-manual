
const testArr = []
if(testArr){
   console.log('能进入判断')
}
/*
* 步骤1：初始化后，即使数组arr中没有元素，也是一个object。
* typeof arr; // "object"
*
* 步骤2：object，用于判断条件时就会被转化为true。
* if(arr)console.log("it's true");
// it's true
* */

// 同理
if({}){
   console.log('能进入判断')
}

// 重点扩展：如果将arr与布尔值比较情况就不一样了
console.log('[] == false',[] == false) // true
console.log('[] == true',[] == true) // false
/*
* 任意值与布尔值比较，都会将两边的值转化为Number。
如arr与false比较，false转化为0，而arr为空数组，也转化为0。
Number(false)
// 0
Number(arr)
// 0

所以，当空数组作为判断条件时，相当于true。当空数组与布尔值直接比较时，相当于false。
也就出现了以下令人绕圈的现象：

[] == ![];
// true
* */
