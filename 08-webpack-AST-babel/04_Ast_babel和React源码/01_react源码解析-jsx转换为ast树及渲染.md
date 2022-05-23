# react源码解析-jsx转换为ast树及渲染

### jsx转换ast树
#### babel识别jsx语法
babel在这里的功能是将jsx语法的代码转换为React.createElement()的函数调用
https://www.babeljs.cn/repl，可以测试:
```javaScript
// jsx
const testEle = <h1 style = {{"color": "red"}}>123
<div>test</div>
</h1> 


// 结果：
"use strict";

const testEle =
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
```


#### React.createElement()是如何转换为ast树的？