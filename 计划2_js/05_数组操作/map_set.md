### map 使用场景
```
const codeMessage = new Map([
  [200, '请求返回成功'],
  [201, '新建或修改数据成功'],
  [202, '一个请求已经进入后台排队'],
  [204, '删除数据成功'],
  [400, '请求错误(InvalidParameter)'],
  [401, '用户没有权限'],
  [403, '用户得到授权，但是访问是被禁止的'],
  [404, 'Not found'],
  [408,'请求超时'],
  [410,'请求的资源被永久删除'],
  [500, '服务器内部错误(InternalError)'],
  [502, '网关错误'],
  [503, '服务不可用，服务器暂时过载或维护'],
  [504, '请求超时(Gateway Timeout)'],
]);

const errorReq:customRequest ={
	data: null, 
	code: status,
	msg:codeMessage.get(status)
}
```

### map 的作用
```
1:
“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

2:
如果需要“键值对”的数据结构，Map 比 Object 更合适。

3:
有时候需要增删key时，使用map也会比obj方便

4:
Map的作用就是做映射。对象也可以用来做映射，但由于对象的键名只能是字符串（或Symbol），因此存在一些限制，例如不能对对象进行映射。Map就没有这个限制，可以对任意类型进行映射。我有一次需要自己对DOM树进行遍历，由于遍历的规则可能导致重复访问节点，我就用Map将访问过的DOM节点映射为true，然后处理节点前进行判断。

const visited = new Map();
visited.set(node, true);
...
if (!visited.get(node)) {
	// 当前节点未访问过，进行处理
}

简而言之，在需要对除字符串以外的数据类型进行映射的时候，Map就可以派上用场。
```


###### 方法
```
clear 从映射中移除所有元素。
delete 从映射中移除指定的元素。
forEach 对映射中的每个元素执行指定操作。
get 返回映射中的指定元素。
has 如果映射包含指定元素，则返回 true。
set 添加一个新建元素到映射。
toString 返回映射的字符串表示形式。
valueOf 返回指定对象的原始值
```


```
Map是一种数据结构，由键值对组成。Map看起来像一个二维数组，存放着一对对键值对，可通过键名获取对应的键值。将一个对象数组（例如学生成绩对象）转化为Map，可以通过“学生姓名”获取“学生成绩”，Map查询速度更快。
```

```js
var scoreList = [
  { name: 'Tim', age: 18, score: 90 },
  { name: 'Tony', age: 17, score: 95 },
  { name: 'Kevin', age: 18, score: 91 }
];
var tempArray = [];
scoreList.forEach((item) => {
  tempArray.push([item.name, item.score]); // 转化成Map结构，通过键名查找score
})
var scoreMap = new Map(tempArray);
 
console.log(scoreMap); // Map结构
console.log(Array.from(scoreMap)); // 转化为数组的形式
console.log(`Kevin 's score: `, scoreMap.get('Kevin')); // get()获取‘Kevin’对应的键值
console.log(scoreMap.has('Tim')); // has()判断是否含有键名‘Tim’
```

##### map 区别
Map看起来跟Object对象相似，但还是有以下区别
```
1.Object对象的键名只能是“数值”或“字符串”类型，而Map的键名可以是任意类型“数值”、“字符串”、“undefined”、“null”、“对象”
2.接收后端返回的数据时，Map元素顺序与插入顺序相同，Object则按照键名的字典序排序
```

##### map 遍历
```
for of遍历可迭代对象——Map。区别for in与for of，for in遍历可迭代对象的key，或数组的下标；for of遍历可迭代对象的值
Map结构是一个二维数组，通过ES6数组解构获取元素值
```
```js
for (let [key, value] of scoreMap) {
  console.log(`${key} 's score: `,value);
}
```

### Set
特点是不能存放相同的元素，可用于数组去重
```
var setArray = new Set([1, 1, 2, 2, 3]);
 
for (let value of setArray) {
  console.log(value);
}
 
console.log(setArray);
console.log([...setArray]); // 转化为数组，或使用Array.from(setArray)

去重：
const unique = (arr) => Array.from(new Set(arr));
const arr = ['apple', 'banana', 'apple', 'pear', 'strawberry'];
console.log(unique(arr));
```

###### set方法
```
set 有add添加，delete删除，clear清楚所有，size长度

//将set转换为数组对象
set=Array.from(set)
```

###### 使用Array.filter和Array.indexOf 去重
```
const unique = (arr) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
const arr = ['apple', 'banana', 'apple', 'pear', 'strawberry'];
console.log(unique(arr));
```

使用Array.reduce和Array.includes
```
const unique = (arr) => {
  return arr.reduce((cur, next) => {
    return cur.includes(next) ? cur : [...cur, next];
  }, []); // cur的初始值为[]
}
const arr = ['apple', 'banana', 'apple', 'pear', 'strawberry'];
console.log(unique(arr));
```

#### set 的作用
```
// 1.数组去重
var mySet = new Set([1, 2, 3, 4, 4]);
console.log([...mySet]);
// (4) [1, 2, 3, 4]

// 2.并集
var a = new Set([1, 2, 3]);
var b = new Set([4, 3, 2]);
var union = new Set([...a, ...b]);
console.log("union:", union);
// union: Set(4) {1, 2, 3, 4}

// 3.交集
var a = new Set([1, 2, 3]);
var b = new Set([4, 3, 2]);
var intersect = new Set([...a].filter(x => b.has(x)));
console.log("intersect:", intersect);
// intersect: Set(2) {2, 3}

// 4.差集
var a = new Set([1, 2, 3]);
var b = new Set([4, 3, 2]);
var difference = new Set([...a].filter(x => !b.has(x)));
console.log("difference:", difference);
// difference: Set(1) {1}
```

