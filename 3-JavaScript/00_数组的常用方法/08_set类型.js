/*
* 1.set 使用
* */
const setArray = new Set([1, 1, 2, 2, 3]);

for (let value of setArray) {
    console.log('set使用', value);
}

// 1.array ---> set
let arr = [1, 2, 3, 4]
console.log('array ---> set:', new Set(arr))

// 2.set --->arr
let setTem = new Set([1, 2, 3, 4])
console.log('set --->arr:', Array.form(setTem))

/*
* 2.在数组去重中使用
* */

const unique = (arr) => Array.from(new Set(arr));

const arr = ['apple', 'banana', 'apple', 'pear', 'strawberry'];

console.log('在数组去重中使用:', unique(arr));

/*
* 3.set 的作用:
* 是如此强大，因此使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集
* */
// 1.数组去重
const mySet = new Set([1, 2, 3, 4, 4]);
console.log([...mySet]);
// (4) [1, 2, 3, 4]

// 2.并集
const aBing = new Set([1, 2, 3]);
const bBing = new Set([4, 3, 2]);
const union = new Set([...aBing, ...bBing]);
console.log("union:", union);
// union: Set(4) {1, 2, 3, 4}

// 3.交集
const aJiao = new Set([1, 2, 3]);
const bJiao = new Set([4, 3, 2]);
const intersect = new Set([...aJiao].filter(x => bJiao.has(x)));
console.log("intersect:", intersect);
// intersect: Set(2) {2, 3}

// 4.差集
const aCha = new Set([1, 2, 3]);
const bCha = new Set([4, 3, 2]);
const difference = new Set([...aCha].filter(x => !bCha.has(x)));
console.log("difference:", difference);
// difference: Set(1) {1}