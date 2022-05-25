## useMemo
返回对象：
使用 useMemo 对对象属性包一层。
```
useMemo 有两个参数：
第一个参数是个函数，返回的对象指向同一个引用，不会创建新对象；
第二个参数是个数组，只有数组中的变量改变时，第一个参数的函数才会返回一个新的对象。
```
会在组件第一次渲染的时候执行，之后会在其依赖的变量发生改变时再次执行。
可以把它理解成vue里面的computed，是一种数据的缓存，而这个缓存依赖后面的第二个参数数组，如果这个数组里面传入的数据不变，那么这个useMemo返回的数据是之前里面return的数据。


在具体项目中，如果你的页面上展示的数据是通过某个（某些）state计算得来的一个数据，那么你每次这个组件里面无关的state变化引起的重新渲染，都会去计算一下这个数据，这时候就需要用useMemo(()=>{}, [])去包裹你的计算的方法体，这样那些无关的state改变引起的渲染不会重新计算这个方法体，而是返回之前计算的结果，达到一种缓存的效果。

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
//返回一个 memoized 值

//把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。
```

## useMemo 实例：
```js
//使用 useMemo 后，并将 count 作为依赖值传递进去，此时仅当 count 变化时才会重新执行 getNum 。
function Example() {
    const [count, setCount] = useState(1);
    const [val, setValue] = useState('');
 
    const getNum = useMemo(() => {
        return Array.from({length: count * 100}, (v, i) => i).reduce((a, b) => a+b)
    }, [count])

    return <div>
        <h4>总和：{getNum()}</h4>
        <div>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <input value={val} onChange={event => setValue(event.target.value)}/>
        </div>
    </div>;
}
```