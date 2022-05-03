#### useEffect和useLayoutEffect区别？
```
useEffect是render结束后，callback函数执行，但是不会阻断浏览器的渲染。但是class的componentDidMount 和componentDidUpdate是同步的,在render结束后就运行,useEffect在大部分场景下都比class的方式性能更好.

useLayoutEffect里面的callback函数会在DOM更新完成后立即执行,但是会在浏览器进行任何绘制之前运行完成,阻塞了浏览器的绘制.
```