

## React.memo()是一个高阶函数，它与 React.PureComponent类似，但是一个函数组件而非一个类

React.memo()可接受2个参数，第一个参数为纯函数的组件，第二个参数用于对比props控制是否刷新，与shouldComponentUpdate()功能类似
> 注意：与 shouldComponentUpdate 不同的是，arePropsEqual 返回 true 时，不会触发 render，如果返回 false，则会。而 shouldComponentUpdate 刚好与其相反。

```
React.memo(type, compare?)是一个高阶组件，接收两个参数，第一个参数是需要优化的组件，第二个是非必填的自定义的compare函数，如果不传则会使用默认的compare函数。通过compare比较新旧props是否“相同”，选择是重新渲染组件还是跳过渲染组件的操作并直接复用最近一次渲染的结果。
一般我们会使用默认的compare，但这个compare函数的基本原理就是通过Object.is()函数来进行浅比较的，这就意味着对于对象只有是同一个引用才会被认定为相同。所以单独用memo函数只能进行简单的优化，很容易出现对象值相同，但是两个不同的对象（引用不同）。这个时候就需要useMemo,useCallback进行相应的优化。（当然特定情况下自定义compare函数也可以）
```

```javaScript
import React from "react";

function Child({seconds}){
    console.log('I am rendering');
    return (
        <div>I am update every {seconds} seconds</div>
    )
};

function areEqual(prevProps, nextProps) {
    if(prevProps.seconds===nextProps.seconds){
        return true
    }else {
        return false
    }

}
export default React.memo(Child,areEqual)
```

## momo 一般配合useCallback() 或则：useMemo()起到了缓存的作用，即便父组件渲染了，useCallback() 包裹的函数也不会重新生成，会返回上一次的函数引用。
```javaScript

// 父组件
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


// 子
import React, { memo } from 'react'
 
const ChildComp = memo(function ({ name, onClick }) {
  console.log('render child-comp ...')
  return <>
    <div>Child Comp ... {name}</div>
    <button onClick={() => onClick('hello')}>改变 name 值</button>
  </>
})
```
