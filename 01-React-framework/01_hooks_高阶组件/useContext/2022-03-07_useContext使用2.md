

## 介绍
```
useContext就是上下文
 
全局变量就是全局的上下文，全局都可以访问到它； 
```
 
## 1.useContext使用的方法
 
1.要先创建createContex
 
使用createContext创建并初始化
```
const C = createContext(null);
```
 
2.Provider 指定使用的范围
在圈定的范围内，传入读操作和写操作对象，然后可以使用上下文
```js
<C.Provider value={{n,setN}}>
	这是爷爷
	<Baba></Baba>
</C.Provider>
```
 
3.最后使用useContext
使用useContext接受上下文，因为传入的是对象，则接受的也应该是对象
```
const {n,setN} = useContext(C)；
```

## 2.案例：在孙子组件中使用爷爷组件中定义的变量n,并且进行+1操作
```js
import React, { createContext, useContext, useReducer, useState } from 'react'
import ReactDOM from 'react-dom'

// 创造一个上下文
const C = createContext(null);

function App(){

  const [n,setN] = useState(0)

  return(
    // 指定上下文使用范围，使用provider,并传入读数据和写入据
    <C.Provider value={{n,setN}}>
      这是爷爷
      <Baba></Baba>
    </C.Provider>
  )
}

function Baba(){

  return(
    <div>
      这是爸爸
      <Child></Child>
    </div>
  )
}

function Child(){
  // 使用上下文，因为传入的是对象，则接受也应该是对象
  const {n,setN} = useContext(C)

  const add=()=>{
    setN(n=>n+1)
  };

  return(
    <div>
      这是儿子:n:{n}
      <button onClick={add}>+1</button>
    </div>
  )
}


ReactDOM.render(<App />,document.getElementById('root'));
```

