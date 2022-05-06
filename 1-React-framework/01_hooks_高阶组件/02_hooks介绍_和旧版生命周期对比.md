#### 1.hooks下怎么模拟生命周期函数，模拟的生命周期和class中的生命周期有什么区别吗？
```javaScript
// componentDidMount 和 componentWillUnmount
// 通过使用 Hook，你可以把组件内相关的副作用组织在一起（例如创建订阅及取消订阅），而不要把它们拆分到不同的生命周期函数里
useEffect(()=>{
    console.log('componentDidMount')
    return () => {
        console.log('will unmount');
    }
}, [])

// componentDidUpdate 1
useEffect(()=>{
  document.title = `You clicked ${count} times`;
  return()=>{
    // 以及 componentWillUnmount 执行的内容       
  }
}, [count])

// componentDidUpdate 2
useEffect(() => console.log('mounted or updated'));

// shouldComponentUpdate, 只有 Parent 组件中的 count state 更新了，Child 才会重新渲染，否则不会。
/*
* React.memo 包裹一个组件来对它的 props 进行浅比较,但这不是一个 hooks，因为它的写法和 hooks 不同,其实React.memo 等效于 PureComponent，但它只比较 props。
* */ 
function Parent() {
  	const [count,setCount] = useState(0);
  	const child = useMemo(()=> <Child count={count} />, [count]);
  	return <>{count}</>
}

function Child(props) {
    return <div>Count:{props.count}</div>
}
```

#### 2.扩展,旧版react周期
```
React 16之后有三个生命周期被废弃(但并未删除)

componentWillMount
componentWillReceiveProps
componentWillUpdate

目前React 16.8 +的生命周期分为4个阶段,分别是初始化阶段,挂载阶段、更新阶段、卸载阶段。

```
- 初始化阶段

- `constructor` 构造函数，最先被执行,我们通常在构造函数里初始化state对象或者给自定义方法绑定this
- getDefaultProps   props默认值
- getInitialState tate默认值

挂载阶段:
```
getDerivedStateFromProps:static getDerivedStateFromProps(nextProps, prevState),这是个静态方法,当我们接收到新的属性想去修改我们state，可以使用getDerivedStateFromProps

render: render函数是纯函数，只返回需要渲染的东西，不应该包含其它的业务逻辑,可以返回原生的DOM、React组件、Fragment、Portals、字符串和数字、Boolean和null等内容

componentDidMount: 组件装载之后调用，此时我们可以获取到DOM节点并操作，比如对canvas，svg的操作，服务器请求，订阅都可以写在这个里面，但是记得在componentWillUnmount中取消订阅
```

更新阶段:
```
getDerivedStateFromProps: 此方法在更新个挂载阶段都可能会调用

shouldComponentUpdate:shouldComponentUpdate(nextProps, nextState),有两个参数nextProps和nextState，表示新的属性和变化之后的state，返回一个布尔值，true表示会触发重新渲染，false表示不会触发重新渲染，默认返回true,我们通常利用此生命周期来优化React程序性能

render: 更新阶段也会触发此生命周期

getSnapshotBeforeUpdate:getSnapshotBeforeUpdate(prevProps, prevState),这个方法在render之后，componentDidUpdate之前调用，有两个参数prevProps和prevState，表示之前的属性和之前的state，这个函数有一个返回值，会作为第三个参数传给componentDidUpdate，如果你不想要返回值，可以返回null，此生命周期必须与componentDidUpdate搭配使用

componentDidUpdate:componentDidUpdate(prevProps, prevState, snapshot),该方法在getSnapshotBeforeUpdate方法之后被调用，有三个参数prevProps，prevState，snapshot，表示之前的props，之前的state，和snapshot。第三个参数是getSnapshotBeforeUpdate返回的,如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，然后在 componentDidUpdate 中统一触发回调或更新状态。
```

```
卸载阶段:
componentWillUnmount: 会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作，例如，清除定时器，取消网络请求或清除在componentDidMount()中创建的订阅，清理无效的DOM元素等垃圾清理工作。
```

#### 3.扩展:react16之前的生命周期
```
- 初始化阶段

- - `constructor` 构造函数
  - `getDefaultProps``props`默认值
  - `getInitialState``state`默认值

- 挂载阶段

- - `componentWillMount` 组件初始化渲染前调用
  - `render` 组件渲染
  - `componentDidMount`组件挂载到 `DOM`后调用

- 更新阶段

- - `componentWillReceiveProps` 组件将要接收新 `props`前调用
  - `shouldComponentUpdate` 组件是否需要更新
  - `componentWillUpdate` 组件更新前调用
  - `render`组件渲染
  - `componentDidUpdate` 组件更新后调用

- 卸载阶段

- - `componentWillUnmount` 组件卸载前调用

总结：
1.componentWillMount() – 在渲染之前执行，在客户端和服务器端都会执行。---->React16弃用
2.componentDidMount() – 仅在初次渲染后在客户端执行。
3.componentWillReceiveProps() – 当从父类接收到 props 并且在调用另一个渲染器之前调用。---->React16弃用
4.shouldComponentUpdate() – 根据特定条件返回 true 或 false。如果你希望更新组件，请返回true 否则返回 false。默认情况下，它返回 false。
5.componentWillUpdate() – 在 DOM 中进行渲染之前调用。---->React16弃用
6.componentDidUpdate() – 在渲染发生后立即调用。
7.componentWillUnmount() – 从 DOM 卸载组件后调用。用于清理内存空间。
```