## http:应用层协议
灵活：HTTP允许传输任意类型的数据对象。正在传输的类型由Content-Type加以标记。
无状态：HTTP协议是无状态协议。
无状态是指客户端和服务端之间不需要建立持久的连接 , 客户端发起一个请求 , 服务器端返回响应 , 这个连接就会被关闭 , 在服务器端不会保留该请求的有关信息 .

## 2.请求报文由请求行、请求头部、空行 和 请求包体(请求正文) 4 个部分组成
```
1.请求行：请求行由方法字段、URL 字段 和HTTP 协议版本字段 3 个部分组成，他们之间使用空格隔开。
    求方法字段、URL字段和HTTP协议版本
    例如：GET /index.html HTTP/1.1
        get方法将数据拼接在url后面，传递参数受限
    请求方法：
        GET、POST、HEAD、PUT、DELETE、OPTIONS、TRACE、CONNECT
2.请求头部：
    ● User-Agent：产生请求的浏览器类型;

　　● Accept：客户端可识别的响应内容类型列表;星号 “ * ” 用于按范围将类型分组，用 “ */* ” 指示可接受全部类型，用“ type/* ”指示可接受 type 类型的所有子类型;

　　● Accept-Language：客户端可接受的自然语言;

　　● Accept-Encoding：客户端可接受的编码压缩格式;

　　● Accept-Charset：可接受的应答的字符集;

　　● Host：请求的主机名，允许多个域名同处一个IP 地址，即虚拟主机;

　　● connection：连接方式(close 或 keepalive);

　　● Cookie：存储于客户端扩展字段，向同一域名的服务端发送属于该域的cookie;
3.请求包体：请求包体不在 GET 方法中使用，而是在POST 方法中使用。
    post方法中，会把数据以key value形式发送请求
4.空行
    发送回车符和换行符，通知服务器以下不再有请求头
```
```
GET方式的请求一般不包含”请求内容”部分，请求数据以地址的形式表现在请求行。


GET /search?hl=zh-CN&source=hp&q=domety&aq=f&oq= HTTP/1.1  
Accept: image/gif, image/x-xbitmap, image/jpeg, image/pjpeg, application/vnd.ms-excel, application/vnd.ms-powerpoint, 
application/msword, application/x-silverlight, application/x-shockwave-flash, */*  
Referer: <a href="http://www.google.cn/">http://www.google.cn/</a>  
Accept-Language: zh-cn  
Accept-Encoding: gzip, deflate  
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727; TheWorld)  
Host: <a href="http://www.google.cn">www.google.cn</a>  
Connection: Keep-Alive  
Cookie: PREF=ID=80a06da87be9ae3c:U=f7167333e2c3b714:NW=1:TM=1261551909:LM=1261551917:S=ybYcq2wpfefs4V9g; 
NID=31=ojj8d-IygaEtSxLgaJmqSjVhCspkviJrB6omjamNrSm8lZhKy_yMfO2M4QMRKcH1g0iQv9u-2hfBW7bUFwVh7pGaRUb0RnHcJU37y-
FxlRugatx63JLv7CWMD6UB_O_r 
```

### 1-2.HTTP常见的请求头:request header
- Accept 请求头用来告知客户端可以处理的内容类型，这种内容类型用MIME类型来表示。Accept：text/xml;代表客户端希望接受的数据类型是xml类型

- Cache-Control：指定请求和响应遵循的缓存机制。缓存指令是单向的（响应中出现的缓存指令在请求中未必会出现），且是独立的（在请求消息或响应消息中设置Cache-Control并不会修改另一个消息处理过程中的缓存处理过程）。请求时的缓存指令包括no-cache、no-store、max-age、max-stale、min-fresh、only-if-cached，响应消息中的指令包括public、private、no-cache、no-store、no-transform、must-revalidate、proxy-revalidate、max-age、s-maxage。

  Cache-Control:Public 可以被任何缓存所缓存

  Cache-Control:Private 内容只缓存到私有缓存中

  Cache-Control:no-cache 所有内容都不会被缓存

- Accept：浏览器端可以接受的MIME类型。例如：Accept: text/html 代表浏览器可以接受服务器回发的类型为 text/html 也就是我们常说的html文档，如果服务器无法返回text/html类型的数据，服务器应该返回一个406错误(non acceptable)。通配符 * 代表任意类型，例如 Accept: */* 代表浏览器可以处理所有类型，(一般浏览器发给服务器都是发这个)。

- Accept-Encoding：浏览器申明自己可接收的编码方法，通常指定压缩方法，是否支持压缩，支持什么压缩方法（gzip，deflate）;Servlet能够向支持gzip的浏览器返回经gzip编码的HTML页面。许多情形下这可以减少5到10倍的下载时间。例如： Accept-Encoding: gzip, deflate。如果请求消息中没有设置这个域，服务器假定客户端对各种内容编码都可以接受。

- Cookie：最重要的请求头之一, 将cookie的值发送给HTTP服务器。

- Content-Length：表示请求消息正文的长度。例如：Content-Length: 38。

- Authorization：授权信息，通常出现在对服务器发送的WWW-Authenticate头的应答中。主要用于证明客户端有权查看某个资源。当浏览器访问一个页面时，如果收到服务器的响应代码为401（未授权），可以发送一个包含Authorization请求报头域的请求，要求服务器对其进行验证。

## 2.HTTP响应报文由状态行、响应头部、空行 和 响应包体 4 个部分组成
```
1.状态行
    由3部分组成，分别为：协议版本，状态码，状态码描述，之间由空格分隔
2.响应头部:与请求头部类似，为响应报文添加了一些附加信息
    Server 服务器应用程序软件的名称和版本
    Content-Type 响应正文的类型（是图片还是二进制字符串）
    Content-Length 响应正文长度
    Content-Charset 响应正文使用的编码
    Content-Encoding 响应正文使用的数据压缩格式
    Content-Language 响应正文使用的语言
```

### 2-1.HTTP常见的响应头:Response header
- Allow：服务器支持哪些请求方法（如GET、POST等）。

- Date：表示消息发送的时间，时间的描述格式由rfc822定义。例如，

- Date:Mon,31Dec200104:25:57GMT。Date描述的时间表示世界标准时，换算成本地时间，需要知道用户所在的时区。你可以用setDateHeader来设置这个头以避免转换时间格式的麻烦

- Expires：指明应该在什么时候认为文档已经过期，从而不再缓存它，重新从服务器获取，会更新缓存。过期之前使用本地缓存。HTTP1.1的客户端和缓存会将非法的日期格式（包括0）看作已经过期。eg：为了让浏览器不要缓存页面，我们也可以将Expires实体报头域，设置为0。

- Set-Cookie：非常重要的header, 用于把cookie发送到客户端浏览器，每一个写入cookie都会生成一个Set-Cookie。Set-Cookie: sc=4c31523a; path=/; domain=.acookie.taobao.com

- Content-Type：WEB服务器告诉浏览器自己响应的对象的类型和字符集。Servlet默认为text/plain，但通常需要显式地指定为text/html。由于经常要设置Content-Type，因此HttpServletResponse提供了一个专用的方法setContentType。可在web.xml文件中配置扩展名和MIME类型的对应关系。

  Content-Type:text/html;charset=GB2312

  Content-Type: image/jpeg

**http报文头部有哪些字段? 有什么意义 ?**
这个就很多了, cookie cache-control user-agent expires host refer 等等 挑你会的常用的说, 面试官也不会要求你都说全的


## 状态码
**1\**(信息类)**：表示接收到请求并且继续处理

**2\**(响应成功)**：表示动作被成功接收、理解和接受

**3\**(重定向类)**：为了完成指定的动作，必须接受进一步处理
```
300——请求的资源可在多处得到
301——本网页被永久性转移到另一个URL
302——请求的网页被转移到一个新的地址，但客户访问仍继续通过原始URL地址，重定向，新的URL会在response中的Location中返回，浏览器将会使用新的URL发出新的Request。
303——建议客户访问其他URL或访问方式
304——自从上次请求后，请求的网页未修改过，服务器返回此响应时，不会返回网页内容，代表上次的文档已经被缓存了，还可以继续使用
305——请求的资源必须从服务器指定的地址得到
306——前一版本HTTP中使用的代码，现行版本中不再使用
307——申明请求的资源临时性删除
```

**4\**(客户端错误类)**：请求包含错误语法或不能正确执行
```
404——一个404错误表明可连接服务器，但服务器无法取得所请求的网页，请求资源不存在。eg：输入了错误的URL
401——请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用
HTTP 401.5 - 未授权：ISAPI 或 CGI 授权失败
402——保留有效ChargeTo头响应
403——禁止访问，服务器收到请求，但是拒绝提供服务
```

**5\**(服务端错误类)**：服务器不能正确执行一个正确的请求
```
HTTP 500 - 服务器遇到错误，无法完成请求
HTTP 500.100 - 内部服务器错误 - ASP 错误
HTTP 500-11 服务器关闭
HTTP 500-12 应用程序重新启动
HTTP 500-13 - 服务器太忙
HTTP 500-14 - 应用程序无效
HTTP 500-15 - 不允许请求 global.asa
Error 501 - 未实现
HTTP 502 - 网关错误
HTTP 503：由于超载或停机维护，服务器目前无法使用，一段时间后可能恢复正常
```

## 问题
## 一个浏览器同时可以发送多少个HTTP请求?
```
一个域名下系统会同时建立多个 TCP 请求（最多支持6个），那这么多 TCP 是怎么建立的呢？答案是三次握手（后面会讲到）。一听是三次握手，那肯定是需要花费时间的，还有就是 TCP 在建立成功后其运输数据会有一个慢启动的过程，就像你开车跑高速一样，从 0 到 120 码是一个逐步的过程，到了 120 后车子才保持最高速度行驶。
```

## 为什么 HTTP1.1 会出现对头阻塞?
关于http1.1
```
HTTP1.1默认开启长连接，在一个TCP连接上可以传送多个HTTP请求和响应。使用 TCP 长连接的方式改善了 HTTP/1.0 短连接造成的性能开销。

HTTP1.1支持管道（pipeline）网络传输，只要第一个请求发出去了，不必等其回来，就可以发第二个请求出去，可以减少整体的响应时间。
扩展：
keep-alive的优点：
- 较少的CPU和内存的使用（由于同时打开的连接的减少了）
- 允许请求和应答的HTTP管线化
- 降低拥塞控制（TCP连接减少了）
- 减少了后续请求的延迟（无需再次握手）
- 报告错误无需关闭TCP连接
```
## TCP 的队头阻是什么?
## HTTP2.0 优化哪些问题?
```
在一个 TCP 连接中可以传输多个 HTTP 请求，但是 TCP 对请求的处理是同步的，也就是只能一个一个的处理，在一个 HTTP 请求没有结束前，其他请求都是处于阻塞状态，这大大影响我们的首屏渲染。

而 HTTP2.0 的出现就是为了优化 HTTP1.1 存在的以上问题，优化策略如下：

1.一个域名只能使用一个 TCP 连接
这样就可以保证 TCP 只会连接以及慢启动一次，同时也解决了竞争带宽的问题

2.多路复用
HTTP/2 实现了资源的并行请求，也就是任何时候都可以将请求发送给服务器，而并不需要等待其他请求的完成，然后服务器也可以随时返回处理好的请求资源给浏览器

3.请求优先级
HTTP/2 提供了请求优先级，可以在发送请求时，标上该请求的优先级，这样服务器接收到请求之后，会优先处理优先级高的请求。


4.头部压缩：只发送头部数据的差异数据，而不是全部发送，减少头部的信息量

5.服务端推送：服务端可以在发送页面HTML时主动推送其它资源，而不用等到浏览器解析到相应位置，发起请求再响应。例如服务端可以主动把JS和CSS文件推送给客户端，而不需要客户端解析HTML时再发送这些请求。服务端可以主动推送，客户端也有权利选择是否接收。如果服务端推送的资源已经被浏览器缓存过，浏览器可以通过发送RST_STREAM帧来拒收。主动推送也遵守同源策略，服务器不会随便推送第三方资源给客户端。
```

## 什么是冷启动
## 为什么需要三次握手  --->见辅文件

## HTTPS 的加密方式是什么  ----->见05_https.md
