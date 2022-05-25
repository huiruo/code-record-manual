## react源码解析-jsx转换为ast树及渲染
先来大概总结：
1. jsx语法糖的html结构是通过babel将结构解析转换为React.createElement函数调用。

2. React.createElement做的事情就是生成react的ast树

3. 渲染，render函数主要做了两件事，一件是将ast树转换为fiber 结构。填入许多调度、更新、diff相关数据，并转换ast树为dom树，一件是挂载。

4. ast树转换为dom树，先是为我们准备好fiber版本的节点关系结构，然后从下往上的渲染一个一个的元素，最后将所有的节点添加到最外面的那一层dom上面，并赋值给最外层的fiber.stateNode,fiber.stateNode即将插入页面的dom元素。


## jsx转换ast树
## babel识别jsx语法
babel在这里的功能是将jsx语法的代码转换为React.createElement()的函数调用
转化测试:
https://www.babeljs.cn/repl:
```javaScript
// jsx
const element = <h1 style = {{"color": "red"}}>123
<div>test</div>
</h1>


// babel 编译过后生成的代码
"use strict";

const element =
/*#__PURE__*/
React.createElement("h1", {
    style: {
      "color": "red"
    }
  },
  "123",
  /*#__PURE__*/
  React.createElement("div", null, "test")
);

console.log('createElement 转化后ast树的结构:', element)
/*
{
    $$typeof: Symbol(react.element)
    key: null
    props:
    children: "Click Me"
    className: "red"
    [[Prototype]]: Object
    ref: null
    type: "div"
    _owner: null
    _store: {validated: false}\
}
*/

// 渲染代码：详细见 例_1_jsx_ast.html
const container = document.getElementById('root');
ReactDOM.render(
    element,
    container
)
```

## React.createElement()是如何转换为ast树的？
见 01_辅_1_createElement方法注释.md