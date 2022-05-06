# 11.2.Redux 的基础概念和如何使用redux：
### 实现原理：参考上面的context和redux的联系
```
通过react-redux做连接，使用Provider：从最外部封装了整个应用，并向connect模块传递store。
Connect： 
    1、包装原组件，将state和action通过props的方式传入到原组件内部。
    2、监听store tree变化，使其包装的原组件可以响应state变化
```

简单地说就是：
1.顶层分发状态，让React组件被动地渲染。
2.监听事件，事件有权利回到所有状态顶层影响状态。

#### 1. Redux 的核心是一个 store。
```
store:首先要创建一个对象store，这个对象有各种方法，用来让外界获取Redux的数据（store.getState），或者让外界来修改Redux中的数据（store.dispatch）

import { createStore } from 'redux';
const store = createStore(reducer);
```