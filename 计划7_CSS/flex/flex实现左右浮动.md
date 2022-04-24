

 左边一个div，右边一个div，父元素只需要`display:flex;justify-content:space-between`
 ```html
 <div class="cellBottom">
     <div>{{ cell.price }}</div>
     <div class="cellBottomLeft">aa</div>
 </div>
 .cellBottom {
   background: yellow;
   display: flex;
   justify-content: space-between;
 }
 ```
