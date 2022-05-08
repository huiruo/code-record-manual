
参考自：
https://github.com/closertb/closertb.github.io/issues/57
#### 问题1 说说你对 React的理解
#### 问题2 react hooks用过么，知道其原理么；
第一个问题：

如果你提到了Fiber reconciler，fiber，链表，新的什么周期，可能在面试官眼里这仅仅是一个及格的回答。以下是我整理的，自我感觉还良好的回答：
分为下面4步：
```
react作为一个ui库，将前端编程由传统的命令式编程转变为声明式编程，即所谓的数据驱动视图，但如果简单粗暴的操作，
比如讲生成的html直接采用innerHtml替换，会带来重绘重排之类的性能问题。为了尽量提高性能，React团队引入了虚拟dom，
即采用js对象来描述dom树，通过对比前后两次的虚拟对象，来找到最小的dom操作（vdom diff），以此提高性能。
```
 
```
上面提到的vDom diff，在react 16之前，这个过程我们称之为stack reconciler，它是一个递归的过程，在树很深的时候，
单次diff时间过长会造成JS线程持续被占用，用户交互响应迟滞，页面渲染会出现明显的卡顿，这在现代前端是一个致命的问题。

所以为了解决这种问题，react 团队对整个架构进行了调整，引入了fiber架构，将以前的stack reconciler替换为
fiber reconciler。采用增量式渲染。引入了任务优先级(expiration)和requestIdleCallback的循环调度算法，简单来
说就是将以前的一根筋diff更新，首先拆分成两个阶段：reconciliation与commit;第一个reconciliation阶段是可打断的，
被拆分成一个个的小任务（fiber），在每一侦的渲染空闲期做小任务diff。然后是commit阶段，这个阶段是不拆分且不能打断的，
将diff节点的effectTag一口气更新到页面上。
```

```
由于reconciliation是可以被打断的，且存在任务优先级的问题，所以会导致commit前的一些生命周期函数多次被执行， 如
componentWillMount、componentWillReceiveProps 和 componetWillUpdate，但react官方已申明这些问题，并
将其标记为unsafe，在React17中将会移除
```

```
由于每次唤起更新是从根节点(RootFiber)开始，为了更好的节点复用与性能优化。在react中始终存workInprogressTree(future vdom) 
与 oldTree（current vdom）两个链表，两个链表相互引用。这无形中又解决了另一个问题，当workInprogressTree生成报错时，这时也不
会导致页面渲染崩溃，而只是更新失败,页面仍然还在。
```

以上就是我上半年面试自己不断总结迭代出的答案，希望能对你有所启发。

#### 2.第二个问题:hooks本质是什么？
数据驱动视图，简单来讲就是下面这个公式：
```
view = fn(state)
```
我们开发的整个应用，都是很多组件组合而成，这些组件是纯粹，不具备扩展的。因为React不能像普通类一样直接继承，从而达到功能扩展的目的
##### 2-1.hooks出现前的逻辑复用
在用react实现业务时，我们复用一些组件逻辑去扩展另一个组件，最常见比如Connect，Form.create, Modal。这类组件通常是一个容器，容器内部封装了一些通用的功能（非视觉的占多数），容器里面的内容由被包装的组件自己定制，从而达到一定程度的逻辑复用。

在hooks 出现之前，解决这类需求最常用的就两种模式：HOC高阶组件和 Render Props。

高阶组件类似于JS中的高阶函数，即输入一个函数，返回一个新的函数, 比如React-Redux中的Connect：
```javascript
class Home extends React.Component {
  // UI
}

export default Connect()(Home);
```

>高阶组件由于每次都会返回一个新的组件，对于react来说，这是不利于diff和状态复用的，所以高阶组件的包装不能在render 方法中进行，而只能像上面那样在组件声明时包裹，这样也就不利于动态传参。而Render Props模式的出现就完美解决了这个问题，其原理就是将要包裹的组件作为props属性传入，然后容器组件调用这个属性，并向其传参, 最常见的用props.children来做这个属性。举个🌰：
```javascript
class Home extends React.Component {
  // UI
}

<Route path = "/home" render= {(props) => <Home {...props} } />
```

##### 2-3.已存方案的问题 
- 嵌套地狱
上面提到的高阶组件和RenderProps, 看似解决了逻辑复用的问题，但面对复杂需求时，即一个组件需要使用多个复用逻辑包裹时，
两种方案都会让我们的代码陷入常见的嵌套地狱, 比如：
```
class Home extends React.Component {
  // UI
}

export default Connect()(Form.create()(Home));
```
除了嵌套地狱的写法让人困惑，但更致命的深度会直接影响react组件更新时的diff性能。

- 函数式编程的普及
```
Hooks 出现前的函数式组件只是以模板函数存在，而前面两种方案，某种程度都是依赖类组件来完成。而提到了类，就不得不想到下面这些痛点：

1.JS中的this是一个神仙级的存在, 是很多入门开发趟不过的坑；
2.生命周期的复杂性，很多时候我们需要在多个生命周期同时编写同一个逻辑
3.写法臃肿，什么constructor，super，render

所以React团队回归view = fn(state)的初心，希望函数式组件也能拥有状态管理的能力，让逻辑复用变得更简单，更纯粹。
```

##### 2-4.hooks
为什么在React 16前，函数式组件不能拥有状态管理？其本质是因为16以前只有类组件在更新时存在实例，而16以后Fiber 架构的出现，
让每一个节点都拥有对应的实例，也就拥有了保存状态的能力

请见下篇文章 02_hooks本质.md