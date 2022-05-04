#### HTTP协议是无状态的和Connection: keep-alive的区别：
从HTTP/1.1起，默认都开启了Keep-Alive，保持连接特性，简单地说，当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的连接。
Keep-Alive不会永久保持连接，它有一个保持时间，可以在不同的服务器软件（如Apache）中设定这个时间。

#### cookie 和 Session解决http无状态
```
cookie是web浏览器存储的少量数据，最早设计为服务器端使用，作为HTTP协议的扩展实现。cookie数据会自动在浏览器和服务器之间传输。
通过读写cookie检测是否支持
cookie属性有名，值，max-age，path, domain，secure；
cookie默认有效期为浏览器会话，一旦用户关闭浏览器，数据就丢失，通过设置max-age=seconds属性告诉浏览器cookie有效期
cookie作用域通过文档源和文档路径来确定，通过path和domain进行配置，web页面同目录或子目录文档都可访问
通过cookie保存数据的方法为：为document.cookie设置一个符合目标的字符串如下
读取document.cookie获得'; '分隔的字符串，key=value,解析得到结果
document.cookie = 'name=qiu; max-age=9999; path=/; domain=domain; secure';
document.cookie = 'name=aaa; path=/; domain=domain; secure';
// 要改变cookie的值，需要使用相同的名字、路径和域，新的值
// 来设置cookie，同样的方法可以用来改变有效期
// 设置max-age为0可以删除指定cookie
//读取cookie，访问document.cookie返回键值对组成的字符串，
//不同键值对之间用'; '分隔。通过解析获得需要的值
```

#####  Session机制:服务器端使用的一种记录客户端状态的机制
传到前端的是SessionId 用cookie 或是Url重写存起来,下次再请求 如果session没过期 根据id可以获取到session里存储信息。
```
Session对浏览器的要求:
虽然Session保存在服务器，对客户端是透明的，它的正常运行仍然需要客户端浏览器的支持。这是因为Session需要使用Cookie作为识别标志。HTTP协议是无状态的，Session不能依据HTTP连接来判断是否为同一客户，因此服务器向客户端浏览器发送一个名为JSESSIONID的Cookie，它的值为该Session的id（也就是HttpSession.getId()的返回值）。Session依据该Cookie来识别是否为同一用户

注意：
新开的浏览器窗口会生成新的Session，但子窗口除外。子窗口会共用父窗口的Session。例如，在链接上右击，在弹出的快捷菜单中选择“在新窗口中打开”时，子窗口便可以访问父窗口的Session。
```
#### Session 和cookie 区别:
1、cookie数据存放在客户的浏览器上，session数据放在服务器上.
```
登录一个网站的时候，如果web服务器端使用的是session,那么所有的数据都保存在服务器上面，客户端每次请求服务器的时候会发送 当前会话的session_id，服务器根据当前session_id判断相应的用户数据标志，以确定用户是否登录，或具有某种权限。
SessionID这一数据则是保存到客户端，用Cookie保存的，用户提交页面时，会将这一 SessionID提交到服务器端，来存取Session数据。这一过程，是不用开发人员干预的。所以一旦客户端禁用Cookie，那么Session也会失效。
```
2.设置cookie时间可以使cookie过期。但是使用session-destory（），我们将会销毁会话
3.session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能考虑到减轻服务器性能方面，应当使用cookie。
4.单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie。(Session对象没有对存储的数据量的限制，其中可以保存更为复杂的数据类型)
注意:
```
    session很容易失效,用户体验很差;
    虽然cookie不安全,但是可以加密 ;
    cookie也分为永久和暂时存在的;
    浏览器 有禁止cookie功能 ,但一般用户都不会设置;
    定要设置失效时间,要不然浏览器关闭就消失了;

例如:
    记住密码功能就是使用永久cookie写在客户端电脑，下次登录时，自动将cookie信息附加发送给服务端。
```