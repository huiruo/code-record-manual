### CSS 基础
**!important > 行内样式>ID选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性**
```
常见的块级元素有：<h1>~<h6>,<p>,<div>,<ul>,<ol>,<li>

常见的行内元素有：<a>,<strong>,<b>,<em>,<del>,<span>等

块转行内：display-inline
行内转块：display：block

```
块，行内元素转换为行内块：display：inline-block

###### 块级和非块级区别
```
1.行内元素和其他行内元素都会在一条水平线上排列,都是在同一行的;
  块级元素却总是会在新的一行.
2.行内元素不可以设置宽高,宽度高度随文本内容的变化而变化,但是可以设置行高
  块级可设置高度
3.块级元素可以包含行内元素和块级元素,还可以容纳内联元素和其他元素;
  行内元素不能包含块级
```

### 定位与脱离文档流
```
absolute  --->脱离文档流
生成绝对定位的元素，相对于 static 定位以外的第一个父元素进行定位。
元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。

fixed   
生成绝对定位的元素，相对于浏览器窗口进行定位。
元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。

relative -->未脱离文档流
生成相对定位的元素，相对于其正常位置进行定位。
因此，"left:20" 会向元素的 LEFT 位置添加 20 像素。

static  默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声明）。
inherit 规定应该从父元素继承 position 属性的值。
```

###### 响应式
```
  @media (max-width: 1366px) {
    .room-item {
      width: calc((100% - 56px) / 4);
      //background:yellow;
    }
  }
```
