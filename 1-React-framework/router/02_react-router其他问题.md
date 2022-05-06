##### window.history对象有什么特点呢？
对当前浏览器的url历史记录的管理。可想成：window.history是一个堆栈，里面存放了当前浏览器Tab的所有浏览url并依照浏览顺序存放在堆栈中。

##### window.location对象有什么特点？
专门用来获取当前页面的地址的相关信息，还可以通过给这些地址属性赋值的方式使得当前页面跳转。
window.location.href：获取url，并且可以可以赋值给他新的url，让页面跳转。

##### 传参方式
1.query方式使用很简单，类似于表单中的get方法，传递参数为明文
2.state方式类似于post方式，使用方式和query类似