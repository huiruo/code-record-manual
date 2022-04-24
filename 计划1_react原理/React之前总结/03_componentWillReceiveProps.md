
https://zhuanlan.zhihu.com/p/89494013
## 一.componentWillReceiveProps
```
componentWillReceiveProps是React生命周期函数之一，在初始props不会被调用，它会在组件接受到新的props时调用。一般用于父组件更新状态时子组件的重新渲染。在react16.3之前，componentWillReceiveProps是在不进行额外render的前提下，响应props中的改变并更新state的唯一方式。
```

### 1.实战:刷礼物
```
  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps--->', nextProps.msgForGift);
    // if (nextProps.msg!== this.props.msg) {
    // this.setState({ msgForGift: nextProps.msg});
    // }
    // console.log('componentWillReceiveProps--->', nextProps);
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

### 2.基础:使用方法
```
 componentWillReceiveProps(nextProps) {
 //通过this.props来获取旧的外部状态,初始 props 不会被调用
 //通过对比新旧状态，来判断是否执行如this.setState及其他方法
 }
```
### 3.主要在以下两种情景使用：
* 从上传的props无条件的更新state
* 当props和state不匹配时候更新state
 
### 4.常见误区
无条件的更新state
```
class EmailInput extends Component {
  state = { email: this.props.email };
  componentWillReceiveProps(nextProps) {
 // 这样会覆盖内部 email的更新!
 this.setState({ email: nextProps.email });
 }
  handleChange = event => {
 this.setState({ email: event.target.value });
 };
  render() {
 return <input onChange={this.handleChange} value={this.state.email} />;
 }
}

从上述例子可以发现子组件的更新会被父组件的更新覆盖。并且大家在使用过程没有必要这样无条件更新，完全可以写成一个完全受控组件。
<input onChange={this.props.onChange} value={this.props.email} />
```

也可以对比新旧props状态:
```
 componentWillReceiveProps(nextProps) {
 if (nextProps.email !== this.props.email) {
 this.setState({ email: nextProps.email });
 }
 }

现在该组件只会在props改变时候覆盖之前的修改了，但是仍然存在一个小问题。例如一个密码管理网站使用了如上的输入组件。当切换两个不同的账号的时候，如果这两个账号的邮箱相同，那么我们的重置就会失效。因为对于这两个账户传入的email属性是一样的，即数据源相同。
```
