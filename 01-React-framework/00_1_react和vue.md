
#### 同
虚拟dom
以数据为驱动的开发模式，单向数据流，单向数据流就是model的更新会触发view的更新，view的更新不会触发model的更新，它们的作用是单向的

#### vue
1. Vue的template、script、style是分离的，可读性和可维护性比较好
2. 提供了便捷的模板命令
3. 更新方式
```
Vue 应用中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染,vue 改变状态this.属性

在Vue中，一个组件在渲染期间依赖于自动追踪，因此系统知道提前预判哪一个组件需要渲染当组件状态发生改变时。每个组件可以被认为具有自动为你实现shouldComponentUpdate，不需要注意嵌套的组件。

vue2.x在 new Vue() 之后。 Vue 会调用 _init 函数进行初始化，它会初始化生命周期、事件、 props、 methods、 data、 
computed 与 watch 等。其中最重要的是通过 Object.defineProperty 设置 setter 与 getter 函数，用来实现「响应式」以及「依赖收集」。

当vue中属性变化,首先触发Object.defineProperty中属性的set监听,执行updateComponent方法(异步),通过vm._render()更新虚拟dom,
vNode(新旧node对比),最后渲染到html中

关于Vue，当你把一个普通的 JavaScript 对象传给 Vue 实例的data选项，Vue 将遍历此对象所有的属性,把这些属性属性全部转为getter/setter。
并使用Object.defineProperty把这些属性全部转为getter/setter。从而实现响应式。

vue响应式更新，通过过劫持可以精确响应更新,检测到值的改变就会重新渲染(vue 值会立刻改变，但是 DOM 是异步更新的)
```
4. 二者双向绑定的不同：通过模板中的记号，组件上的最新数据会同步到model中的一个字段中。其他业务逻辑监听这个字段，当字段变化时业务逻辑执行。
```
react逻辑是state变化就会执行render，这时需要你自己处理数据结构，完成绑定，渲染更自由的view.

view value的变化除了自己监听view事件，没有其他方式感知其变了，它坚持了原生的逻辑，这时你也只能监听你需要的事件，自由的决定要更新哪些state。

你会发现此时就形成了闭环，state变化了又是新一轮的render。
```

#### react
1. 函数式编程，很好的配合ts
2. jsx,在js里面写html,一切都是js,方便实现复杂需求
3. 丰富的技术生态圈，拥有世界范围内各大技术社区支持
4. 函数式编程是用函数的组合来进行编程,带来的是组件化开发

其他：
```
react要有很强的组件分割意识才能写出比较流畅的代码。但是react的好处也比较明显，就是因为渲染可控，导致页面意外的bug及其少
```

5. 更新方式
```
react useMemo 或则旧版shouldComponentUpdate 决定组件是否需要重现渲染
react 改变state 需要this.setState()，react不允许直接更改状态，setState是异步的,会批量地对state进行更新以提高性能的,减少渲染次数.

所以，react没办法做到检测属性变化直接驱动render函数的执行，得依赖依赖setState调用.而且所有子组件会刷新。
（如果需要通过setState第二个参数传入callback能让你拿到更新后的state）
```