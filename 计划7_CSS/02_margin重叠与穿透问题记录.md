## margin 穿透及解决
子元素设置margin-top或者margin-bottom会影响其父元素，这就是所谓的margin穿透。

margin重叠是指两个同级元素之间。margin穿透指的是，子元素margin超出父元素而未被父元素包含的现象。
```
出现margin重叠的原因: 同一个BFC里面两个块级元素会出现margin折叠。

解决方式：让两个块级元素不在一个BFC内。
```

## BFC的特点: BFC是一个绝对的独立空间，它的内部元素是不会影响到外部元素的

与BFC对应的另外一个概念IFC(inline formatting context) 行内格式化上下文

BFC布局规则:
```
内部的Box会在垂直方向，按照从上到下的方式逐个排列。

Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠

每个元素的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此

BFC的区域不会与float box重叠

BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此

计算BFC的高度时，浮动元素的高度也参与计算
```

## 触发条件
因此通过将其中一个元素display属性设置为inline-block，width设置为100%是比较好的解决方式；既解决了margin穿透问题，又达到与display为block一样的效果。
```
触发BFC的条件:

根元素，body
float的值不为none
overflow不为visible；可以是hidden或auto或scroll
display的值设置为inline-block，flex或者inline-flex,table-cell,table-caption或者inline-table
position的值设置为absolute、fixed
```
