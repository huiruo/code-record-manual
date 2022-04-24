

# 动态添加style
```
<div style={{height: this.state.is_makeup===0 ? "100%" : "50%"}}</div>

添加多个样式
<div style={{display: (index===this.state.currentIndex) ? "block" : "none", color:"red"}}>此标签是否隐藏</div>
```

# 动态添加className
如果标签中本来没有其他的classnam
```
<div className={index===this.state.currentIndex?"active":null}>添加className</div>
```
标签本身有其他的className
```
<div className={["container tab", index===this.state.currentIndex?"active":null].join(' ')}>添加className</div>

ES6写法
<div className={`container ${index===this.state.currentIndex?"active":null}`}>此标签是否选中</div>
```
