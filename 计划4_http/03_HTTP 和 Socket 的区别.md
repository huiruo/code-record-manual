
### 一、HTTP 协议
http 为短连接：客户端发送请求都需要服务器端回送响应.请求结束后，主动释放链接，因此为短连接。通常的做法是，不需要任何数据，也要保持每隔一段时间向服务器发送"保持连接"的请求。这样可以保证客户端在服务器端是"上线"状态。

HTTP连接使用的是"请求-响应"方式，不仅在请求时建立连接，而且客户端向服务器端请求后，服务器才返回数据

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

### 二、Socket 连接
```
Socket其实并不是一个协议，而是为了方便使用TCP或UDP而抽象出来的一层，是位于应用层和传输控制层之间的一组接口。

“Socket是应用层与TCP/IP协议族通信的中间软件抽象层，它是一组接口，提供一套调用TCP/IP协议的API。在设计模式中，Socket其实就是一个门面模式，它把复杂的TCP/IP协议族隐藏在Socket接口后面，对用户来说，一组简单的接口就是全部，让Socket去组织数据，以符合指定的协议。”
```
<font color='red'>要想明白 Socket，必须要理解 TCP 连接。</font>
```
TCP 三次握手：握手过程中并不传输数据，在握手后服务器与客户端才开始传输数据，理想状态下，TCP 连接一旦建立，在通讯双方中的任何一方主动断开连接之前 TCP 连接会一直保持下去。
```
Socket 是对 TCP/IP 协议的封装，Socket 只是个接口不是协议，通过 Socket 我们才能使用 TCP/IP 协议，除了 TCP，也可以使用 UDP 协议来传递数据。

创建 Socket 连接的时候，可以指定传输层协议，可以是 TCP 或者 UDP，当用 TCP 连接，该Socket就是个TCP连接，反之。

<br>**Socket 原理**<br>
<div style="height:50px">
Socket 连接,至少需要一对套接字，分为 clientSocket，serverSocket 连接分为3个步骤:
</div>

```
(1) 服务器监听:服务器并不定位具体客户端的套接字，而是时刻处于监听状态；

(2) 客户端请求:客户端的套接字要描述它要连接的服务器的套接字，提供地址和端口号，然后向服务器套接字提出连接请求；

(3) 连接确认:当服务器套接字收到客户端套接字发来的请求后，就响应客户端套接字的请求,并建立一个新的线程,把服务器端的套接字的描述发给客户端。一旦客户端确认了此描述，就正式建立连接。而服务器套接字继续处于监听状态，继续接收其他客户端套接字的连接请求.
```

Socket为长连接：通常情况下Socket 连接就是 TCP 连接，因此 Socket 连接一旦建立,通讯双方开始互发数据内容，直到双方断开连接。在实际应用中，由于网络节点过多，在传输过程中，会被节点断开连接，因此要通过轮询高速网络，该节点处于活跃状态。
很多情况下，都是需要服务器端向客户端主动推送数据，保持客户端与服务端的实时同步。

若双方是 Socket 连接，可以由服务器直接向客户端发送数据。

若双方是 HTTP 连接，则服务器需要等客户端发送请求后，才能将数据回传给客户端。

因此，客户端定时向服务器端发送请求，不仅可以保持在线，同时也询问服务器是否有新数据，如果有就将数据传给客户端。