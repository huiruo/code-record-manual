### 一、HTTP 协议
http 为短连接：客户端发送请求都需要服务器端回送响应.请求结束后，主动释放链接，因此为短连接。通常的做法是，不需要任何数据，
也要保持每隔一段时间向服务器发送"保持连接"的请求。这样可以保证客户端在服务器端是"上线"状态。

HTTP连接使用的是"请求-响应"方式，不仅在请求时建立连接，而且客户端向服务器端请求后，服务器才返回数据

#### 一、WebSocket是HTML5出的（协议）
```
HTTP有1.1和1.0之说，也就是所谓的keep-alive，把多个HTTP请求合并为一个，但是Websocket其实是一个新协议，跟HTTP协议基本没有关系
首先，Websocket是一个持久化的协议，相对于HTTP这种非持久的协议来说。

WebSocket 解决的第一个问题是，通过第一个 HTTP request 建立了 TCP 连接之后，之后的交换数据都不需要再发 HTTP request了，使得
这个长连接变成了一个真.长连接。但是不需要发送 HTTP header就能交换数据显然和原有的 HTTP 协议是有区别的，所以它需要对服务器和客户端
都进行升级才能实现。在此基础上 WebSocket 还是一个双通道的连接，在同一个 TCP 连接上既可以发也可以收信息。此外还有 multiplexing 功能，
几个不同的 URI 可以复用同一个 WebSocket 连接。这些都是原来的 HTTP 不能做到的。

```
首先Websocket是基于TCP 的，或者说借用了HTTP的协议来完成一部分握手。
在握手阶段是一样的


### Websocket
WebSocket是HTML5规范提出的一种协议，
Websocket 的出现就是为了解决 HTTP 在即时通信中存在的不足，HTTP 是通过 Polling 实现即时通信存在很大的资源开销。
```
Webscoket 握手阶段采用 HTTP 协议，连接建立之后便与 HTTP 协议没有任何关系，Websocket 连接建立之后，client 与 server 可以同时收发数据，全双工通讯。
```
实例：
```js
//src\renderer\common\im\IMConnector.ts
/**
  * 连接IM服务器
  */
private connectToServer() {
  const strongThis = this;

  let wsUrl = 'ws://' + this.host + ':' + this.port;

  if (Config.getInstance().debugWSApi) {
    wsUrl = Config.getInstance().debugWSApi;
  }

  // Logger.log('WS API:' + wsUrl);

  //重连时，清空消息daa
  this.datas = new Uint8Array();

  if (this.webscoket) {
    this.webscoket.removeEventListener('open', this.openEvent);
    this.webscoket.removeEventListener('message', this.messageEvent);
    this.webscoket.removeEventListener('close', this.closeEvent);
    this.webscoket.removeEventListener('error', this.errorEvent);
    this.webscoket = null;
  }

  this.webscoket = new WebSocket(wsUrl);

  this.webscoket.addEventListener('open', this.openEvent);
  this.webscoket.addEventListener('message', this.messageEvent);
  this.webscoket.addEventListener('close', this.closeEvent);
  this.webscoket.addEventListener('error', this.errorEvent);
}
```
