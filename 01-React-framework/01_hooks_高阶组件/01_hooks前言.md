#### 1.1.Hooks 优点
* 比 HOC 更优雅的逻辑复用方式。HOC 可能会带来嵌套地狱，而 Hooks 可以让你在无需修改组件结构的情况下复用状态逻辑
  更加函数式。
* Hooks 可以更方便的让相关代码写在一起（可阅读性，可维护性更高）。Class Component 则会让相关代码分布在不同的声明周期中，不方便后续的代码维护以及阅读
* 没有 this 上下文的问题
* 更方便的依赖执行（useEffect, useMemo）。class component 需要在shouldComponentUpdate, componentDidUpdate... 这些生命周期中各种判断

#### 1.2.Hooks 不足
* 没有统一的错误处理。而 Class Component 中有 componentDidCatch 和 getDerivedStateFromError
* 只能在最顶层使用 Hook，并且必须确保 Hook 在每一次渲染中都按照同样的顺序被调用

#### 2.常用hooks
+ useContext()，共享钩子。该钩子的作用是，在组件之间共享状态。 可以解决react逐层通过Porps传递数据，它接受React.createContext()的返回结果作为参数，使用useContext将不再需要Provider 和 Consumer。

+ useReducer()，Action 钩子。useReducer() 提供了状态管理，其基本原理是通过用户在页面中发起action, 从而通过reducer方法来改变state, 从而实现页面和状态的通信。使用很像redux

+ useEffect()，副作用钩子。它接收两个参数， 第一个是进行的异步操作， 第二个是数组，用来给出Effect的依赖项

+ useRef()，获取组件的实例；渲染周期之间共享数据的存储(state不能存储跨渲染周期的数据，因为state的保存会触发组件重渲染）
useRef传入一个参数initValue，并创建一个对象{ current: initValue }给函数组件使用，在整个生命周期中该对象保持不变。

+ useMemo和useCallback：可缓存函数的引用或值，useMemo用在计算值的缓存，注意不用滥用。经常用在下面两种场景（要保持引用相等；对于组件内部用到的 object、array、函数等，如果用在了其他 Hook 的依赖数组中，或者作为 props 传递给了下游组件，应该使用 useMemo/useCallback）

+ useLayoutEffect：会在所有的 DOM 变更之后同步调用 effect，可以使用它来读取 DOM 布局并同步触发重渲染

#### 为什么要hooks？首先介绍高阶组件
高阶组件主要用于共享组件代码，强化组件功能等场景

高阶组件本身不是组件，它是一个参数为组件，返回值也是一个组件的函数。高阶作用用于强化组件，复用逻辑，提升渲染性能等作用。
+ 高阶组件是纯函数，不产生任何副作用；
+ 返回的新组件和参数传入的组件是两个完全独立的组件；
+ 不要在render方法中使用HOC，会发生组件不必要的卸载和重新渲染，影响性能问题；
+ 组件的ref不会被高阶组件获取，需要采用Refs转发；

```
`Reack Hooks 本身就是为了解决组件间逻辑公用的问题的。`

 预置了大量的Hooks， 最重要两个的就是： `useState` and `useEffect`.

useState 使我们在`不借助 ES6 class 的前提下， 在组件内部使用 state 成为可能`。

useEffect 取代了 `componentDidMount, componentDidUpdate, and componentWillUnmount`, 提供了一个`统一的API`。
```

##### 实例：
比如操作日志打印，权限控制等，以操作日志打印为例，要实现以下需求：在进入某些页面组件时，需要打印出日志并传送至服务器。
```javaScript
class Page1 extends React.Component {
  componentDidMount() {
    // 用console.log来模拟日志打印 实际上这里一般会传到服务器保存
    console.log('进入page1')；
  }
  
  render(){
    return <div>page1</div>
  }
}

class Page2 extends React.Component {
  componentDidMount() {
    console.log('进入page2')；
  }
  
  render(){
    return <div>page2</div>
  }
}
```
观察这 Page1 Page2 两种组件都存在一部分相似的逻辑：在 componentDidMount 阶段，需要console.log 当前的页面名称。

#### hooks的诞生，一大部分原因是解决无状态组件没有state和逻辑难以复用问题。

hooks可以将一段逻辑封装起来，做到开箱即用
