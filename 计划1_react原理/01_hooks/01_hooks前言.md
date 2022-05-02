
#### 为什么要hooks？首先介绍高阶组件
高阶组件主要用于共享组件代码，强化组件功能等场景

高阶组件本身不是组件，它是一个参数为组件，返回值也是一个组件的函数。高阶作用用于强化组件，复用逻辑，提升渲染性能等作用。
+ 高阶组件是纯函数，不产生任何副作用；
+ 返回的新组件和参数传入的组件是两个完全独立的组件；
+ 不要在render方法中使用HOC，会发生组件不必要的卸载和重新渲染，影响性能问题；
+ 组件的ref不会被高阶组件获取，需要采用Refs转发；

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
