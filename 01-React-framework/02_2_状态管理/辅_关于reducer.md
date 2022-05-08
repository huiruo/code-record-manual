#### 数组的 reduce 和 map 区别
reducer，可以将其翻译为缩减器或者折叠器,这个名词其实是函数式编程当中的一个术语，在更多的情况下，reduce操作被称为Fold折叠
```
map的本意是映射，是转换，reduce是状态的累计

reduce返回的是函数经过执行运算后的结果，reduce累计运算,前两个元素作用得到结果后，继续和下一个元素运算.

reduce属于一种高阶函数，它将其中的回调函数reducer递归应用到数组的所有元素上并返回一个独立的值。 这也就是“缩减”或“折叠”的意义所在了。
总而言之一句话，redux当中的reducer之所以叫做reducer，是因为它和 Array.prototype.reduce 当中传入的回调函数非常相似。

纯函数规则是没有副作用。改变一个对象是一个副作用,所以reducer不能改变参数的值。
```

#### 2.为什么 称为 reducer？
```
之所以将这样的函数称之为reducer，是因为这种函数与被传入 Array.prototype.reduce(reducer, ?initialValue)
的回调函数属于相同的类型。
```

```javascript
// 以下代码示例来自 MDN JavaScript 文档

/* 这里的callback是和reducer非常相似的函数
 * arr.reduce(callback, [initialValue])
 */
var sum = [0, 1, 2, 3].reduce(function(acc, val) {
  return acc + val;
}, 0);
// sum = 6

/* 注意这当中的回调函数 (prev, curr) => prev + curr
 * 与我们redux当中的reducer模型 (previousState, action) => newState 看起来是不是非常相似呢
 */
[0, 1, 2, 3, 4].reduce( (prev, curr) => prev + curr );
```

```javascript
// 以下代码示例来自redux官方教程

// reducer接受state和action并返回新的state
const todos = (state = [], action) => {
  // 根据不同的action.type对state进行不同的操作
  switch (action.type) {
    case 'ADD_TODO':
      return [
        // 这里是ES7里的对象展开运算符语法
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];
    // 不知道是什么action类型的话则返回默认state
    default:
      return state;
  }
};
```