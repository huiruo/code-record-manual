####  map 的作用
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

##### map和 Object区别
Map看起来跟Object对象相似，但还是有以下区别
```
1.Object对象的键名只能是“数值”或“字符串”类型，而Map的键名可以是任意类型“数值”、“字符串”、“undefined”、“null”、“对象”
2.接收后端返回的数据时，Map元素顺序与插入顺序相同，Object则按照键名的字典序排序
```
JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键，这给它的使用带来了很大的限制。
例如：
假设有这么一个数据
```js
const dogs = [{name: 'max', size: 'small', breed: 'boston terrier', color: 'black'}, {name: 'don', size: 'large', breed: 'labrador', color: 'black'}, {name: 'shadow', size: 'medium', breed: 'labrador', color: 'chocolate'}
]
//现在我们想要数组对象可以添加值，删除值及清空数组，用普通对象的方法处理如下：
let filters = {};
function addFilters(filters, key, value) {
    filters[key] = value;
}
function deleteFilters(filters, key) {
    delete filters[key];
}
function clearFilters(filters) {
    filters = {};
    return filters;
}
```

为了解决这个问题，ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
当数据量很大的时候，使用对象存储显然是不合理的，比如有的key是同名的场景下对象是不能区分的。
Map的精髓：极快的查找速度

也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

#### 方法
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
