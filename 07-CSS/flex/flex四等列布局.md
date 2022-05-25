## 实战：不使用flex-wrap，永远只有4个

```html
      <div class="sendType">
        <li>
          <svg @click="weixinShareAction(1)" aria-hidden="true" class="icon">
            <use xlink:href="#icon-pengyouquan" />
          </svg>
        </li>
        <li>
          <svg @click="weixinShareAction(0)" aria-hidden="true" class="icon">
            <use xlink:href="#icon-weixin1" />
          </svg>
        </li>
        <li>
          <svg @click="otherShareAction(1)" aria-hidden="true" class="icon">
            <use xlink:href="#icon-qqhaoyou" />
          </svg>
        </li>
        <li>
          <svg @click="otherShareAction(0)" aria-hidden="true" class="icon">
            <use xlink:href="#icon-duanxin" />
          </svg>
        </li>
      </div>
      <style>
      .sendType {
          display: flex;
          margin: 25px 0;
          li {
            list-style-type: none;
            flex: 2;
            text-align: center;
          }
          .icon {
            width: 44px;
            height: 44px;
            fill: currentColor;
            overflow: hidden;
          }
        }
      </style>
```



> 
>
> flex-wrap 属性用于指定弹性盒子的子元素换行方式。**
>
> **flex-wrap：nowrap/wrap/wrap-reverse;**
>
> nowrap 是flex-wrap的 默认值，弹性容器为单行。该情况下弹性子项可能会溢出容器
>
> ```html
> .father1{
>          width:500px;
>          height:400px;
>          background: lightcoral;
>          margin:20px auto;
>          display: -webkit-flex;
>          display:flex;
>          -webkit-flex-wrap:nowrap;
>          flex-wrap:nowrap;
>      }
>   .son1{
>          width:200px;
>          height:100px;
>          border:2px solid crimson;
>          background: coral;
>          margin:10px;
>          text-align: center;
>          color: #fff;
>      }
> html部分：
> <div class="father1">
> <div class="son1">nowrap1</div>
>  <div class="son1">nowrap2</div>
>  <div class="son1">nowrap3</div>
> </div>
> ```
>
> **flex-wrap：wrap ；**
>
> **弹性容器为多行。该情况下弹性子项溢出的部分会被放置到新行，子项内部会发生断行。**
>
> ```
> css部分：
> 
> .father2{
> 
>       width:500px;
> 
>       height:400px;
> 
>       background: lightcoral;
> 
>       margin:20px auto;
> 
>       display: -webkit-flex;
> 
>       display:flex;
> 
>       -webkit-flex-wrap:wrap;
> 
>       flex-wrap:wrap;
> 
>   }
> 
>   .son2{
> 
>       width:200px;
> 
>       height:100px;
> 
>       border:2px solid crimson;
> 
>       background: coral;
> 
>       margin:10px;
> 
>       text-align: center;
> 
>       color: #fff;
> 
>   }
> 
> html部分：
> 
> <div class="father2">
> 
> <div class="son2">wrap1</div>
> 
> <div class="son2">wrap2</div>
> 
> <div class="son2">wrap3</div>
> 
> </div>
> ```
>
> 

## 四、代码：

- `index.html`:



```xml
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>flex布局</title>
    <link rel="stylesheet" href="./index.css">
</head>
<body>
    <div class="container">
        <ul>
            <li><div><img src="./images/test.jpg" alt="testImage"><p>test</p></div></li>
            <li><div><img src="./images/test.jpg" alt="testImage"><p>test</p></div></li>
            <li><div><img src="./images/test.jpg" alt="testImage"><p>test</p></div></li>
            <li><div><img src="./images/test.jpg" alt="testImage"><p>test</p></div></li>
            <li><div><img src="./images/test.jpg" alt="testImage"><p>test</p></div></li>
            <li><div><img src="./images/test.jpg" alt="testImage"><p>test</p></div></li>
        </ul>
    </div>
</body>
</html>
```

- `index.css`:



```css
* {
    padding: 0;
    margin: 0;
    list-style: none;
    text-align: center;
}
.container > ul {
    display: flex;
    flex-wrap: wrap;
    margin: 1rem;
    background-color: #f3e9eb;
    border-radius: 0.8rem;
}
.container > ul li {
    width: 25%;
    display: flex;
    justify-content: center;
}
@media screen and (max-width: 320px) {
    .container ul > li {
        width: 33%;
    }
}
@media screen and (min-width: 768px) {
    .container ul > li {
        width: 14%;
    }
}
.container > ul li > div {
    margin: 0.5rem;
}
```

自己在做这个需求时， `li` 是动态渲染进来的，因为数量不一致，这个简单demo就简单粗暴的写了几个，图片可自行修改，此例中仅供参考。



作者：陌盍
链接：https://www.jianshu.com/p/9888bb5ac929
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。