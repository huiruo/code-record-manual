读到这里，你就应该明白hooks 到底是怎么实现的：

> 闭包加两级链表

虽然我这里只站在useState这个hooks做了剖析，但其他hooks的实现基本类似。

另外分享一下在我眼中的hooks，与类组件到底到底是什么联系：
+ useState: 状态的存储及更新，状态更新会触发组件更新，和类的state类似，只不过setState更新时是采用Object.assign(oldstate, newstate); 而useState的set是直接替代式的


+ useEffect: 类似于以前的componentDidMount 和 componentDidUpdate生命周期钩子(即render 执行后，再执行Effect, 所以当组件与子组件都有Effect时，子组件的Effect先执行)， Update需要deps依赖来唤起；


+ useRefs: 用法类似于以前直接挂在类的this上，像this.selfCount 这种，用于变量的临时存储，而又不至于受函数更新，而被重定义；与useState的区别就是，refs的更新不会导致Rerender


+ useMemo: 用法同以前的componentWillReceiveProps与getDerivedStateFromProps中，根据state和props计算出一个新的属性值：计算属性


+ useCallback: 类似于类组件中constructor的bind，但比bind更强大，避免回调函数每次render造成回调函数重复声明，进而造成不必要的diff；但需要注意deps，不然会掉进闭包的坑


+ useReducer: 和redux中的Reducer相像，和useState一样，执行后可以唤起Rerender