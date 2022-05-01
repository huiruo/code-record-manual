/*
* 1-1.map键是否可重复? 不可
* 相比obj，Map专门设计用于频繁更新键值对，而且内置了具有可预测的名称和操作方法。
* */
let filters = new Map([
    ['breed', 'labrador'],
    ['size', 'large'],
    ['color', 'chocolate'],
])
console.log(filters.size) //3
filters.set('color','red') // 覆盖旧键
console.log(filters.get('color'));  // 'chocolate'
console.log(filters.delete('color'));
console.log(filters.get('color'));  // undefined
filters.clear()
filters.get('color');  // undefined

/*
* 1-2.基础使用场景
* */
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

console.log('map test:',codeMessage.get(504))

/* 2
* Map是一种数据结构，由键值对组成。Map看起来像一个二维数组，存放着一对对键值对，可通过键名获取对应的键值。
* 将一个对象数组（例如学生成绩对象）转化为Map，可以通过“学生姓名”获取“学生成绩”，Map查询速度更快。
* */
const scoreList = [
    { name: 'Tim', age: 18, score: 90 },
    { name: 'Tony', age: 17, score: 95 },
    { name: 'Kevin', age: 18, score: 91 }
];

const tempArray = [];
scoreList.forEach((item) => {
    tempArray.push([item.name, item.score]); // 转化成Map结构，通过键名查找score
})

const scoreMap = new Map(tempArray);

console.log('Map结构:',scoreMap); // Map结构
console.log(Array.from(scoreMap)); // 转化为数组的形式
console.log(`Kevin 's score: `, scoreMap.get('Kevin')); // get()获取‘Kevin’对应的键值
console.log(scoreMap.has('Tim')); // has()判断是否含有键名‘Tim’

/*
* 3.相对obj,map 遍历
* 常规对象里，为了遍历keys、values和entries，你必须将它们转换为数组，如使用Object.keys()、Object.values()和Object.entries()，
* 或使用for ... in，另外for ... in循环还有一些限制：它仅仅遍历可枚举属性、非Symbol属性，并且遍历的顺序是任意的。
*
* 在map 中：
* for of遍历可迭代对象——Map。区别for in与for of，for in遍历可迭代对象的key，或数组的下标；
* 使用for…of或forEach来遍历。这点不同的优点是为你的程序带来更高的执行效率
* Map结构是一个二维数组，通过ES6数组解构获取元素值
* */
for (let [key, value] of scoreMap) {
    console.log(`${key} 's score: `,value);
}

// 3-2.values() 方法:和keys方法对应，values方法返回的就是Map对象中的value集合。
const myMap2 = new Map([['Electronic Gadget', 'Smart Phone'], ['Input Devices', 'Mouse']]);
console.log('values():',myMap2.values());   //output: {"Smart Phone", "Mouse"}