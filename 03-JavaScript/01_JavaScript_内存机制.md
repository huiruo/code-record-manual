```
JavaScript 具有自动垃圾收集机制（GC：Garbage Collecation），也就是说，执行环境会负责管理代码执行过程中使用的内存。
```

```
内存也是有生命周期的，不管什么程序语言，一般可以按顺序分为三个周期：
分配期：分配所需要的内存
使用期：使用分配到的内存（读、写）
释放期：不需要时将其释放和归还

JavaScript内存的生命周期：

1.内存分配：分配你所需要的暂时使用内存大小，当申明变量、函数、对象的时候，系统会自动为他们分配内存
2.内存使用：即读写内存，在每次创建字变量、函数、对象的时候，程序会分配新内存来存储实体。
3.内存回收：对于不需要使用的内存将其释放。
```

例子：
```
为了便于理解，下面用一个简单的例子来解释JavaScript内存的生命周期。

var a = 50;  // 在内存中给数值变量分配空间
alert(a + 100);  // 使用内存
a = null; // 使用完毕之后，释放内存空间
```

## 2.垃圾回收的原理
实现垃圾回收的两种常见算法：引用计数和标记清除。

A.引用计数
引用计数（reference counting）：当声明一个变量并将一个引用类型复制给该变量时，则这个值引用就加1，相反，如果包含这个值的变量又取得另外一个值，那么这个值的引用就减1，当引用次数变为0，则说明这个值不再用到了，这时就可以将这块内存释放。

B.标记清除
```
标记清除法是现代浏览器常用的一种垃圾收集方式，当变量进入环境（即在一个函数中声明一个变量）时，就将此变量标记为“进入环境”，进入环境的变量是不能被释放，因为只有执行流进入相应的环境，就可能会引用它们。

而当变量离开环境时，就标记为“离开环境”。


垃圾收集器在运行时会给储存在内存中的所有变量加上标记，然后会去掉环境中的变量以及被环境中的变量引用的变量的标记，当执行完毕那些没有存在引用无法访问的变量就被加上标记，最后垃圾收集器完成清除工作，释放掉那些打上标记的变量所占的内存。

标记清除之所以不存在循环引用的问题，是因为当函数执行完毕之后，对象A和B就已经离开了所在的作用域，此时两个变量被标记为“离开环境”，等待被垃圾收集器回收，最后释放其内存。
```

## 3.JavaScript中涉及内存泄漏的几种原因：
```
1.全局变量引起的内存泄漏：
根据JavaScript的垃圾回收机制我们知道，全局变量是不会被回收的，所以一些意外的、不需要的全局变量多了，没有释放，就造成了内存泄漏。
例：不断地创建全局变量，不管有没有用到它们，它们都将滞留在程序的整个执行过程中。如果这些变量是深层嵌套对象，将会浪费大量内存。

2.闭包：
闭包其实也是跟全局变量挂钩了，但是闭包只是因为被全局变量引用了，内部的变量因为被闭包引用得不到释放，也会造成内存泄漏。
因为Javascript范围的限制，许多实现依赖Javascript闭包。闭包可以导致内存泄漏是因为内部方法保持一个对外部方法变量的引用，所以尽管方法返回了内部方法还可以继续访问在外部方法中定义的私有变量。最好的做法是在页面重载前断开所有的事件处理器。

举例说明：
运行下面的代码，会发现已经造成了大量的内存泄露，每秒泄露1M的内存，显然光靠垃圾回收器是无法帮助你的了。由上面的代码来看，似乎是longstr在每次replaceThing调用的时候都没有得到回收。每一个theThing结构都含有一个longstr结构列表。每一秒当我们调用 replaceThing, 它就会把当前的指向传递给priorThing。但是到这里我们也会看到并没有什么问题，因为priorThing每回也是先解开上次函数的指向才会接受新的赋值。并且所有的这一切都是发生在replaceThing函数体当中，按常理来说当函数体结束之后，函数中的本地变量也将会被垃圾回收器回收，也就不会出现内存泄露的问题了，但是为什么会出现上面的错误呢？
这是因为longstr的定义是在一个闭包中进行的，而它又被其他的闭包所引用，js规定，在闭包中引入闭包外部的变量时，当闭包结束时此对象无法被垃圾回收。

var theThing = null; 
var replaceThing = function () { 
    var priorThing = theThing; 
    var unused = function () { 
        if (priorThing) {       
            console.log("hi");     
        }   
    }; 
    theThing = {     
        longStr: new Array(100).join('*'),
        someMethod: function () {       
            console.log(someMessage);  
        }   
    }; 
};
setInterval(replaceThing, 1000);
```

### 3.计时器、回调、监听等事件没有移除：
```
计时器、回调、事件监听等没有清除是一直存在的，一直存在没有被释放就会造成内存泄漏。
为了增强网站的交互性或者是制作一些浮华的动画，你可能会创建大量的事件监听器。而用户在你的单页面应用中移向其他页面时，你又忘记移除这些监听器，那么也可能会导致内存泄漏。当用户在这些页面来回移动的时候，这些监听器会不断增加。
```
### 4.给DOM添加属性或方法：
```
给DOM添加点击方法、添加属性等，也会造成变量引用得不到释放，造成内存泄漏。
例移除 DOM 元素：这个问题很常见，类似于全局变量导致的内存泄漏。DOM 元素存在于对象图内存和 DOM 树中。用例子来解释可能会更好：
var terminator = document.getElementById('terminate');
var badElem = document.getElementById('toDelete');
terminator.addEventListener('click', function()  {
  badElem.remove();
});

在你通过 id = ‘terminate’ 点击了按钮之后，toDelete 会从 DOM 中移除。不过，由于它仍然被监听器引用，为这个对象分配的内存并不会被释放。
var terminator = document.getElementById('terminate');
terminator.addEventListener('click', function()  {
  var badElem = document.getElementById('toDelete');
  badElem.remove();
});

badElem 是局部变量，在移除操作完成之后，内存将会被垃圾回收器回收。
```

### 5.循环引用
```
简单的例子：一个 DOM 对象被一个 Javascript 对象引用，与此同时又引用同一个或其它的 Javascript 对象，这个 DOM 对象可能会引发内存泄露。这个 DOM 对象的引用将不会在脚本停止的时候被垃圾回收器回收。要想破坏循环引用，引用 DOM 元素的对象或 DOM 对象的引用需要被赋值为null

```
### 总结
```
最基础的造成内存泄漏的几个点，应该还有更深层次一点的。而内存泄漏最核心的还是因为垃圾机制，全局变量或者是被全局变量引用，垃圾机制就无法回收，要是一直需要使用的还好，要是一些用完一次就不再使用的没有释放，那么积累的多了就容易造成内存溢出。
```

