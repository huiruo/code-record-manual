```
1，relative 参考自身静态位置通过 top,bottom,left,right 定位，并且可以通过z-index进行层次分级。

2，absolute选取其最近的父级top,bottom,left,right定位元素，
当父级 position 为 static 时，absolute元素将以body坐标原点进行定位，可以通过z-index进行层次分级。
```

```
relative脱离了文本流，但是其在文本流中的位置依然存在， position脱离了文本流，其在文本流中的位置也不存在
relative定位总是相对于其最近的父元素，无论其父元素是何种定位方式。

absolute定位的层总是相对于其最近的定义为absolute或relative的父层，而这个父层并不一定是其直接父层。如果其父 层中都未定义absolute或relative，则其将相对body进行定位
```
