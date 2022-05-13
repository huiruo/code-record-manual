
### HTTP 1.0/1.1/2.0区别

#### HTTP 1.1
```
HTTP1.1默认开启长连接，在一个TCP连接上可以传送多个HTTP请求和响应。使用 TCP 长连接的方式改善了 HTTP/1.0 短连接造成的性能开销。

HTTP1.1支持管道（pipeline）网络传输，只要第一个请求发出去了，不必等其回来，就可以发第二个请求出去，可以减少整体的响应时间。
```

扩展：
keep-alive的优点：
- 较少的CPU和内存的使用（由于同时打开的连接的减少了）
- 允许请求和应答的HTTP管线化
- 降低拥塞控制（TCP连接减少了）
- 减少了后续请求的延迟（无需再次握手）
- 报告错误无需关闭TCP连接

#### HTTP 2.0
```
二进制分帧：HTTP 2 采用二进制格式传输数据，而非HTTP 1.x 的文本格式，二进制协议解析起来更高效。

多路复用：HTTP 2 同域名下所有通信都在单个连接上完成。

头部压缩：只发送头部数据的差异数据，而不是全部发送，减少头部的信息量

服务端推送：服务端可以在发送页面HTML时主动推送其它资源，而不用等到浏览器解析到相应位置，发起请求再响应。例如服务端可以主动把JS和CSS文件推送给客户端，而不需要客户端解析HTML时再发送这些请求。服务端可以主动推送，客户端也有权利选择是否接收。如果服务端推送的资源已经被浏览器缓存过，浏览器可以通过发送RST_STREAM帧来拒收。主动推送也遵守同源策略，服务器不会随便推送第三方资源给客户端。
```