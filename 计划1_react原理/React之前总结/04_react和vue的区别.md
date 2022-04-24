**不同点：**

> 同：
>
> ```
> 虚拟dom
> 以数据为驱动的开发模式，单向数据流，简而言之，单向数据流就是model的更新会触发view的更新，view的更新不会触发model的更新，它们的作用是单向的
> ```
>
> ```
> 2.模板
> vue template,在html 写js,开发效率高，api更多
> react jsx,在js里面写html,一切都是js 可以实现复杂需求
> 
> 3.优化
> Vue 应用中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染
> react 优化shouldComponentUpdate 决定组件是否需要重现渲染
> 
> 4.状态管理
> //  
> 1.虽然都是异步渲染，但是两者不太一样。
> ---vue 改变状态this.属性
> ---react 改变state 需要this.setState()，react不允许直接更改状态，setState是异步的,会批量地对state进行更新以提高性能的,减少渲染次数.
> 
> vue2.x在 new Vue() 之后。 Vue 会调用 _init 函数进行初始化，它会初始化生命周期、事件、 props、 methods、 data、 computed 与 watch 等。其中最重要的是通过 Object.defineProperty 设置 setter 与 getter 函数，用来实现「响应式」以及「依赖收集」。
> 当vue中属性变化,首先触发Object.defineProperty中属性的set监听,执行updateComponent方法(异步),通过vm._render()更新虚拟dom,vNode(新旧node对比),最后渲染到html中
> 关于Vue，当你把一个普通的 JavaScript 对象传给 Vue 实例的data选项，Vue 将遍历此对象所有的属性,把这些属性属性全部转为getter/setter。并使用Object.defineProperty把这些属性全部转为getter/setter。从而实现响应式。
> vue响应式更新，通过过劫持可以精确响应更新,检测到值的改变就会重新渲染(vue 值会立刻改变，但是 DOM 是异步更新的)
> 
> 所以，react没办法做到检测属性变化直接驱动render函数的执行，得依赖依赖setState调用.而且所有子组件会刷新。（如果需要通过setState第二个参数传入callback能让你拿到更新后的state）
> ```
>
> **19.Vue中双向数据绑定是如何实现的？**
> 答：vue 双向数据绑定是通过 数据劫持 结合 发布订阅模式的方式来实现的， 也就是说数据和视图同步，数据发生变化，视图跟着变化，视图变化，数据也随之发生改变；
> 核心：关于VUE双向数据绑定，其核心是 Object.defineProperty()方法。
>
> dɪˈfaɪn  prɒpəti  
>
> uniapp typeof ins
>
> ```js
> //observer:观察者
> function observer(obj) {
> 	if (obj && typeof obj === 'object') {
> 		for (let key in obj) {
> 			if (!obj.hasOwnProperty(key)) break;
> 			defineReactive(obj, key, obj[key]);
> 		}
> 	}
> }
> function defineReactive(obj, key, value) {
> 	observer(value);
> 	Object.defineProperty(obj, key, {
> 		get() {
> 			return value;
> 		},
> 		set(newValue) {
> 			observer(newValue);
> 			if (value === newValue) return;
> 			value = newValue;
> 		}
> 	});
> }
> function $set(data, key, value) {
> 	defineReactive(data, key, value);
> }
> ```



### 02.react  向子组件传值的两种方式

> props
>
> context 
>
> **02.1.子组件改变父组件的数据**
>
> 子组件改变父组件state的办法只能是通过onClick触发父组件声明好的回调，也就是父组件提前声明好函数或方法作为契约描述自己的state将如何变化，再将它同样作为属性交给子组件使用。



**周期：**

> 1.componentWillMount() – 在渲染之前执行，在客户端和服务器端都会执行。---->React16弃用
> 2.componentDidMount() – 仅在初次渲染后在客户端执行。
> 3.componentWillReceiveProps() – 当从父类接收到 props 并且在调用另一个渲染器之前调用。---->React16弃用
>
> **componentDidMount和componentWillMount**
>
> ```
> 在componentWillMount中执行this.setState是不会触发二次渲染的。
> 
> 它也只会在挂载过程中被调用一次，它的作用和constructor没有太大差异。有很多人在componentWillMount中请求后台数据，认为这样可以更早的得到数据，componentWillMout是在render函数执行前执行的，虽然请求是在第一次render之前发送的，但是返回并不能保证在render之前完成。render不会等你慢慢请求.所以在渲染的时候没有办法等到数据到来再去setState触发二次渲染.
> 
> 仔细思考一下，componentWillMount好像没啥卵用了。正所谓存在即合理，在服务端渲染的场景中componentDidMount是不会被执行的，因此可以在componnetWillMount中发生AJAX请求。
> 
> 顺便说一句在es6中,使用extend component的方式里的constructor函数和componentWillMount是通用的作用,所以你在构造函数里初始化了组件的状态就不必在WillMount做重复的事情了.
> 
> React中不推荐在componentWillMount中发送异步请求。
> 
> 3.componentdidmount的优点
> componentDidMount呢?这个生命周期函数在是在render之后调用一次,component已经初始化完成了.
> 
> 在生产时,componentDidMount生命周期函数是最好的时间去请求数据,其中最重要原因:使用componentDidMount第一个好处就是这个一定是在组件初始化完成之后,再会请求数据,因此不会报什么警告或者错误,我们正常请教数据完成之后一般都会setState.
> ```
>
> 4.shouldComponentUpdate() – 根据特定条件返回 true 或 false。如果你希望更新组件，请返回true 否则返回 false。默认情况下，它返回 false。
> 5.componentWillUpdate() – 在 DOM 中进行渲染之前调用。---->React16弃用
> 6.componentDidUpdate() – 在渲染发生后立即调用。
> 7.componentWillUnmount() – 从 DOM 卸载组件后调用。用于清理内存空间。
>
> ```
> - 初始化阶段
> - - `constructor` 构造函数
>   - `getDefaultProps``props`默认值
>   - `getInitialState``state`默认值
> - 挂载阶段
> - - `componentWillMount` 组件初始化渲染前调用
>   - `render` 组件渲染
>   - `componentDidMount`组件挂载到 `DOM`后调用
> - 更新阶段
> - - `componentWillReceiveProps` 组件将要接收新 `props`前调用
>   - `shouldComponentUpdate` 组件是否需要更新
>   - `componentWillUpdate` 组件更新前调用
>   - `render` 组件渲染
>   - `componentDidUpdate` 组件更新后调用
> ```
>
> ```
> ### 第一次页面加载会触发哪几个钩子?
> > 答：beforeCreate， created， beforeMount， mounted
> 1.beforeCreate：
> 2.create
> 3.mounted
> 4.beforeUpdate
> 5.updated
> 6.beforeDestory
> 7.destroyed
> 
> 答：一般 created/beforeMount/mounted 皆可.
> (如果你要操作 DOM , 那肯定 mounted 时候才能操作.)
> ```



> 函数组件
>
> 无状态组件
>
> 展示组件
>
> 有状态组件：
>
> ```
> 这类组件可以通过setState()来改变组件的状态，并且可以使用生命周期函数
> ```
>
> 容器组件
>
> ```
> 容器组件用来包含展示其它组件或其它容器组件，但里面从来都没有html。
> ```
>
> 受控和非受控组件
>
> ```
> 例如input option radio 他们的状态是不受react控制的 而是控件本身具有的 我们把这样的组件称为非受控组件
> ```





> ### context 重点理解：
>
> ```
> 如果层级特别深 那么如果通过props层层传递是明显不合理的。这时我们就需要用到context上下文 通过设置上下文 任意一个后代元素都可以直接取到上下文的内容 不需要层层传递
> 
> 示例：**使用 context, 我们可以避免通过中间元素传递 props：**
> ```
>
> 很多优秀的React组件都通过Context来完成自己的功能，
>
> 比如react-redux的`<Provider />`，就是通过`Context`提供一个全局态的`store`，拖拽组件react-dnd，通过`Context`在组件中分发DOM的Drag和Drop事件。
>
> 路由组件react-router通过`Context`管理路由状态等等。在React组件开发中，如果用好`Context`，可以让你的组件变得强大，而且灵活。





> **实现原理：参考上面的context和redux的联系**
>
> ```
> 通过react-redux做连接，使用Provider：从最外部封装了整个应用，并向connect模块传递store。
> Connect： 
>  1、包装原组件，将state和action通过props的方式传入到原组件内部。
>  2、监听store tree变化，使其包装的原组件可以响应state变化
> ```
>
> ### **11.2.Redux 的基础概念和如何使用redux：**
>
> 简单地说就是：
> 1.顶层分发状态，让React组件被动地渲染。
> 2.监听事件，事件有权利回到所有状态顶层影响状态。
>
> 1. Redux 的核心是一个 store。
> 2. action:action 是一个 JavaScript 对象，通常包含了 type、payload 等字段，用于描述发生的事件及相关信息
>
> 3.reducer：撸开袖子真刀实枪的就去干了，比如一连长要求增援，增援要求是100杆枪，团长马上就给你加了100杆枪送了过去。**reducer 不是一个对象，而是一个返回更新后 state 的纯函数
>
> 5. **connect方法理解**：connect(mapStateToProps, mapDispatchToProps)(MyComponent)
>
> connect是真正的重点，它是一个科里化函数，意思是先接受两个参数（数据绑定mapStateToProps和事件绑定mapDispatchToProps），再接受一个参数（将要绑定的组件本身）：
> **5.1.mapStateToProps**：构建好Redux系统的时候，它会被自动初始化，但是你的React组件并不知道它的存在，因此你需要分拣出你需要的Redux状态，所以你需要绑定一个函数，它的参数是state，简单返回你关心的几个值。





> Q4:**BrowserRouter：h5路由（history API）和 HashRouter：哈希路由   的区别：早期实现页面哈希，使用的是锚点技术；**
>
> ```
> BrowserRouter 和 HashRouter 都可以实现前端路由的功能，区别是前者基于url的pathname段，后者基于hash段。
> 
> 　　前者：http://127.0.0.1:3000/article/num1
> 
> 　　后者：http://127.0.0.1:3000/#/article/num1（不一定是这样，但#是少不了的）
> ```
>
> Q3:那么为什么我们使用`this.props.history.push（url）出现了问题呢？







> ### 14.你对 React 的 refs 有什么了解？
>
> > Refs 是 React 中引用的简写。它是一个有助于存储对特定的 React 元素或组件的引用的属性，它将由组件渲染配置函数返回。用于对 render() 返回的特定元素或组件的引用。当需要进行 DOM 测量或向组件添加方法时，它们会派上用场。