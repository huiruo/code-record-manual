
## 死循环例子
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

## 使用 useCallback解决
```js
const getData = useCallback(() => {
  setTimeout(() => {
    setVal("new data " + count);
    count++;
  }, 500);
}, []);

例子中getData的引用永远不会变，因为他它的依赖列表是空。可以根据实际情况将依赖加进去，就能确保依赖不变的情况下，函数的引用保持不变。
```

## useCallback 依赖 state
```js
假如在getData中需要用到val( useState 中的值)，就需要将其加入依赖列表，这样的话又会导致每次getData的引用都不一样，死循环又出现了...

const getData = useCallback(() => {
  console.log(val);

  setTimeout(() => {
    setVal("new data " + count);
    count++;
  }, 500);
}, [val]);
```

```
如果我们希望无论val怎么变，getData的引用都保持不变，同时又能取到val最新的值，可以通过自定义 hook 实现。注意这里不能简单的把val从依赖列表中去掉，否则getData中的val永远都只会是初始值（闭包原理）。
```
### 自定义hook解决 useCallback 依赖
```js
function useRefCallback(fn, dependencies) {
  const ref = useRef(fn);

  // 每次调用的时候，fn 都是一个全新的函数，函数中的变量有自己的作用域
  // 当依赖改变的时候，传入的 fn 中的依赖值也会更新，这时更新 ref 的指向为新传入的 fn
  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

使用：
```js
const getData = useRefCallback(() => {
  console.log(val);

  setTimeout(() => {
    setVal("new data " + count);
    count++;
  }, 500);
}, [val]);
```

## 助于性能改善的，有 2 种场景：
```
1.函数定义时需要进行大量运算， 这种场景极少
2.需要比较引用的场景，如上文提到的useEffect，又或者是配合React.Memo使用：
```

上面的例子中，如果不用useCallback, 任何一个输入框的变化都会导致另一个输入框重新渲染。
```js
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

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

### 性能
一般会觉得使用useCallback的性能会比普通重新定义函数的性能好， 如下面例子：
```js
function App() {
  const [val, setVal] = useState("");

  const onChange = (evt) => {
    setVal(evt.target.value);
  };

  return <input val={val} onChange={onChange} />;
}
```
将onChange改为：
```js
const onChange = useCallback(evt => {
  setVal(evt.target.value);
}, []);

实际性能会更差。究其原因，上面的写法几乎等同于下面：
const temp = evt => {
  setVal(evt.target.value);
};

const onChange = useCallback(temp, []);

可以看到onChange的定义是省不了的，而且额外还要加上调用useCallback产生的开销，性能怎么可能会更好？
```
