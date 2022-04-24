> 前端开发过程中经常会遇到这种问题，明明设置的是子元素的margin值，结果却作用在了父元素上，例如的代码：
>
> HTML部分：嵌套两层div
>
> ```html
> <div class="box">
>     <div class="inner">
>         margin击穿
>     </div>
> </div>
> <style>
> .box{
>     margin: 0 auto;
>     background: red;
>     width: 500px;
>     height: 300px;
> }
> .inner{
>     margin-top: 100px;
>     background: green;
>     color: #FFF;
>     width: 200px;
>     height: 100px;
> }
> </style>
> ```
>
> 1、给父元素加一个边框
>
> ```css
> .box{
>     1px solid #000;
> }
> ```
>
> 缺点：会多一个边框，不可取。
>
> 2、在父元素添加 overflow:auto; (推荐) 或者 overflow:hidden;**推荐**
>
> ```css
> .box{
>     overflow:auto;
> }
> ```
>
> 3、给子元素设置 display:inline-block;
>
> ```css
> .inner{
>     display:inline-block;
> }
> ```
>
> 4、给子元素设置浮动再清除浮动，太麻烦，不推荐。
>
> ```css
> .inner{
>     float:laft;
> }
> .box::after{
>     content: '';
>     display: block;
>     clear: both;
> }
> ```