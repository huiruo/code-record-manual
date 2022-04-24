

# Hooks 优点
* 比 HOC 更优雅的逻辑复用方式。HOC 可能会带来嵌套地狱，而 Hooks 可以让你在无需修改组件结构的情况下复用状态逻辑
更加函数式。
* Hooks 可以更方便的让相关代码写在一起（可阅读性，可维护性更高）。Class Component 则会让相关代码分布在不同的声明周期中，不方便后续的代码维护以及阅读
* 没有 this 上下文的问题
* 更方便的依赖执行（useEffect, useMemo）。class component 需要在shouldComponentUpdate, componentDidUpdate... 这些生命周期中各种判断

# Hooks 不足
* 没有统一的错误处理。而 Class Component 中有 componentDidCatch 和 getDerivedStateFromError
* 只能在最顶层使用 Hook，并且必须确保 Hook 在每一次渲染中都按照同样的顺序被调用