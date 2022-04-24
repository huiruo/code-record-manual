
## uesCallback
```
useCallback() 起到了缓存的作用，即便父组件渲染了，useCallback() 包裹的函数也不会重新生成，会返回上一次的函数引用。
```

## useMemo
返回对象：
使用 useMemo 对对象属性包一层。
```
useMemo 有两个参数：
第一个参数是个函数，返回的对象指向同一个引用，不会创建新对象；
第二个参数是个数组，只有数组中的变量改变时，第一个参数的函数才会返回一个新的对象。
```

<br/>

### 例子1：
子组件的 props 和 state 没有变化时，即便父组件渲染，也不要渲染子组件。
```js
// 1.父组件
function ParentComp () {
  const [ count, setCount ] = useState(0)
  const increment = () => setCount(count + 1)

  return (
    <div>
      <button onClick={increment}>点击次数：{count}</button>
      <ChildComp />
    </div>
  );
}

// 2.子组件
import React, { memo } from 'react'

const ChildComp = memo(function () {
  console.log('render child-comp ...')
  return <div>Child Comp ...</div>
})
```

## 例子2:
上面的例子中，父组件只是简单调用子组件，并未给子组件传递任何属性。
看一个父组件给子组件传递属性的例子：

父组件在调用子组件时传递了 name 属性和 onClick 属性，此时点击父组件的按钮，可以看到控制台中打印出子组件被渲染的信息。
```js
// 1.父组件
function ParentComp () {
  const [ count, setCount ] = useState(0)
  const increment = () => setCount(count + 1)

  const [ name, setName ] = useState('hi~')
  const changeName = (newName) => setName(newName)  // 父组件渲染时会创建一个新的函数

  return (
    <div>
      <button onClick={increment}>点击次数：{count}</button>
      <ChildComp name={name} onClick={changeName}/>
    </div>
  );
}

//子组件：（子组件仍然用 React.memo() 包裹一层）
import React, { memo } from 'react'

const ChildComp = memo(function ({ name, onClick }) {
  console.log('render child-comp ...')
  return <>
    <div>Child Comp ... {name}</div>
    <button onClick={() => onClick('hello')}>改变 name 值</button>
  </>
})
```

```
React.memo() 失效了？？？

分析下原因：

1.点击父组件按钮，改变了父组件中 count 变量值（父组件的 state 值），进而导致父组件重新渲染；
2.父组件重新渲染时，会重新创建 changeName 函数，即传给子组件的 onClick 属性发生了变化，导致子组件渲染；

感觉一切又说的过去，由于子组件的 props 改变了，所以子组件渲染了，没问题呀！

回过头想一想，我们只是点击了父组件的按钮，并未对子组件做任何操作，压根就不希望子组件的 props 有变化。

useCallback 钩子进一步完善这个缺陷。
```
### 解决：
修改父组件的 changeName 方法，用 useCallback 钩子函数包裹一层。
```js
import React, { useCallback } from 'react'

function ParentComp () {
  // ...
  const [ name, setName ] = useState('hi~')
  // 每次父组件渲染，返回的是同一个函数引用
  const changeName = useCallback((newName) => setName(newName), [])  

  return (
    <div>
      <button onClick={increment}>点击次数：{count}</button>
      <ChildComp name={name} onClick={changeName}/>
    </div>
  );
}

此时点击父组件按钮，控制台不会打印子组件被渲染的信息了。
究其原因：useCallback() 起到了缓存的作用，即便父组件渲染了，useCallback() 包裹的函数也不会重新生成，会返回上一次的函数引用。
```

### 例子：前面父组件调用子组件时传递的 name 属性是个字符串，如果换成传递对象会怎样？
下面例子中，父组件在调用子组件时传递 info 属性，info 的值是个对象字面量，点击父组件按钮时，发现控制台打印出子组件被渲染的信息。
```js
import React, { useCallback } from 'react'

function ParentComp () {
  // ...
  const [ name, setName ] = useState('hi~')
  const [ age, setAge ] = useState(20)
  const changeName = useCallback((newName) => setName(newName), [])
  const info = { name, age }    // 复杂数据类型属性

  return (
    <div>
      <button onClick={increment}>点击次数：{count}</button>
      <ChildComp info={info} onClick={changeName}/>
    </div>
  );
}

分析原因跟调用函数是一样的：

1.点击父组件按钮，触发父组件重新渲染；
2.父组件渲染，const info = { name, age } 一行会重新生成一个新对象，导致传递给子组件的 info 属性值变化，进而导致子组件重新渲染。
```

#### 解决
使用 useMemo 对对象属性包一层。
再次点击父组件按钮，控制台中不再打印子组件被渲染的信息了。
```js
function ParentComp () {
  // ....
  const [ name, setName ] = useState('hi~')
  const [ age, setAge ] = useState(20)
  const changeName = useCallback((newName) => setName(newName), [])
  const info = useMemo(() => ({ name, age }), [name, age])   // 包一层

  return (
    <div>
      <button onClick={increment}>点击次数：{count}</button>
      <ChildComp info={info} onClick={changeName}/>
    </div>
  );
}
```
