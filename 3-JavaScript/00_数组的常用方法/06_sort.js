/*
* 1.数组在原数组上进行排序，不生成副本
*/
let testArr = [6, 9, 2, 5]

console.log('升序：', testArr.sort((a, b) => a - b)) //[2, 5, 6, 9]

console.log('升序：', testArr.sort((a, b) => b - a)) // [9, 6, 5, 2]

/*
* 2-1.使用sort进行数组排序
* */
const numbers1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
console.log('使用sort进行数组排序:numbers.sort()', numbers1.sort());
// [1, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 9]  sort 默认

/*
* 看起来不大对，是吧？这是因为sort方法在对数组做排序时，把元素默认成字符串进行相互比较。我们可以传入自己写的比较函数。
* 因为数组里都是数，所以可以像下面这样写。
* */
const numbers2 = [1, 3, 3, 4, -1, 6, 7, 8, -2, 10, 11, 12, 13, 14, 15];
console.log('使用sort进行数组排序:numbers.sort((a, b) => a - b)', numbers2.sort((a, b) => a - b));
// [-2, -1, 1, 3, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 15]


/*
* 2-1.进行对象排序
* */
const friends = [
    { name: 'John', age: 30 },
    { name: 'Ana', age: 20 },
    { name: 'Chris', age: 25 },
];

function comparePerson(a, b) {
    if (a.age < b.age) {
        return -1;
    }
    if (a.age > b.age) {
        return 1;
    }
    return 0;
}

console.log('进行对象排序：friends.sort(comparePerson)', friends.sort(comparePerson));


/*
* 3.字符串排序
* */
let names = ['Ana', 'ana', 'john', 'John'];
console.log('3.字符串排序:names.sort()', names.sort());
/*
* JavaScript在做字符比较的时候，是根据字符对应的ASCII值来比较的。例如，A、J、a、j对应的ASCII值分别是65、74、97、106。
* 虽然a在字母表里是最靠前的，但J的ASCII值比a的小，所以排在了a前面。
* */

// 小写字母在前
names = ['Ana', 'ana', 'john', 'John'];
console.log('3.字符串排序:names.sort((a, b) => a.localeCompare(b))', names.sort((a, b) => a.localeCompare(b)));
