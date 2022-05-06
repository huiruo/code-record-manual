`Object.defineProperty()`的作用就是直接在一个对象上定义一个新属性，或者修改一个已经存在的属性，， 并返回这个对象。

```js
Object.defineProperty(obj, prop, desc)
```

> 1. obj 需要定义属性的当前对象
> 2. prop 当前需要定义的属性名
> 3. desc 属性描述符
>
> 一般通过为对象的属性赋值的情况下，对象的属性可以修改也可以删除，但是通过Object.defineProperty()定义属性，通过描述符的设置可以进行更精准的控制对象属性。



> ##### 属性的特性以及内部属性
>
> javacript 有三种类型的属性
>
> 1. 命名数据属性：拥有一个确定的值的属性。这也是最常见的属性
> 2. 命名访问器属性：通过`getter`和`setter`进行读取和赋值的属性
> 3. 内部属性：由JavaScript引擎内部使用的属性，不能通过JavaScript代码直接访问到，不过可以通过一些方法间接的读取和设置。比如，每个对象都有一个内部属性`[[Prototype]]`，你不能直接访问这个属性，但可以通过`Object.getPrototypeOf()`方法间接的读取到它的值。虽然内部属性通常用一个双吕括号包围的名称来表示，但实际上这并不是它们的名字，它们是一种抽象操作，是不可见的，根本没有上面两种属性有的那种字符串类型的属性。



### 02.属性描述符

通过Object.defineProperty()为对象定义属性，有两种形式，且不能混合使用，分别为数据描述符，存取描述符，下面分别描述下两者的区别：

- ###### 数据描述符 --特有的两个属性（value,writable）

```js
let Person = {}
Object.defineProperty(Person, 'name', {
   value: 'jack',
   writable: true // 是否可以改变
})
```

![](https://upload-images.jianshu.io/upload_images/5016475-341b21261bd9366c.png?imageMogr2/auto-orient/strip|imageView2/2/w/916/format/webp)



![img](https://upload-images.jianshu.io/upload_images/5016475-69e4dc45d0a6c764.png?imageMogr2/auto-orient/strip|imageView2/2/w/876/format/webp)

注意，如果描述符中的某些属性被省略，会使用以下默认规则：

![img](https://upload-images.jianshu.io/upload_images/5016475-9cd41a36735b667d.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)







- ###### 存取描述符 --是由一对 getter、setter 函数功能来描述的属性

  `get`：一个给属性提供`getter`的方法，如果没有`getter`则为`undefined`。该方法返回值被用作属性值。默认为`undefined`。
  `set`：一个给属性提供`setter`的方法，如果没有`setter`则为`undefined`。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认值为`undefined`。

  ```js
  let Person = {}
  let temp = null
  Object.defineProperty(Person, 'name', {
    get: function () {
      return temp
    },
    set: function (val) {
      temp = val
    }
  })
  ```

    ![img](https://upload-images.jianshu.io/upload_images/5016475-96b00b053d6fd42a.png?imageMogr2/auto-orient/strip|imageView2/2/w/854/format/webp)





### 3.数据描述符和存取描述均具有以下描述符

1. configrable 描述属性是否配置，以及可否删除
2. enumerable 描述属性是否会出现在for in 或者 Object.keys()的遍历中

- configurable:false不能删除属性

![img](https://upload-images.jianshu.io/upload_images/5016475-885fbf1df3d6a465.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

- configurable:false不能重新定义属性

![img](https://upload-images.jianshu.io/upload_images/5016475-65abac28f1baac3b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)



- 等价上一张图的代码

![img](https://upload-images.jianshu.io/upload_images/5016475-6cfce802f175016b.png?imageMogr2/auto-orient/strip|imageView2/2/w/942/format/webp)



- 与上一张图的代码进行对比

![img](https://upload-images.jianshu.io/upload_images/5016475-a89db7cd533efbcc.png?imageMogr2/auto-orient/strip|imageView2/2/w/882/format/webp)



- configurable:true能删除属性

![img](https://upload-images.jianshu.io/upload_images/5016475-fecfb1b9d9d4eee8.png?imageMogr2/auto-orient/strip|imageView2/2/w/1150/format/webp)



- configurable:true能够定义属性

![img](https://upload-images.jianshu.io/upload_images/5016475-210b70d4146f46ec.png?imageMogr2/auto-orient/strip|imageView2/2/w/1022/format/webp)



- configurable:false与上图做对照

![img](https://upload-images.jianshu.io/upload_images/5016475-dadc376bbc6c23b1.png?imageMogr2/auto-orient/strip|imageView2/2/w/1086/format/webp)

**从以上代码运行结果分析总结可知：**

> 1. configurable: false 时，不能删除当前属性，且不能重新配置当前属性的描述符(有一个小小的意外：可以把writable的状态由true改为false,但是无法由false改为true),但是在writable: true的情况下，可以改变value的值
> 2. configurable: true时，可以删除当前属性，可以配置当前属性所有描述符。







