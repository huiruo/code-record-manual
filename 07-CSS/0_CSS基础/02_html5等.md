
## HTML5 新增特性有哪些
+ Canvas、SVG -- 用于绘画的元素，canvas绘制的图片会失真而SVG绘制的不会失真。
+ video、audio -- 用于播放视频和音频的媒体。
+ Drag 、Drop -- 用于拖放的 。
+ Geolocation -- 用于获取地理位置。
+ localStorage、sessionStorage -- 用于本地离线存储。
+ webSQL、IndexDB -- 前端数据库操作，由于安全性极低，目前h5已放弃。
+ web Worker -- 独立于其他脚本，不影响页面性能运行在后台的javascript。
+ webSocket -- 单个TCP连接上进行全双工通讯的协议。
+ 新的特殊内容元素 -- 如：article、footer、header、nav、section。
+ 新的表单控件 -- 如：date、time、email、url、search。

## 2.SVG与Canvas区别
+ SVG适用于描述XML中的2D图形的语言

+ Canvas随时随地绘制2D图形（使用javaScript）

+ SVG是基于XML的，可以操作DOM，渲染速度较慢

+ 在SVG中每个形状都被当做是一个对象，如果SVG发生改变，页面就会发生重绘

+ Canvas是一像素一像素地渲染，如果改变某一个位置，整个画布会重绘。
```
与其他图像格式相比，SVG的优势在于：

   SVG图像可通过文本编译器来创建和修改

   SVG图像可被搜索、索引、脚本化或压缩

   SVG是可伸缩的

   SVG图像可在任何的分辨率下被高质量的打印

   SVG可在图像质量不下降的情况下被放大
```
## 3.WebSocket
WebSocket协议为web应用程序客户端和服务端之间提供了一种全双工通信机制。
+ 握手阶段采用HTTP协议，默认端口是80和443

+ 建立在TCP协议基础之上，和http协议同属于应用层

+ 可以发送文本，也可以发送二进制数据。

+ 没有同源限制，客户端可以与任意服务器通信。

+ 协议标识符是ws（如果加密，为wss），如ws://localhost:8023


