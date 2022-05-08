#### hooks 本质
```
如果你回答Hooks的本质就是闭包。但是，如果满分100的话，这个说法最多只能得60分。

哪满分答案是什么呢？闭包 + 两级链表。

下面就来一一分解, 下面都以useState来举例剖析。
```

>闭包是指有权访问另一个函数作用域中变量或方法的函数，创建闭包的方式就是在一个函数内创建闭包函数，通过闭包函数访问这个函数的局部变量, 利用闭包可以突破作用链域的特性，将函数内部的变量和方法传递到外部。
```javascript
export default function Hooks() {
  const [count, setCount] = useState(0);
  const [age, setAge] = useState(18);

  const self = useRef(0);

  const onClick = useCallback(() => {
    setAge(19);
    setAge(20);
    setAge(21);
  }, []);

  console.log('self', self.current);
  return (
    <div>
      <h2>年龄： {age} <a onClick={onClick}>增加</a></h2>
      <h3>轮次： {count} <a onClick={() => setCount(count => count + 1)}>增加</a></h3>
    </div>
  );
}
```

以上面的示例来讲，闭包就是setAge这个函数，何以见得呢，看组件挂载阶段hook执行的源码：
```javascript
// packages/react-reconciler/src/ReactFiberHooks.js
function mountReducer(reducer, initialArg, init) {
  const hook = mountWorkInProgressHook();
  let initialState;
  if (init !== undefined) {
    initialState = init(initialArg);
  } else {
    initialState = initialArg;
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = (hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialState,
  });
  // 重点
  const dispatch = (queue.dispatch = (dispatchAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  )));
  return [hook.memoizedState, dispatch];
}
```
所以这个函数就是mountReducer，而产生的闭包就是dispatch函数（对应上面的setAge），被闭包引用的变量就是
currentlyRenderingFiber 与 queue。

- currentlyRenderingFiber: 其实就是workInProgressTree, 即更新时链表当前正在遍历的fiber节点(源码注释：The work-in-progress fiber. I've named it differently to distinguish it from the work-in-progress hook)；


- queue: 指向hook.queue，保存当前hook操作相关的reducer 和 状态的对象，其来源于mountWorkInProgressHook这个函数，下面重点讲；


这个闭包将 fiber节点与action, action 与 state很好的串联起来了，举上面的例子就是：
- 当点击增加执行setAge, 执行后，新的state更新任务就储存在fiber节点的hook.queue上，并触发更新；


- 当节点更新时，会遍历queue上的state任务链表，计算最终的state，并进行渲染；

ok，到这，闭包就讲完了。









