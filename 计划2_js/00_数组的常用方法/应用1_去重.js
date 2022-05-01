
/*
* 1.使用 filter,见 01_filter.js
* */

/*
* 2.简单数组 见set
* return Array.from(new Set(array))
* */

/*
* 3.对象数组去重
*
* */
const uniqueArr = (array, key) => {
    let obj = {}
    const arrays = array.reduce((setArr, item) => {
        obj[item[key]] ? '' : (obj[item[key]] = true && setArr.push(item))
        return setArr
    }, [])
    return arrays
}

/*
* #### reduce
参数：
reduce(上一个并归值，当前项，当前项的索引，数组本身）
*
// 例：使用reduce()函数执行累加数组中所有数组的操作
let values = [1,2,3,4,5,6];
let sum = values.reduce((prev, cur, index, array) => prev + cur);
console.log(sum) // 打印出21
* */