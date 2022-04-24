


一.transform：转换
	对元素进行移动、缩放、转动、拉长或拉伸。

	方法1：translate():
	元素从其当前位置移动，根据给定的 left（x 坐标） 和 top（y 坐标） 位置参数
//有两个div，它们的css样式如下：
.before {
            width: 70px;
            height: 70px;
            background-color: #8fbc8f;
        }
 
 .after {
            width: 70px;
            height: 70px;
            background-color: #ffe4c4;
            -webkit-transform: translate(50px, 30px);
            -moz-transform: translate(50px, 30px);
            -ms-transform: translate(50px, 30px);
            -o-transform: translate(50px, 30px);
            transform: translate(50px, 30px);
        }


    方法2：rotate():    
	 // 元素顺时针旋转给定的角度。允许负值，元素将逆时针旋转。
	// 有两个div，它们的css样式如下
	.before {
            width: 70px;
            height: 70px;
            background-color: #8fbc8f;
        }
 
	.after {
	            width: 70px;
	            height: 70px;
	            background-color: #ffe4c4;
	            -webkit-transform: rotate(20deg);
	            -moz-transform: rotate(20deg);
	            -ms-transform: rotate(20deg);
	            -o-transform: rotate(20deg);
	            transform: rotate(20deg);
	        }

	方法3.scale()
    元素的尺寸会增加或减少，根据给定的宽度（X 轴）和高度（Y 轴）参数        
    .before {
            width: 70px;
            height: 70px;
            background-color: #8fbc8f;
        }
	.after {
	            width: 70px;
	            height: 70px;
	            background-color: #ffe4c4;
	            -webkit-transform: scale(1.5, 0.8);/*宽度变为原来的1.5倍，高度变为原来的0.8倍*/
	            -moz-transform: scale(1.5, 0.8);
	            -ms-transform: scale(1.5, 0.8);
	            -o-transform: scale(1.5, 0.8);
	            transform: scale(1.5, 0.8);
	        }

	方法4.skew()
    元素翻转给定的角度，根据给定的水平线（X 轴）和垂直线（Y 轴）参数   
    .before {
            width: 70px;
            height: 70px;
            background-color: #8fbc8f;
        }
 
	.after {
	            width: 70px;
	            height: 70px;
	            background-color: #ffe4c4;
	            -webkit-transform: skew(20deg, 20deg);/*围绕 X 轴把元素翻转20度，围绕 Y 轴翻转20度*/
	            -moz-transform: skew(20deg, 20deg);
	            -ms-transform: skew(20deg, 20deg);
	            -o-transform: skew(20deg, 20deg);
	            transform: skew(20deg, 20deg);
	        }     


二.
transition:过渡
元素从一种样式逐渐改变为另一种的效果
有一个div，它的css样式如下：

	div {
	            width:100px;
	            height:100px;
	            background-color: #87cefa;
	            -webkit-transition: width 2s;/*时长为2s的宽度变化效果*/
	            -moz-transition: width 2s;
	            -o-transition: width 2s;
	            transition: width 2s;
	        }
	div:hover{
	            width:300px;
	        }	        

坑：
a.过渡只关系元素的初始状态和结束状态，没有方法可以获取元素在过渡中每一帧的状态
b.元素在初次渲染还没有结束的时候，是没有办法触发过渡的
c.在绝大部分变换样式的切换时，变换组合的个数或位置不一样时，是没有办法触发过渡的

属性：
	transition-property 

		指定过渡动画的属性（并不是所有的属性都可以动画）

	transition-duration

		指定过渡动画的时间（0也要带单位）

	transition-timing-function

		指定过渡动画的形式（贝塞尔）

	transition-delay

		指定过渡动画的延迟

	transition

		第一个可以被解析成时间的值会赋给transition-duration

	transtionend事件（DOM2）

		在每个属性完成过渡时都会触发这个事件

	当属性值的列表长度不一致时

		跟时间有关的重复列表

		transition-timing-function使用默认值
