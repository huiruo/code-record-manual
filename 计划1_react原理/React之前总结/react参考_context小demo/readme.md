**React.createContext：**创建一个上下文的容器(组件), defaultValue可以设置共享的默认数据

```jsx
const {Provider, Consumer} = React.createContext(defaultValue);
```

**Provider(生产者)**: 和他的名字一样。用于生产共享数据的地方。生产什么呢？ 那就看value定义的是什么了。value:放置共享的数据。

```jsx
<Provider value={/*共享的数据*/}>
    /*里面可以渲染对应的内容*/
</Provider>
```

**Consumer(消费者)**:这个可以理解为消费者。 他是专门消费供应商(**Provider** 上面提到的)产生数据。Consumer需要嵌套在生产者下面。才能通过回调的方式拿到共享的数据源。当然也可以单独使用，那就只能消费到上文提到的defaultValue

```jsx
<Consumer>
  {value => /*根据上下文  进行渲染相应内容*/}
</Consumer>
```

