### border-box 和 content-box 区别
* W3C的盒模型方式被称为:content-box

* IE的被称为“border-box”，使用box-sizing: border-box;就是为了在设置有padding值和border值的时候不把宽度撑开。

**所以：**
* ①：没有设置box-sizing:border-box属性，宽高会加上padding和border的值，需要我们手动去计算，减去padding和border的值，并调整content的值，以免超过给定的宽高
* ②：加了box-sizing:border-box属性，padding和border的值就不会在影响元素的宽高，相当于把padding和border的值都算在content里，
```html
content-box：指定盒模型为 W3C 标准模型，设置 border、padding 会增加元素 width与 height 的尺寸，即 border 与 padding 相当于是元素的“殖民地”，元素的“土地”、尺寸会增加，为向外延伸。
/* 默认, W3C标准盒模型、 box-sizing: content-box */
<style type="text/css">
    .box {
      width: 200px;
      height: 200px;
      text-align: center;
      border: 10px solid black;
      padding: 15px;
    }
</style>
此时的行高：line-height = height = 200px;
【因为行高即内容的高，而内容在这里即元素的高（边框和填充是扩展外部空间的）】
```

```html
border-box：指定盒模型为 IE模型（怪异模式），设置 border、padding 不会影响元素 width 与 height 的尺寸，即 border 与 padding 由元素已设空间转变。即空间还是这个空间，只是将部分空余的地方，转变成了其他空间用法而已，为内部转变

IE怪异盒模型、box-sizing: border-box;
<style type="text/css">
    .box {
      width: 200px;
      height: 200px;
      text-align: center;
      border: 10px solid black;
      padding: 15px;
      box-sizing: border-box;
    }
</style>
此时的行高：line-height = height - border*2 - padding*2 = 200px - 10px*2 - 15px*2 = 150px;

【因为此时，内容的其余空间被边框和填充占用，所以是元素的高减去边框和填充的空间，剩余即为内容空间】
```