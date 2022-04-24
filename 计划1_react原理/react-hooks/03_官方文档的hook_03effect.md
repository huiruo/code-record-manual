### 01.

> 如果你熟悉 React class 的生命周期函数，你可以把 `useEffect` Hook 看做 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。



**01.在 React 组件中有两种常见副作用操作：需要清除的和不需要清除的。我们来更仔细地看一下他们之间的区别。**

> 在 React 的 class 组件中，`render` 函数是不应该有任何副作用的。一般来说，在这里执行操作太早了，我们基本上都希望在 React 更新 DOM 之后才执行我们的操作。
>
> 这就是为什么在 React class 中，我们把副作用操作放到 `componentDidMount` 和 `componentDidUpdate` 函数中。回到示例中，这是一个 React 计数器的 class 组件。它在 React 对 DOM 进行操作之后，立即更新了 document 的 title 属性

- 在class中：

在 React 的 class 组件中，`render` 函数是不应该有任何副作用的。一般来说，在这里执行操作太早了，我们基本上都希望在 React 更新 DOM 之后才执行我们的操作。

这就是为什么在 React class 中，我们把副作用操作放到 `componentDidMount` 和 `componentDidUpdate` 函数中。回到示例中，这是一个 React 计数器的 class 组件。它在 React 对 DOM 进行操作之后，立即更新了 document 的 title 属性

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
/*
注意，在这个 class 中，我们需要在两个生命周期函数中编写重复的代码。

这是因为很多情况下，我们希望在组件加载和更新时执行同样的操作。从概念上说，我们希望它在每次渲染之后执行 —— 但 React 的 class 组件没有提供这样的方法。即使我们提取出一个方法，我们还是要在两个地方调用它。
*/
```

- 使用 useEffect

```js
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
/*
我们声明了 count state 变量，并告诉 React 我们需要使用 effect。紧接着传递函数给 useEffect Hook。此函数就是我们的 effect。然后使用 document.title 浏览器 API 设置 document 的 title。我们可以在 effect 中获取到最新的 count 值，因为他在函数的作用域内。当 React 渲染组件时，会保存已使用的 effect，并在更新完 DOM 后执行它。这个过程在每次渲染时都会发生，包括首次渲染。

经验丰富的 JavaScript 开发人员可能会注意到，传递给 useEffect 的函数在每次渲染中都会有所不同，这是刻意为之的。事实上这正是我们可以在 effect 中获取最新的 count 的值，而不用担心其过期的原因。每次我们重新渲染，都会生成新的 effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect “属于”一次特定的渲染。我们将在本章节后续部分更清楚地了解这样做的意义。
*/
```

- **useEffect 会在每次渲染后都执行吗？** 是的，默认情况下，它在第一次渲染之后*和*每次更新之后都会执行。（我们稍后会谈到[如何控制它](https://zh-hans.reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)。）你可能会更容易接受 effect 发生在“渲染之后”这种概念，不用再去考虑“挂载”还是“更新”。React 保证了每次运行 effect 的同时，DOM 都已经更新完毕。
- **useEffect 做了什么？** 通过使用这个 Hook，你可以告诉 React 组件需要在渲染后执行某些操作。React 会保存你传递的函数（我们将它称之为 “effect”），并且在执行 DOM 更新之后调用它。在这个 effect 中，我们设置了 document 的 title 属性，不过我们也可以执行数据获取或调用其他命令式的 API。

> 提示
>
> 与 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 调度的 effect 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。大多数情况下，effect 不需要同步地执行。在个别情况下（例如测量布局），有单独的 [`useLayoutEffect`](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect) Hook 供你使用，其 API 与 `useEffect` 相同。



### 02.需要清除的 effect

之前，我们研究了如何使用不需要清除的副作用，还有一些副作用是需要清除的。例如**订阅外部数据源**。这种情况下，清除工作是非常重要的，可以防止引起内存泄露！现在让我们来比较一下如何用 Class 和 Hook 来实现。

- ### 使用 Class 的示例

```js
/*
在 React class 中，你通常会在 componentDidMount 中设置订阅，并在 componentWillUnmount 中清除它。例如，假设我们有一个 ChatAPI 模块，它允许我们订阅好友的在线状态。以下是我们如何使用 class 订阅和显示该状态：
*/
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
/*
你会注意到 componentDidMount 和 componentWillUnmount 之间相互对应。使用生命周期函数迫使我们拆分这些逻辑代码，即使这两部分代码都作用于相同的副作用。
*/
```

- ### 使用 Hook 的示例

```js
/*
你可能认为需要单独的 effect 来执行清除操作。但由于添加和删除订阅的代码的紧密性，所以 useEffect 的设计是在同一个地方执行。如果你的 effect 返回一个函数，React 将会在执行清除操作时调用它：
*/
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
/*
注意

并不是必须为 effect 中返回的函数命名。这里我们将其命名为 cleanup 是为了表明此函数的目的，但其实也可以返回一个箭头函数或者给起一个别的名字。
*/
```

- **为什么要在 effect 中返回一个函数？** 这是 effect 可选的清除机制。每个 effect 都可以返回一个清除函数。如此可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分。
- **React 何时清除 effect？** React 会在组件卸载的时候执行清除操作。正如之前学到的，effect 在每次渲染的时候都会执行。这就是为什么 React *会*在执行当前 effect 之前对上一个 effect 进行清除。我们稍后将讨论[为什么这将助于避免 bug](https://zh-hans.reactjs.org/docs/hooks-effect.html#explanation-why-effects-run-on-each-update)以及[如何在遇到性能问题时跳过此行为](https://zh-hans.reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)。



### 03.使用多个 Effect 实现关注点分离

使用 Hook 其中一个[目的](https://zh-hans.reactjs.org/docs/hooks-intro.html#complex-components-become-hard-to-understand)就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题。下述代码是将前述示例中的计数器和好友在线状态指示器逻辑组合在一起的组件：

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

可以发现设置 `document.title` 的逻辑是如何被分割到 `componentDidMount` 和 `componentDidUpdate` 中的，订阅逻辑又是如何被分割到 `componentDidMount` 和 `componentWillUnmount` 中的。而且 `componentDidMount` 中同时包含了两个不同功能的代码。

那么 Hook 如何解决这个问题呢？就像[你可以使用多个 *state* 的 Hook](https://zh-hans.reactjs.org/docs/hooks-state.html#tip-using-multiple-state-variables) 一样，你也可以使用多个 effect。这会将不相关逻辑分离到不同的 effect 中：

```js
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

**Hook 允许我们按照代码的用途分离他们，** 而不是像生命周期函数那样。React 将按照 effect 声明的顺序依次调用组件中的*每一个* effect。





### 04.通过跳过 Effect 进行性能优化

在某些情况下，每次渲染后都执行清理或者执行 effect 可能会导致性能问题。在 class 组件中，我们可以通过在 `componentDidUpdate` 中添加对 `prevProps` 或 `prevState` 的比较逻辑解决：

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

- hook 解决方案

这是很常见的需求，所以它被内置到了 `useEffect` 的 Hook API 中。如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React **跳过**对 effect 的调用，只要传递数组作为 `useEffect` 的第二个可选参数即可：

```js
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
/*
上面这个示例中，我们传入 [count] 作为第二个参数。这个参数是什么作用呢？如果 count 的值是 5，而且我们的组件重渲染的时候 count 还是等于 5，React 将对前一次渲染的 [5] 和后一次渲染的 [5] 进行比较。因为数组中的所有元素都是相等的(5 === 5)，React 会跳过这个 effect，这就实现了性能的优化。

当渲染时，如果 count 的值更新成了 6，React 将会把前一次渲染时的数组 [5] 和这次渲染的数组 [6] 中的元素进行对比。这次因为 5 !== 6，React 就会再次调用 effect。如果数组中有多个元素，即使只有一个元素发生变化，React 也会执行 effect。
*/
```



- 对于有清除操作的 effect 同样适用：

```js
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // 仅在 props.friend.id 发生变化时，重新订阅
```



### 05.注意：

> 注意：
>
> 如果你要使用此优化方式，请确保数组中包含了**所有外部作用域中会随时间变化并且在 effect 中使用的变量**，否则你的代码会引用到先前渲染中的旧变量。参阅文档，了解更多关于[如何处理函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)以及[数组频繁变化时的措施](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)内容。
>
> 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（`[]`）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。这并不属于特殊情况 —— 它依然遵循依赖数组的工作方式。
>
> 如果你传入了一个空数组（`[]`），effect 内部的 props 和 state 就会一直拥有其初始值。尽管传入 `[]` 作为第二个参数更接近大家更熟悉的 `componentDidMount` 和 `componentWillUnmount` 思维模式，但我们有[更好的](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)[方式](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)来避免过于频繁的重复调用 effect。除此之外，请记得 React 会等待浏览器完成画面渲染之后才会延迟调用 `useEffect`，因此会使得额外操作很方便。