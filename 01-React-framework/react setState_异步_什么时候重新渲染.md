
### 问题1：
setState()函数在任何情况下都会导致组件重渲染吗？如果setState中的state没有发生改变呢？

### 问题2：
如果state和从父组件传过来的props都没变化，那他就一定不会发生重渲染吗？

###### 问题1解答
没有导致state的值发生变化的this.setState()是否会导致重渲染----->会
```js
import React from 'react'
class Test extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      Number:1
    }
  }
  //这里调用了setState但是并没有改变setState中的值
  handleClick = () => {
     const preNumber = this.state.Number
     this.setState({
        Number:this.state.Number
     })
  }
  render(){
    console.log(this.state.Number)
    return(
	<h1 onClick = {this.handleClick}>
	  {this.state.Number}
	</h1>)
  }
}
从控制台的打印结果可以看出：共打印了15次1，但是组件并没有发生任何变化
```

###### 问题1解决：如何阻止组件的重渲染呢？shouldComponentUpdate
```js
//加入shouldComponentUpdate钩子
//在render函数调用前判断：如果前后state中Number不变，通过return false阻止render调用
  shouldComponentUpdate(nextProps,nextState){
      if(nextState.Number == this.state.Number){
        return false
      }
  }
加入上述代码后，打开控制台，点击按钮，还是白白的，说明无效的重渲染被我们阻止了
```

###### 问题2解答:组件的state和从父组件传递过来的props都没改变，组件还会重渲染吗 --->可能
解决：同样可以通过shouldComponentUpdate钩子进行阻止