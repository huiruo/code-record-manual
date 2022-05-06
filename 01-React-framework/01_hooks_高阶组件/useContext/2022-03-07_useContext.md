
```js
import { createContext, useContext } from 'react'
import { PopoverContext } from './types'

export const popoverContext = createContext({} as PopoverContext)

export const PopoverProvider = popoverContext.Provider

export function usePopoverContext() {
  return useContext(popoverContext)
}
```
### 使用介绍
```
const context = useContext(Context);
接受一个 context（上下文）对象（从React.createContext返回的值）并返回当前 context 值，由最近 context 提供程序给 context 。当提供程序更新时，此 Hook 将使用最新的 context 值触发重新渲染。

 
Demo，两个计数器组件Counter组件 和 CounterTest组件，之前我们用useReducer使它们共享一个count state，当一个组件的 count state发生变化时，另一个组件的count state也会相应的改变。

 
但是它们的共同状态需要在app组件中获取以后，分别传入这两个组件中。这样的话，假如我们想在别的组件中也获取这个状态，就需要从app组件中传入或者再次获取。因此我们可以使用 Context 和 useReducer 来管理这个状态。
```

#### 使用 Context、useContext 和 useReducer 来管理状态
Context是 React 官方提供的一个管理数据的方法，他可以让我们避免一级一级地把数据沿着组件树传下来，详情可以参考官方文档
useReducer 则是 hooks 提供的一个类似于 redux 的 api，让我们可以通过 action 的方式来管理 context，或者 state

#### 1-1.reducer.js
```js
import React, { useReducer } from "react";

const initialState = 0;
const myContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return initialState;
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const ContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <myContext.Provider value={{ state, dispatch }}>
      {props.children}
    </myContext.Provider>
  );
};

export { reducer, myContext, ContextProvider }; 
```
我们将所有需要用到 context 的组件放入到Context.Provider的子元素中，这样就可以获取到状态 state 和方法 dispatch。 


#### 1-2.Counter.js
子组件中只需要通过useContext API获取这个状态
```js
import React, { useContext } from "react";
import { myContext } from "./reducer";

function Counter() {

  const { state, dispatch } = useContext(myContext);

  return (
    <div>
      Counter Count: {state.count}
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}

export default Counter;
```

#### 1-3.CounterTest.js 
```js
import React, { useContext } from "react";
import { myContext } from "./reducer";

function CounterTest() {
  const { state, dispatch } = useContext(myContext);
  return (
    <div>
      CounterTest Count: {state.count}
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}

export default CounterTest;
```
 
#### 1-4.index.js 
```js
import React from "react";
import { ContextProvider } from "./reducer";
import Counter from "./Counter";
import CounterTest from "./CounterTest";

const App = () => {
  return (
    <div className="App">
      <ContextProvider>
        <Counter />
        <CounterTest />
      </ContextProvider>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```
