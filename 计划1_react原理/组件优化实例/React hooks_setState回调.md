

```
使用 React Hooks 的方式，通常我们不需要这么一个 callback，大多数场景都可以直接用 useEffect
```

在react hooks中setState 确实拿到上一次的缓存,是因为，函数在每次渲染时也是独立的。这就是 Capture Value 特性，后面遇到这种情况就不会一一展开，只描述为 “此处拥有 Capture Value 特性”
```js
const [modelStatus, setModelStatus] =useState("");

function statusHandleChange(val) {
        setModelStatus(val);
        search();
    }

function search() {
	console.log(modelStatus);   // 这里拿到的值 是上一次的值,不是最新的
	props.callApi(modelStatus);
}
```

### 第一种方法:
```js
export default function Pre04SetStateSync() {
    const [counter, setCounter] = useState(0)
    const add = () => {
        setCounter(counter + 1)
    }
    useEffect(() => {
        console.log({counter})
    }, [counter])
    
    return <>
        <h3>同步SetState</h3>
        <p>请观察控制台</p>
        <button onClick={add}>counter: {counter}</button>
    </>
}

```

### 第二种方法:
```js
const [modelStatus, setModelStatus] =useState("");
const modelStatusRef = useRef(null);

useEffect(()=>{
	// 每次 更新 把值 复制给 modelStatusRef
	modelStatusRef.current = modelStatus;
}, [modelStatus]); // 依赖的值 等modelStatus 改变了 才出发里面的值

function statusHandleChange(val) {
        setModelStatus(val);
        
        // **设置一个延迟 0毫秒,这个 很重要**
        setTimeout(search, 0);
    }

function search(value) {
	// 这里的值 就是 拿到最新的值了
    let _modelStatus = modelStatusRef .current;
	console.log(_modelStatus );  
	props.callApi(_modelStatus );
}
```

### 第三种:set函数放在setTimeout(()=>{}, 0)
DOM刷新的时候,涉及到了宏任务和微任务吧,你可以了解一下,宏任务和微任务的区别,网上有很多的例子,如果你不用setTimeout的话,就在dom刷新之前,还是拿到之前的数据,没有等待页面加载完成去拿到最新的数据
```js
add = () => {
    setTimeout(()=>{
        this.setState({counter:this.state.counter + 1})
        console.log('~~this.state.counter',this.state.counter)
    },0)
}
```