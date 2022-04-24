1.为什么hooks不能写在条件判断中
2.jsx和Fiber有什么关系
3.jsx文件为什么要声明import React from 'react';
4.setState是同步的还是异步的
5.componentWillMount、componentWillMount、componentWillUpdate为什么标记UNSAFE
6.点击Father组件的div，Child会打印Child吗
```js
function Child() {
  console.log('Child');
  return <div>Child</div>;
}


function Father(props) {
  const [num, setNum] = React.useState(0);
  return (
    <div onClick={() => {setNum(num + 1)}}>
      {num}
      {props.children}
    </div>
  );
}


function App() {
  return (
    <Father>
      <Child/>
    </Father>
  );
}

const rootEl = document.querySelector("#root");
ReactDOM.render(<App/>, rootEl);
```

7.打印顺序是什么
```
function Child() {
  useEffect(() => {
    console.log('Child');
  }, [])
  return <h1>child</h1>;
}

function Father() {
  useEffect(() => {
    console.log('Father');
  }, [])

  return <Child/>;
}

function App() {
  useEffect(() => {
    console.log('App');
  }, [])

  return <Father/>;
}
```
9.为什么string类型的ref prop将会被废弃？
10.简述diff算法
11.react16.4+的生命周期
12.Fiber是什么，它为什么能提高性能
13.react元素$$typeof属性什么
14.react怎么区分Class组件和Function组件
15.react有哪些优化手段
16.suspense组件是什么
17.如何解释demo_4 demo_7 demo_8出现的现象

18.那我们知道了JSX是什么，可是这跟我们这回要说的React.createElement()方法有什么关系呢？
先来回顾一个面试会问的问题“你能说说vue和react有什么区别吗”，有一个区别就是在使用webpack打包的过程中，vue是用vue-loader来处理.vue后缀的文件，而react在打包的时候，是通过babel来转换的，因为react的组件说白了还是.js或者.jsx，是扩展的js语法，所以是通过babel转换成浏览器识别的es5或者其他版本的js