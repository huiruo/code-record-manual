### componentWillReceiveProps(nextProps)与shouldComponentUpdate(nextProps, nextState)

- 在同一个更新周期内两个nextProps是同一个东西，内容完全一样，都是当次更新周期内父组件传过来的props；那么，shouldComponentUpdate(nextProps, nextState)比componentWillReceiveProps(nextProps)多出来的nextState哪里来的呢？

- 或者说，为什么componentWillReceiveProps(nextProps)没有nextState呢？

  ```
  先说前者，刚才我们讲了两种进入shouldComponentUpdate(nextProps, nextState)的方式，nextProps由父组件的re-render负责传入，
  ----那nextState自然是由另外一种方式this.setState传入，那有没有可能nextState也由父组件的re-render传入呢？我猜应该是没有可能的，就我目前对react的学习来看，没见到有人能做在父组件里面调用子组件的setState()这种操作，要如我所猜的话，就刚好解答了那上面“或者说”后面的那个问题
  ```

  

- 子组件的this.setState()导致的update为甚么不走 componentWillReceiveProps(nextProps)的流程

> 通过`this.setState`方法触发的更新过程不会调用这个函数，这是这个函数适合根据新的`props`值（也就是参数`nextProps`）来计算出是不是要更新内部状态`state`。更新组件内部状态的方法是`this.setState`，如果`this.setState`的调用导致`componentWillReceiveProps(nextProps)`的再一次调用，那就是一个死循环了。

