#### 01.constructor

> ```js
> class Example extends Component {
>     constructor() {
>         super();
>         this.state = {
>             count: 0
>         }
>     }
>     render() {
>       return null;
>   }
> }
> ```
>
> 函数组件不需要构造函数,可以通过调用 useState 来初始化 state;
>
> ```js
> function Example() {
>   const [count, setCount] = useState(0);
>   return null;
> }
> ```



#### 02.componentDidMount

> ```js
> class Example extends React.Component {
>   componentDidMount() {
>     console.log('I am mounted!');
>   }
>   render() {
>     return null;
>   }
> }
> ```
>
> 使用 hooks 模拟 componentDidMount
>
 useEffect 拥有两个参数，第一个参数作为回调函数会在浏览器布局和绘制完成后调用，因此它不会阻碍浏览器的渲染进程。
 第二个参数是一个数组

 - 当数组存在并有值时，如果数组中的任何值发生更改，则每次渲染后都会触发回调。
 - 当它不存在时，每次渲染后都会触发回调。
 - 当它是一个空列表时，回调只会被触发一次，类似于 componentDidMount。

 ```js
 function Example() {
   useEffect(() => console.log('mounted'), []);
   return null;
 }
 ```

### 03.shouldComponentUpdate

class 组件访问 shouldComponentUpdate

```
shouldComponentUpdate(nextProps, nextState){
  console.log('shouldComponentUpdate')
  // return true 更新组件
  // return false 则不更新组件
}
```

hooks 模拟 shouldComponentUpdate

```
const MyComponent = React.memo(
    _MyComponent, 
    (prevProps, nextProps) => nextProps.count !== prevProps.count
)
```

React.memo 包裹一个组件来对它的 props 进行浅比较,但这不是一个 hooks，因为它的写法和 hooks 不同,其实React.memo 等效于 PureComponent，但它只比较 props。

### 04.componentDidUpdate

class 组件访问 componentDidUpdate

```
componentDidMount() {
  console.log('mounted or updated');
}

componentDidUpdate() {
  console.log('mounted or updated');
}
```

使用 hooks 模拟 componentDidUpdate

```
useEffect(() => console.log('mounted or updated'));
```

值得注意的是，这里的回调函数会在每次渲染后调用，因此不仅可以访问 componentDidUpdate，还可以访问componentDidMount，如果只想模拟 componentDidUpdate，我们可以这样来实现。

```
const mounted = useRef();
useEffect(() => {
  if (!mounted.current) {
    mounted.current = true;
  } else {
   console.log('I am didUpdate')
  }
});
```

useRef 在组件中创建“实例变量”。它作为一个标志来指示组件是否处于挂载或更新阶段。当组件更新完成后在会执行 else 里面的内容，以此来单独模拟 componentDidUpdate。

### 05.componentWillUnmount

class 组件访问 componentWillUnmount

```
componentWillUnmount() {
  console.log('will unmount');
}
```

hooks 模拟 componentWillUnmount
```
useEffect(() => {
  return () => {
    console.log('will unmount');
  }
}, []);
复制代码
```

当在 useEffect 的回调函数中返回一个函数时，这个函数会在组件卸载前被调用。我们可以在这里面清除定时器或事件监听器。
