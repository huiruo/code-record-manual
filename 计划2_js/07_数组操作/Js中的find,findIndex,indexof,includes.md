


# 一、find
```
find是用来查找满足条件的第一项，找到了就返回，找不到返回undefined.该方法不会改变原数组。使用方法如下

var findArr = [1, 2, 3, 4];
var res1 = findArr.find(item => {
    return item > 2;
})
var res2 = findArr.find(item => {
    return item > 10;
})
console.log('res1', res1);
console.log('res2', res2);


find还有一个比较牛逼的地方，就是不会跳过空项，像map，filter等则会跳过
var findArr1 = [1, , 3];
console.log('--------find---------');
var res1 = findArr1.find((item, index) => {
    console.log(item, '----', index)
})
console.log('--------map---------');
findArr1.map((item, index) => {
    console.log(item, '----', index);
})
```

# 二、findIndex
```
findIndex是用来查找满足条件的第一项索引，找到了就返回该索引，找不到返回-1.

var findIndexArr = [1, 2, 3, 4];
var res1 = findIndexArr.findIndex(item => {
    return item > 2;
})
var res2 = findIndexArr.findIndex(item => {
    return item > 10;
})
console.log('res1', res1);
console.log('res2', res2);
//res1 2
//res2 -1
```

# 三、indexof
```
indexOf()方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。
语法:arr.indexOf(searchElement[, startIndex = 0]) startIndex代表搜素的起始位置默认为0，可选，
var indexOfArr = [1, 2, 3, 4];
indexOfArr.indexOf(2)  //1
indexOfArr.indexOf(2,2)//-1
indexOfArr.indexOf(9)  //-1
```

# 四、includes
```
includes() 方法用来判断一个数组是否包含一个指定的值，有则返回 true，否则返回false。

[1, 2, 3].includes(2); // true
 
[1, 2, 3].includes(4); // false
 
[1, 2, NaN].includes(NaN); // true
```

```
没有该方法之前，我们通常使用数组的indexOf方法，检查是否包含某个值。

if (arr.indexOf(el) !== -1) {
 
// ...
 
}

indexOf方法有两个缺点，一是不够语义化，它的含义是找到参数值的第一个出现位置，所以要去比较是否不等于 -1 ，表达起来不够直观。二是，它内部使用严格相当运算符（ === ）进行判断，这会导致对NaN的误判。
```
