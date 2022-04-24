

### 从性能优化的角度看看 useCallback
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
当 DemoComponent 组件自身或跟随父组件触发 render 时，handleClick 函数会被重新创建。 每次 render 时 ChildComponent 参数中会接受一个新的 onClick 参数，这会直接击穿 React.memo，导致性能优化失效，并联动一起 render。

当然，官方文档指出，在组件内部中每次跟随 render 而重新创建函数的开销几乎可以忽略不计。若不将函数传给自组件，完全没有任何问题，而且开销更小。
```

###### 用useCallback包裹：

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

```
这样 handleClick 就是 memoized 版本，依赖不变的话则永远返回第一次创建的函数。

但每次 render 还是创建了一个新函数，只是没有使用罢了。 

React.memo 与 PureComponent 类似，它们都会对传入组件的新旧数据进行 浅比较，如果相同则不会触发渲染。

如果去除依赖，这时内部逻辑取得的 count 的值永远为初始值即 0，也就是拿不到最新的值。
如果将内部的逻辑作为 function 提取出来作为依赖，这又会导致 useCallback 失效。
```

###### 在 useCallback 加上依赖：
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

### useCallback 源码
ReactFiberHooks.new.js
```js
作者：旋律
链接：https://www.zhihu.com/question/390974405/answer/2250452686
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

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

### 组件卸载逻辑：
```

```