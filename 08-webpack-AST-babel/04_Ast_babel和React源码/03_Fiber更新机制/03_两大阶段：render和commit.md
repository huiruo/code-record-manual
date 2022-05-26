# 四 两大阶段：render和commit

## 1.render

render阶段主要涉及两个过程: beginWork 和 completeUnitOfWork。

beginWork
- 执行部分生命周期和render，得到最新的 children
- 向下遍历调和 children ，复用 oldFiber
- 打不同的副作用标签effectTag，比如类组件的生命周期，或者元素的增加，删除，更新。

### completeUnitOfWorkm
completeUnitOfWork 的流程是自下向上的

- 将effectTag 的 Fiber 节点保存到 effectList 的单向链表中。 在 commit 阶段，将不再需要遍历每一个 fiber ，只需要执行更新 effectList 就可以了。
- 处理组件的context，初始化元素标签，生成真实DOM，处理props，等

## 2.commit
commit 可以分为3个阶段：

- Before mutation 阶段（执行 DOM 操作前）；

- mutation 阶段（执行 DOM 操作）；

- layout 阶段（执行 DOM 操作后）
#### 三个阶段解析
1. Before mutation
    - 对于类组件，执行 getSnapshotBeforeUpdate 生命周期
    - 对于函数组件，异步调用 useEffect

2. Mutation
    - 进行真实的 DOM 操作

3. Layout
    - 对于类组件，会执行setState的callback
    - 对于函数组件，会执行useLayoutEffect