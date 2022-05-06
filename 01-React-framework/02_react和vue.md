#### 1.不同点
##### 1.1
+ Vue的template、script、style是分离的，可读性和可维护性比较好
+ React 重点还是只关注UI层，视图和业务逻辑是混合在一起的

#####  1.2.模板
+ vue template,在html 写js,开发效率高，api更多
+ react jsx,在js里面写html,一切都是js 可以实现复杂需求 

##### 更新方式不同
+ Vue 应用中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染,vue 改变状态this.属性

在Vue中，一个组件在渲染期间依赖于自动追踪，因此系统知道提前预判哪一个组件需要渲染当组件状态发生改变时。每个组件可以被认为具有自动为你实现shouldComponentUpdate，不需要注意嵌套的组件。
```
vue2.x在 new Vue() 之后。 Vue 会调用 _init 函数进行初始化，它会初始化生命周期、事件、 props、 methods、 data、 
computed 与 watch 等。其中最重要的是通过 Object.defineProperty 设置 setter 与 getter 函数，用来实现「响应式」以及「依赖收集」。

当vue中属性变化,首先触发Object.defineProperty中属性的set监听,执行updateComponent方法(异步),通过vm._render()更新虚拟dom,
vNode(新旧node对比),最后渲染到html中

关于Vue，当你把一个普通的 JavaScript 对象传给 Vue 实例的data选项，Vue 将遍历此对象所有的属性,把这些属性属性全部转为getter/setter。
并使用Object.defineProperty把这些属性全部转为getter/setter。从而实现响应式。

vue响应式更新，通过过劫持可以精确响应更新,检测到值的改变就会重新渲染(vue 值会立刻改变，但是 DOM 是异步更新的)

```

+ react useMemo 或则旧版shouldComponentUpdate 决定组件是否需要重现渲染
react 改变state 需要this.setState()，react不允许直接更改状态，setState是异步的,会批量地对state进行更新以提高性能的,减少渲染次数.

所以，react没办法做到检测属性变化直接驱动render函数的执行，得依赖依赖setState调用.而且所有子组件会刷新。
（如果需要通过setState第二个参数传入callback能让你拿到更新后的state）
#### 2.同
虚拟dom
以数据为驱动的开发模式，单向数据流，简而言之，单向数据流就是model的更新会触发view的更新，view的更新不会触发model的更新，它们的作用是单向的