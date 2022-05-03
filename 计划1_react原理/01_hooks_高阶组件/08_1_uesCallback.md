## uesCallback
会在组件第一次渲染的时候执行，之后会在其依赖的变量发生改变时再次执行。
可以把它理解成vue里面的computed，是一种数据的缓存，而这个缓存依赖后面的第二个参数数组，如果这个数组里面传入的数据不变，那么这个useMemo返回的数据是之前里面return的数据。
```
useCallback() 起到了缓存的作用，即便父组件渲染了，useCallback() 包裹的函数也不会重新生成，会返回上一次的函数引用。
```

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);

//把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 shouldComponentUpdate）的子组件时，它将非常有用。
```
#### useCallback 源码
ReactFiberHooks.new.js
```js
// 装载阶段
function mountCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  // 获取对应的 hook 节点
  const hook = mountWorkInProgressHook();
  // 依赖为 undefiend，则设置为 null
  const nextDeps = deps === undefined ? null : deps;
  // 将当前的函数和依赖暂存
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

// 更新阶段
function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // 获取上次暂存的 callback 和依赖
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1];
      // 将上次依赖和当前依赖进行浅层比较，相同的话则返回上次暂存的函数
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  // 否则则返回最新的函数
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

```
通过源码不难发现，useCallback 实现是通过暂存定义的函数，根据前后依赖比较是否更新暂存的函数，最后返回这个函数，从而产生闭包达到记忆化的目的。 这就直接导致了我想使用 useCallback 获取最新 state 则必须要将这个 state 加入依赖，从而产生新的函数。

大家都知道，普通 function 可以变量提升，从而可以互相调用而不用在意编写顺序。如果换成 useCallback 实现呢，在 eslint 禁用 var 的时代，先声明的 useCallback 是无法直接调用后声明的函数，更别说递归调用了。
```

#### useCallback的使用场景：
有一个父组件，其中包含子组件，子组件接收一个函数作为 props ；通常而言，如果父组件更新了，子组件也会执行更新；但是大多数场景下，更新是没有必要的，我们可以借助 useCallback 来返回函数，然后把这个函数作为 props 传递给子组件；这样，子组件就能避免不必要的更新。
```js
//使用useCallback之后，仅当 count 发生变化时Child组件才会重新渲染，而val变化时，Child 组件是不会重新渲染的
function Parent() {
    const [count, setCount] = useState(1);
    const [val, setValue] = useState('');
 
    const getNum = useCallback(() => {
        return Array.from({length: count * 100}, (v, i) => i).reduce((a, b) => a+b)
    }, [count])
 
    return <div>
        <Child getNum={getNum} />
        <div>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <input value={val} onChange={event => setValue(event.target.value)}/>
        </div>
    </div>;
}
 
const Child = React.memo(function ({ getNum }: any) {
    return <h4>总和：{getNum()}</h4>
})
```

#### useCallback的使用场景2：
从性能优化的角度看看 useCallback

当 DemoComponent 组件自身或跟随父组件触发 render 时，handleClick 函数会被重新创建。 每次 render 时 ChildComponent 参数中会接受一个新的 onClick 参数，这会直接击穿 React.memo，导致性能优化失效，并联动一起 render。

当然，官方文档指出，在组件内部中每次跟随 render 而重新创建函数的开销几乎可以忽略不计。若不将函数传给自组件，完全没有任何问题，而且开销更小。
```js
const ChildComponent = React.memo(() => {
  // ...
  return <div>Child</div>;
});

function DemoComponent() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    // 业务逻辑
  }
  return <ChildComponent onClick={handleClick} />;
}
```

`用useCallback包裹：`
这样 handleClick 就是 memoized 版本，依赖不变的话则永远返回第一次创建的函数。

但每次 render 还是创建了一个新函数，只是没有使用罢了。 

React.memo 与 PureComponent 类似，它们都会对传入组件的新旧数据进行 浅比较，如果相同则不会触发渲染。

如果去除依赖，这时内部逻辑取得的 count 的值永远为初始值即 0，也就是拿不到最新的值。
如果将内部的逻辑作为 function 提取出来作为依赖，这又会导致 useCallback 失效。
```js
const ChildComponent = React.memo(() => {
  // ...
  return <div>Child</div>;
});

function DemoComponent() {
  const [count, setCount] = React.useState(0);
  const handleClick = React.useCallback(() => {
    // 业务逻辑
    doSomething(count);
  }, []);

  return <ChildComponent onClick={handleClick} />;
}
```

`在 useCallback 加上依赖`
```js
const ChildComponent = React.memo(() => {
  // ...
  return <div>Child</div>;
});

function DemoComponent() {
  const [count, setCount] = React.useState(0);
  const handleClick = React.useCallback(() => {
    // 业务逻辑
    doSomething(count);
  }, [count]);

  return <ChildComponent onClick={handleClick} />;
}
```

#### 死循环例子
```js
先来分析下这段代码的用意，Child组件是一个纯展示型组件，其业务逻辑都是通过外部传进来的，这种场景在实际开发中很常见。

// 用于记录 getData 调用次数
let count = 0;

function App() {
  const [val, setVal] = useState("");

  function getData() {
    setTimeout(() => {
      setVal("new data " + count);
      count++;
    }, 500);
  }

  return <Child val={val} getData={getData} />;
}

function Child({val, getData}) {
  useEffect(() => {
    getData();
  }, [getData]);

  return <div>{val}</div>;
}

再分析下代码的执行过程：

1.App渲染Child，将val和getData传进去
2.Child使用useEffect获取数据。因为对getData有依赖，于是将其加入依赖列表
3.getData执行时，调用setVal，导致App重新渲染 
4.App重新渲染时生成新的getData方法，传给Child
5.Child发现getData的引用变了，又会执行getData
6.3 -> 5 是一个死循环
```


#### useCallback 需要配合memo 使用
如果不用useCallback, 任何一个输入框的变化都会导致另一个输入框重新渲染。
```javaScript
import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const Child = React.memo(function({ val, onChange }) {
  console.log("render...");

  return <input value={val} onChange={onChange} />;
});

function App() {
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");

  const onChange1 = useCallback(evt => {
    setVal1(evt.target.value);
  }, []);

  const onChange2 = useCallback(evt => {
    setVal2(evt.target.value);
  }, []);

  return (
    <>
      <Child val={val1} onChange={onChange1} />
      <Child val={val2} onChange={onChange2} />
    </>
  );
}
```