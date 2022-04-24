### shouldComponentUpdate

**shouldComponentUpdate函数**是重渲染时render()函数调用前被调用的函数，它**接受两个参数：nextProps和nextState**，分别表示下一个props和下一个state的值。并且**，当函数返回false时候，阻止接下来的render()函数的调用，阻止组件重渲染**，而返回true时，组件照常重渲染。

```javascript
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
  //在render函数调用前判断：如果前后state中Number不变，通过return false阻止render调用
  shouldComponentUpdate(nextProps,nextState){
      if(nextState.Number == this.state.Number){
        return false
      }
  }
  render(){
    //当render函数被调用时，打印当前的Number
    console.log(this.state.Number)
    return(<h1 onClick = {this.handleClick} style ={{margin:30}}>
             {this.state.Number}
           </h1>)
  }
}
```