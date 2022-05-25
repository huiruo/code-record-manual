 


```js
ReactDOM.render(
  <App />,
  document.getElementById('root')
); 

编译后会调用createElement方法，即:
ReactDOM.render(
  React.createElement(App),  
  document.getElementById('root')
);
/*
于是，可以提出两个疑问
a.ReactDOM.render 方法中如何转成真实dom
b.React.createElement 方法中如何实例化react组件（虚拟dom）
*/
```

```
function createElement(type, config, children) {
  console.log("createElement:",type, config, children)
  var propName; // Reserved names are extracted

``` 


```
我们在 react 项目中写的 jsx 代码经过 babel 编译后会变成普通的 js 代码：
<div className="page">
  <Header> Hello, This is React </Header>
  <div>Start to learn right now!</div>
  Right Reserve.
</div>

? babel 转换

React.createElement(
  "div",
  {
    className: "page",
  },
  React.createElement(Header, null, " Hello, This is React "),
  React.createElement("div", null, "Start to learn right now!"),
  "Right Reserve."
);
```
## createElement 函数的作用是生成 ReactElement，一个 ReactElement 是一个对象，它主要包含：
```js
// $$typeof 属性可以唯一标识一个ReactElement元素
const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };

  return element;
};
```