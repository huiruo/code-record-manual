

### 01.

**enumerable 代码片段分析**

![img](https://upload-images.jianshu.io/upload_images/5016475-25ab11c6f042ed86.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)



注意：以下二种区别

![img](https://upload-images.jianshu.io/upload_images/5016475-d700d59cf2c6251b.png?imageMogr2/auto-orient/strip|imageView2/2/w/898/format/webp)

![img](https://upload-images.jianshu.io/upload_images/5016475-ed831b5f32e5cac2.png?imageMogr2/auto-orient/strip|imageView2/2/w/882/format/webp)



##### 不变性

> - 对象常量
>   结合writable: false 和 configurable: false 就可以创建一个真正的常量属性（不可修改，不可重新定义或者删除）

![img](https://upload-images.jianshu.io/upload_images/5016475-53ceb8f0c574556c.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

> - 禁止扩展
>   如果你想禁止一个对象添加新属性并且保留已有属性，就可以使用Object.preventExtensions(...)

禁止扩展片段1

![img](https://upload-images.jianshu.io/upload_images/5016475-e04c673d73514ae1.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

禁止扩展片段2

![img](https://upload-images.jianshu.io/upload_images/5016475-bd0d1ef4b505d0bb.png?imageMogr2/auto-orient/strip|imageView2/2/w/1058/format/webp)





### 总结1：属性定义和属性赋值







### 总结2：作用以及影响

属性的定义操作和赋值操作各自有自己的作用和影响。

> **赋值可能会调用原型上的setter，定义会创建一个自身属性**。



> **原型链中的同名只读属性可能会阻止赋值操作，但不会阻止定义操作**。如果原型链中存在一个同名的只读属性，则无法通过赋值的方式在原对象上添加这个自身属性，必须使用定义操作才可以。这项限制是在ECMAScript 5.1中引入的

![img](https://upload-images.jianshu.io/upload_images/5016475-f978709d73c32b5d.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)



![img](https://upload-images.jianshu.io/upload_images/5016475-d6e8aa6461813e68.png?imageMogr2/auto-orient/strip|imageView2/2/w/944/format/webp)



![img](https://upload-images.jianshu.io/upload_images/5016475-f42ff3eac0792f2a.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)



![img](https://upload-images.jianshu.io/upload_images/5016475-3561b2bb74a80778.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)





对象字面量中的属性是通过定义操作添加的。

![img](https://upload-images.jianshu.io/upload_images/5016475-d91e7e26decfa23b.png?imageMogr2/auto-orient/strip|imageView2/2/w/802/format/webp)





再次啰嗦一次，记住以下两种形式的区别：

![img](https://upload-images.jianshu.io/upload_images/5016475-16ef54cf96c184da.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

上面的代码等同于：

![img](https://upload-images.jianshu.io/upload_images/5016475-b4633515fd327cec.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

另一方面：
![img](https://upload-images.jianshu.io/upload_images/5016475-8a2a3b2da50e0868.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

上面的代码等同于：

![img](https://upload-images.jianshu.io/upload_images/5016475-f5fa67373fc34d36.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)