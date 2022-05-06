#### BrowserRouter 和 HashRouter
BrowserRouter：h5路由(history API)
HashRouter：哈希路由的区别：早期实现页面哈希，使用的是锚点技术

```
BrowserRouter 和 HashRouter 都可以实现前端路由的功能，区别是前者基于url的pathname段，后者基于hash段。
　　前者：http://127.0.0.1:3000/article/num1
　　后者：http://127.0.0.1:3000/#/article/num1（不一定是这样，但#是少不了的）
```

### 2.router和context组件级的数据共享
```
如果组件的功能不能单靠组件自身来完成，还需要依赖额外的子组件，那么可以利用`Context`构建一个由多个子组件组合的组件。例如，react-router。

react-router的`<Router />`自身并不能独立完成路由的操作和管理，因为导航链接和跳转的内容通常是分离的，因此还需要依赖`<Link />`和`<Route />`等子组件来一同完成路由的相关工作。为了让相关的子组件一同发挥作用，react-router的实现方案是利用`Context`在`<Router />`、`<Link />`以及`<Route />`这些相关的组件之间共享一个`router`，进而完成路由的统一操作和管理。

下面截取`<Router />`、`<Link />`以及`<Route />`这些相关的组件部分源码，以便更好的理解上述所说的。
```
```js
// Router.js

/**
 * The public API for putting history on context.
 */
class Router extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  static contextTypes = {
    router: PropTypes.object
  };

  static childContextTypes = {
    router: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      router: {
        ...this.context.router,
        history: this.props.history,
        route: {
          location: this.props.history.location,
          match: this.state.match
        }
      }
    };
  }
  
  // ......
  
  componentWillMount() {
    const { children, history } = this.props;
    
    // ......
    
    this.unlisten = history.listen(() => {
      this.setState({
        match: this.computeMatch(history.location.pathname)
      });
    });
  }

  // ......
}
/*
尽管源码还有其他的逻辑，但<Router />的核心就是为子组件提供一个带有router属性的Context，同时监听history，一旦history发生变化，便通过setState()触发组件重新渲染。
*/
```
```js
// Link.js

/**
 * The public API for rendering a history-aware <a>.
 */
class Link extends React.Component {
  
  // ......
  
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  handleClick = event => {
    if (this.props.onClick) this.props.onClick(event);

    if (
      !event.defaultPrevented &&
      event.button === 0 &&
      !this.props.target &&
      !isModifiedEvent(event)
    ) {
      event.preventDefault();
      // 使用<Router />组件提供的router实例
      const { history } = this.context.router;
      const { replace, to } = this.props;

      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  };
  
  render() {
    const { replace, to, innerRef, ...props } = this.props;

    // ...

    const { history } = this.context.router;
    const location =
      typeof to === "string"
        ? createLocation(to, null, null, history.location)
        : to;

    const href = history.createHref(location);
    return (
      <a {...props} onClick={this.handleClick} href={href} ref={innerRef} />
    );
  }
}
```
`<Link />`的核心就是渲染`<a>`标签，拦截`<a>`标签的点击事件，然后通过`<Router />`共享的`router`对`history`进行路由操作，进而通知`<Router />`重新渲染。


```js
// Route.js

/**
 * The public API for matching a single path and rendering.
 */
class Route extends React.Component {
  
  // ......
  
  state = {
    match: this.computeMatch(this.props, this.context.router)
  };

  // 计算匹配的路径，匹配的话，会返回一个匹配对象，否则返回null
  computeMatch(
    { computedMatch, location, path, strict, exact, sensitive },
    router
  ) {
    if (computedMatch) return computedMatch;
    
    // ......

    const { route } = router;
    const pathname = (location || route.location).pathname;
    
    return matchPath(pathname, { path, strict, exact, sensitive }, route.match);
  }
 
  // ......

  render() {
    const { match } = this.state;
    const { children, component, render } = this.props;
    const { history, route, staticContext } = this.context.router;
    const location = this.props.location || route.location;
    const props = { match, location, history, staticContext };

    if (component) return match ? React.createElement(component, props) : null;

    if (render) return match ? render(props) : null;

    if (typeof children === "function") return children(props);

    if (children && !isEmptyChildren(children))
      return React.Children.only(children);

    return null;
  }
}
```
`<Route />`有一部分源码与`<Router />`相似，可以实现路由的嵌套，但其核心是通过`Context`共享的`router`，判断是否匹配当前路由的路径，然后渲染组件。

通过上述的分析，可以看出，整个react-router其实就是围绕着`<Router />`的`Context`来构建的。

总结：
```
- 相比`props`和`state`，React的`Context`可以实现跨层级的组件通信。
- Context API的使用基于生产者消费者模式。生产者一方，通过组件静态属性`childContextTypes`声明，然后通过实例方法`getChildContext()`创建`Context`对象。消费者一方，通过组件静态属性`contextTypes`申请要用到的`Context`属性，然后通过实例的`context`访问`Context`的属性。
- 使用`Context`需要多一些思考，不建议在App中使用`Context`，但如果开发组件过程中可以确保组件的内聚性，可控可维护，不破坏组件树的依赖关系，影响范围小，可以考虑使用`Context`解决一些问题。
- 通过`Context`暴露API或许在一定程度上给解决一些问题带来便利，但个人认为不是一个很好的实践，需要慎重。
- 旧版本的`Context`的更新需要依赖`setState()`，是不可靠的，不过这个问题在新版的API中得以解决。
- 可以把`Context`当做组件的作用域来看待，但是需要关注`Context`的可控性和影响范围，使用之前，先分析是否真的有必要使用，避免过度使用所带来的一些副作用。
- 可以把`Context`当做媒介，进行App级或者组件级的数据共享。
- 设计开发一个组件，如果这个组件需要多个组件关联组合的，使用`Context`或许可以更加优雅。
```