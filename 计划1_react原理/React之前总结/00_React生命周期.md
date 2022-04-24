

# 一. setState改变会触发的生命周期钩子
```
shouldComponentUpdate
componentWillUpdate
render
componentDidUpdate
```

# 二. props改变会触发的生命周期
当父组件更新导致子组件更新时，子组件的生命周期执行顺序是
componentWillReceiveProps --> shouldComponentUpdate --> componentWillUpdate --> render --> componentDidUpdate
```
componentWillReveiceProps
shouldComponentUpdate
componentWillUpdate
render
componentDidUpdate
```

# 挂载卸载过程
constructor()

componentWillMount()
```
componentWillMount() 一般情况写用到的比较少。constructor()已经初始化了数据但是DOM还未渲染
```

componentDidMount()
```
组件第一次渲染完成,此时DOM节点已经生成。一般在此方法中进行ajax请求,返回数据setState重新渲染
```
componentWillUnmount()
```
此处完成组件的卸载和数据销毁
```

# 更新过程
## componentWillReveiceProps(nextProps)
```

在接受父组件改变后的props需要重新渲染组件时用到的比较多。将nextProps的state为当前组件的state,从而渲染组件
```
## shouldComponentUpdate(nextProps, nextState)
```
可用于性能优化（部分更新）在setState后, state发生变化, return false时可以阻止组件更新。
父组件的重新渲染会导致子组件也重新渲染, 这个时候如果我们不需要所有子组件都跟着重新渲染, 可以在子组件的该生命周期中做判断
```
## componentWillUpdate(nextProps, nextState)
shouldComponentUpdate返回true,则进入改流程

## componentDidUpdate(preProps, preState)
```
组件的每次更新都会执行此钩子函数, 通过参数可以拿到更新前的props和state
```
