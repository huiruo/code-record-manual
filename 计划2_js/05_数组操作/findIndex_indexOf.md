
### find()
```js
var testArr1 = [20,12,362,26,965,22,26,35];
var findItem1 = testArr1.find(function(item,index,arr){return item>26});
console.log(findItem1 )//362
```

```js
const sessionIndex = this.sessions.findIndex((item) => {
  return item.identifier === sessionId;
});
if (sessionIndex > -1) {
} else {
}
console.log('updateSessionByUndo_indexB:', sessionIndex);
```

### findIndex()与indexOf()用法与区别
1.find()与findIndex()参数与用法相同，不同的是find返回元素，findIndex返回索引；找不到时find返回undefined，findIndex返回-1.

2.findIndex()与indexOf()，findIndex比indexOf更强大一些，可以通过回调函数查找对象数组，indexOf只能查找数组中指定的值，不过indexOf可以指定开始查找位置的索引

```
findIndex()方法返回数组中第一个满足条件的索引,找不到返回-1 该方法ES6新增。

语法： arr.findIndex(callback)
callback函数有三个参数。
item：每一次迭代查找的数组元素。
index：每一次迭代查找的数组元素索引。
arr：被查找的数组
```

```js
var testArr1 = [20,12,362,26,965,22,26,35];
var index1 = testArr1.findIndex((item,index,arr)=>{return item>100});
console.log(index1)//2

filter:过滤数组
var testArr1 = [20,12,362,26,965,22,26,35];
var data = testArr1.filter((item,index,arr)=>{return item>100});
console.log(data)// [362, 965]

forEach过滤数组
var testArr1 = [20,12,362,26,965,22,26,35];
testArr1.forEach((item)=>{
	console.log("item",item)
})
```

###### indexOf
```
indexOf()方法返回在数组中可以找到指定元素的第一个索引，找不到返回-1。
语法：arr.indexOf(searchValue[, fromIndex = 0])
```
```js
var testArr = [20,12,362,26,965,22,26,35];
var index1 = testArr.indexOf(26);
console.log(index1)//3
```
