#### 注意1,更新数组
```
使用useState时候，使用push，pop，splice等直接更改数组对象的坑，demo中使用push直接更改数组无法获取到新值，应该采用析构方式，但是在class里面不会有这个问题。(这个的原因是push，pop，splice是直接修改原数组，react会认为state并没有发生变化，无法更新)
```

```javaScript
const [firstData, setFirstData]:any = useState([])
const handleFirstAdd = () => {
 		// let temp = firstData // 不要这么写，直接修改原数组相当于没有更新
    let temp = [...firstData]  // 必须这么写，多层数组也要这么写
    temp.push({
        value: '',
    })
    setFirstData(temp)
}
```
#### 2.闭包带来的坑
因为每次 render 都有一份新的状态，因此上述代码中的 setTimeout 使用产生了一个闭包，捕获了每次 render 后的 state，也就导致了输出了 0、1、2。如果你希望输出的内容是最新的 state 的话，可以通过 useRef 来保存 state。前文讲过 ref 在组件中只存在一份，无论何时使用它的引用都不会产生变化，因此可以来解决闭包引发的问题。