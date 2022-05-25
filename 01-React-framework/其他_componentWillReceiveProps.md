## 1.componentWillReceiveProps
componentWillReceiveProps 这个一般是根据 props 决定要不要做什么事情，
比如可以在这里面调用 setState 触发渲染

componentWillReceiveProps是React生命周期函数之一，在初始props不会被调用，它会在组件接受到新的props时调用。一般用于父组件更新状态时子组件的重新渲染。在react16.3之前，componentWillReceiveProps是在不进行额外render的前提下，响应props中的改变并更新state的唯一方式。

主要在以下两种情景使用
* 从上传的props无条件的更新state
* 当props和state不匹配时候更新state
```javaScript
componentWillReceiveProps(nextProps) {
  //通过this.props来获取旧的外部状态,初始 props 不会被调用
  //通过对比新旧状态，来判断是否执行如this.setState及其他方法
}
```

## 1.实战:刷礼物
```javaScript
componentWillReceiveProps(nextProps) {
  const { msgForGift, gbCacheStore } = nextProps;
  if (Object.keys(msgForGift).length !== 0) {
    const { currentTimer } = msgForGift;
    if (currentTimer !== this.props.msgForGift.currentTimer) {
      //console.log('componentWillReceiveProps-有礼物数据--->',gbCacheStore);
      const animObj = this.generateAnimRule(msgForGift, gbCacheStore);
      this.animationEHandler(msgForGift, gbCacheStore, animObj);
    }
  }
}
```



## componentWillReceiveProps(nextProps)与shouldComponentUpdate(nextProps, nextState)

- 在同一个更新周期内两个nextProps是同一个东西，内容完全一样，都是当次更新周期内父组件传过来的props；那么，shouldComponentUpdate(nextProps, nextState)比componentWillReceiveProps(nextProps)多出来的nextState哪里来的呢？

- 或者说，为什么componentWillReceiveProps(nextProps)没有nextState呢？

  ```
  先说前者，刚才我们讲了两种进入shouldComponentUpdate(nextProps, nextState)的方式，nextProps由父组件的re-render负责传入，
  ----那nextState自然是由另外一种方式this.setState传入，那有没有可能nextState也由父组件的re-render传入呢？我猜应该是没有可能的，就我目前对react的学习来看，没见到有人能做在父组件里面调用子组件的setState()这种操作，要如我所猜的话，就刚好解答了那上面“或者说”后面的那个问题
  ```

  

- 子组件的this.setState()导致的update为甚么不走 componentWillReceiveProps(nextProps)的流程

> 通过`this.setState`方法触发的更新过程不会调用这个函数，这是这个函数适合根据新的`props`值（也就是参数`nextProps`）来计算出是不是要更新内部状态`state`。更新组件内部状态的方法是`this.setState`，如果`this.setState`的调用导致`componentWillReceiveProps(nextProps)`的再一次调用，那就是一个死循环了。

