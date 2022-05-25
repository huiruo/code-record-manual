## 手动操作DOM带来的性能忧患
在使用原生的js api或者jquery等一些方法直接去操作dom的时候，可能会引起页面的reflow，而页面的回流所带来的代价是非常昂贵的。频繁的去操作dom，会引起页面的卡顿，影响用户的体验。
### 虚拟dom
虚拟DOM就是为了解决频繁操作DOM的性能问题创造出来的。
例如：
如果使用原生api去操作一个会导致回流的DOM操作10次，那么浏览器会每次都会重新走一次上面的全流程，包括一些没变化的位置计算。
而虚拟DOM不会立即去操作DOM，而是将这10次更新的diff内容保存到本地的一个js对象中，最终将这个js对象一次性attach到DOM树上，通知浏览器去执行绘制工作，这样可以避免大量的无谓的计算量。


```js
<div id="container">
    <p>Real DOM</p>
    <ul>
        <li class="item">Item 1</li>
        <li class="item">Item 2</li>
        <li class="item">Item 3</li>
    </ul>
</div>
	|
	|js对象来模拟上述的DOM Tree
	|
	v
let virtualDomTree = CreateElement('div', { id: 'container' }, [
    CreateElement('p', {}, ['Virtual DOM']),
    CreateElement('ul', {}, [
        CreateElement('li', { class: 'item' }, ['Item 1']),
        CreateElement('li', { class: 'item' }, ['Item 2']),
        CreateElement('li', { class: 'item' }, ['Item 3']),
    ]),
]);

let root = virtualDomTree.render();   //转换为一个真正的dom结构或者dom fragment
document.getElementById('virtualDom').appendChild(root);
```
### diff算法
只考虑相同等级diff，可以分为下面4中情况：

1.第一种。如果节点类型变了，比如下面的p标签变成了h3标签，则直接卸载旧节点装载新节点，这个过程称为REPLACE。
```
renderA: <ul>
renderB: <ul class: 'marginLeft10'>
=> [addAttribute class "marginLeft10"]
```

2.第二种情况。节点类型一样，仅仅是属性变化了，这一过程叫PROPS。比如

这一过程只会执行节点的更新操作，不会触发节点的卸载和装载操作。
```
renderA: <ul>
renderB: <ul class: 'marginLeft10'>
=> [addAttribute class "marginLeft10"]
```
3.第三种。只是文本变化了，TEXT过程。该过程只会替换文本。
4.第四种。节点发生了移动，增加，或者删除操作。该过程称为REOREDR。虚拟DOM Diff算法解析
5.如果在一些节点中间插入一个F节点，简单粗暴的做法是：卸载C，装载F，卸载D，装载C，卸载E，装载D，装载E。如下图：
这种方法显然是不高效的。 而如果给每个节点唯一的标识(key)，那么就能找到正确的位置去插入新的节点。



## DOM对象的一些常用方法

### document对象属性
document.doctype;//可以知道文档声明，如果没有return null;这里是<!DOCTYPE html>
document.doctype.name//知道文档声明的名字.
document.head//很明显选取head节点.就是<head></head>这段
document.body//选取body节点.

### location
```js
document.location.href //获取当前地址
document.location.assign(http://www.baidu.com)//分配一个地址

另外如果href 是获取当前地址，如果给他赋值，把一个地址给他，也能达到assign的效果；
document.location="http://www.baidu.com"
或者
document.location.href="http://www.baidu.com"
```
### innerText innerHTML
innerHTML
获取元素的内容：element.innerHTML;

给元素设置内容：element.innerHTML =htmlString;
```

<!doctype html>
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <p id="demo">my first demo</p>
</body>
<script>
    document.getElementById("demo").innerHTML="<b>hello world</b>"
    document.body.innerHTML="<b>hello world</b>"
    //
    document.getElementById("demo").innerText="<h1>My First JavaScript</h1>";
    document.body.innerTEXT
</script>
</html>
```
innerTEXT
打印标签之间的纯文本信息，显示标签，标签无效，低版本的火狐浏览器不支持。
获取元素的内容：element.innerText;
给元素设置内容：element.innerText = string;

### Element的几个必要重要的属性
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Z-one</title>
</head>
<body>
    <p id="p1" class="p">测试</p>
    <p id="p2" class="p">测试</p>
    <p id="p3" class="p">测试</p>
  <script>
        var a=document.getElementById("p1")//获取上面那个例子的p1元素.
        a.id// 获取该元素的id... "p1" (貌似就是通过p1找到的他- -)
        a.nodeName//获取到节点的名字(就是标签名字) 这里是"p"
        a.className//获取节点的class名字，这里因为关键字的原因，只能用className;

           另外还有一些
           child//获取子元素  这里没有
           lastchild//最后一个子元素.
           firstchild//第一个子元素.
           nextSibling//下一个兄弟元素.
           previousSibing//上一个兄弟元素.
</script>
</body>
</html>
```

Element的创建和添加元素
```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>创建元素</title>
</head>
<script>
    window.onload=function(){
        var a=document.createElement("div");
        a.className="p1"
        a.innerHTML=("<span>测试下</span>");
        //添加到文档中
        document.body.appendChild(a);//这下子元素就写进去了
        //如果还要添加 可以照着上面来，我们现在就添加一个元素进去
        var b=document.createElement("div");
        b.innerHTML="<p>测试第二弹</p>";
        //这次我们添加在上一个元素前面
        document.body.insertBefore(b,a);//把b插在a前面- -
        //这时候不想要b了，想替换掉，可以这么做!
        var c=document.createElement("div");
        c.innerHTML="我就是来替换的";
        document.body.replaceChild(c,b);//（new,old）
    }
</script>
<body>

</body>
</html>
```


## appendChild()和append() 和innerHTML
+ append()
可以同时传入多个节点或字符串，没有返回值；
据说 append 还是试用期的方法，有兼容问题，（但我用了暂时火狐，谷歌，iE都能使用）。
+ appendChild() 
```
1.只能传一个节点，且不直接支持传字符串【需要 appendChild(document.createTextElement('字符串'))代替】
2.返回追加的 Node 节点；

3.若 appendChild() 的参数是页面存在的一个元素，则执行后原来的元素会被移除；
例如：document.getElement("a").appendChild(document.getElementByIdx("b"))，执行后，b 元素会先被移除，然后再添加到 a 中。
```
性能:
```
+ innerHTML 比 appendChild 要方便，特别是创建的节点属性多，同时还包含文本的时候；
+ 但执行速度的比较上，使用 appendChild 比 innerHTML 要快，特别是内容包括 html 标记时，appendChild 明显要快于  innerHTML，这可能是因为 innerHTML 在铺到页面之前还要对内容进行解析才能铺到页面上，当包含 html 标记过多时， innerHTML速度会明显变慢。
```

## 创建元素的方式