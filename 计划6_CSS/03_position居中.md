
https://blog.csdn.net/qq_34644270/article/details/102715635
```
绝对定位时要想实现水平居中:
left: 50%;：让盒子的左侧移动到父级元素的水平中心位置；
margin-left: -100px;：让盒子向左移动自身宽度的一半。
垂直居中同上,改成:transform: translateX:(-50%);向左移动自身宽度的一半.

如果垂直居中则使用
top:50%;
transform: translateY:(-50%);向上移动自身高度的一半
```
```html
<div style={{ position: 'relative' }}> 
	<div style={{ position: 'absolute',top: '50%', left: '50%',transform: 'translate(-50%, -50%)'}}> 
	<Loading />
	</div>
</div>
```

```
二、 transform:translate (-50%,-50%) 造成的文字模糊和解决方案
这是因为transform时div的宽度或者高度并不是偶数，移动50%之后，像素点并不是整数，出了小数，和显示像素没有对上。
解决方案是使用flex完成垂直居中，设置排列方向为column，并设置justify-content: center，最后用text-align: center完成水平居中。方能保证文字显示清晰。

优化方法：

将transform: translate(-50%, -50%)改成transform: translate3d(-50%, -50%, 0)可以解决抖动，但仍然模糊。

将元素的高度设置为偶数可解决；

将transform: translate(-50%, -50%)中的y轴单位改成px也可以解决

改成transform: translate(-50%, -52%)也可以解决（如果52%不行则从51%每个百分比尝试）

以上方法能较大程度优化问题，但仔细查看仍有细微抖动，最后用了第4种方法。
```
