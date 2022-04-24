## 来看看目前最火的MVVM

- 今天面试又被问到什么是MVVM?
- 光靠说理论已经糊弄不过去了?
- 什么!MVVM的实现不止一种啊?
- 往下看~ 亲手带你剖析MVVM原理!

## 先来总结下MVVM的实现方式

- 传统的MVC中通过发布订阅来进行数据和视图的绑定监听
- angular1.x中通过脏值检测来实现MVVM模式
- 目前主流Vue的模式:数据劫持 Object.defineProperty、发布订阅
- ES6中的新特性Proxy和Reflect

## 谈谈现代版的框架

直接从主流的说起！
 vue的特点不必多说(简单易用)。修改数据方便不需要记忆api方法,这都归功于Object.defineProperty,它可以在数据的设置和获取时增加我们自己的功能！(像墙一样)

## 总结下实现MVVM都要掌握哪些！

- 模板编译(Compile)
- 数据劫持(Observer)
- 发布的订阅(Dep)
- 观察者(Watcher)

> MVVM模式就要将这些板块进行整合,实现模板和数据的绑定！

看看我画图的功底,有个印象就好！

![img](https://user-gold-cdn.xitu.io/2018/5/7/16339e3e41488d37?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



## 先简单来说说MVVM



![img](https://user-gold-cdn.xitu.io/2018/5/7/16339e3e3f24873d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



- 数据就是简单的javascript对象,需要将数据绑定到模板上
- 1.监听视图的变化,视图变化后通知数据更新。2.数据更新会再次导致视图的变化！

## Vue基础案例

看段大众代码，接下来我们就基于这段代码搞一下MVVM的实现

```js
<div id="app">
    <!-- 双向数据绑定 靠的是表单 -->
    <input type="text" v-model="message.a">
    <div>我很帅</div>
    {{message.a}} {{b}}
</div>
<script src="watcher.js"></script>
<script src="observer.js"></script>
<script src="compile.js"></script>
<script src="MVVM.JS"></script>
<script>
    // 我们的数据一般都挂载在vm上
    let vm = new MVVM({
        el:'#app',
        data:{
            message:{a:'jw'},
            b:'MVVM'
        }
    })
</script>
```

这里我们用了自己的MVVM库,这个库是用来整合所有板块的！

## MVVM构建

直接用ES6来打造我们的MVVM

```js
class MVVM{
    constructor(options){
        // 一上来 先把可用的东西挂载在实例上
        this.$el = options.el;
        this.$data = options.data;
        // 如果有要编译的模板我就开始编译
        if(this.$el){
            // 用数据和元素进行编译
            new Compile(this.$el, this);
        }
    }
}
```

## 模板编译

MVVM中调用了Compile类来编译我们的页面,开始来实现模板编译

先来个基础的架子

```js
class Compile {
    constructor(el, vm) {
        // 看看传递的元素是不是DOM,不是DOM我就来获取一下~
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        if (this.el) {
            // 如果这个元素能获取到 我们才开始编译
            // 1.先把这些真实的DOM移入到内存中 fragment (性能优化)
            let fragment = this.node2fragment(this.el);
            // 2.编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
            this.compile(fragment);
            // 3.把编译号的fragment在塞回到页面里去
            this.el.appendChild(fragment);
        }
    }
    /* 专门写一些辅助的方法 */
    isElementNode(node) {
        return node.nodeType === 1;
    }
    /* 核心的方法 */
    compileElement(node) {}
    compileText(node) {}
    compile(fragment) {}
    node2fragment(el) {}
}
```

### 接下来一个个的方法来解释

### 方法1：node2fragment

```js
node2fragment(el) { // 需要将el中的内容全部放到内存中
    // 文档碎片 内存中的dom节点
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = el.firstChild) {
        fragment.appendChild(firstChild);
        // appendChild具有移动性
    }
    return fragment; // 内存中的节点
}
```

### 方法2：compile

```js
compile(fragment) {
    // 需要递归 每次拿子元素
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach(node => {
        if (this.isElementNode(node)) {
            // 是元素节点，还需要继续深入的检查
            // 这里需要编译元素
            this.compileElement(node);
            this.compile(node)
        } else {
            // 文本节点
            // 这里需要编译文本
            this.compileText(node);
        }
    });
}
```

> 我们在弄出两个方法compileElement,compileText来专门处理对应的逻辑

### 方法3：compileElement&compileText

```js
/*辅助的方法*/
// 是不是指令
isDirective(name) {
    return name.includes('v-');
}
----------------------------
compileElement(node) {
    // 带v-model v-text 
    let attrs = node.attributes; // 取出当前节点的属性
    Array.from(attrs).forEach(attr => {
        // 判断属性名字是不是包含v-model 
        let attrName = attr.name;
        if (this.isDirective(attrName)) {
            // 取到对应的值放到节点中
            let expr = attr.value;
            let [, type] = attrName.split('-'); // 
            // 调用对应的编译方法 编译哪个节点,用数据替换掉表达式
            CompileUtil[type](node, this.vm, expr);
        }
    })
}
compileText(node) {
    let expr = node.textContent; // 取文本中的内容
    let reg = /\{\{([^}]+)\}\}/g; // {{a}} {{b}} {{c}}
    if (reg.test(expr)) { 
        // 调用编译文本的方法 编译哪个节点,用数据替换掉表达式
        CompileUtil['text'](node, this.vm, expr);
    }
}
```

### 方法4：CompileUtil

我们要实现一个专门用来配合Complie类的工具对象

先只处理文本和输入框的情况

```js
CompileUtil = {
  text(node, vm, expr) { // 文本处理
      let updateFn = this.updater['textUpdater'];
      // 用处理好的节点和内容进行编译
      updateFn && updateFn(node, value)
  },
  model(node, vm, expr) { // 输入框处理
        let updateFn = this.updater['modelUpdater'];
        // 用处理好的节点和内容进行编译
        updateFn && updateFn(node, value);
  },
  updater: {
      // 文本更新
      textUpdater(node, value) {
          node.textContent = value
      },
      // 输入框更新
      modelUpdater(node, value) {
          node.value = value;
      }
  }
}
```

实现text方法

```js
text(node, vm, expr) { // 文本处理
    let updateFn = this.updater['textUpdater'];
    // 文本比较特殊 expr可能是'{{message.a}} {{b}}'
    // 调用getTextVal方法去取到对应的结果
    let value = this.getTextVal(vm, expr);
    updateFn && updateFn(node, value)
},
getTextVal(vm, expr) { // 获取编译文本后的结果
    return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
        // 依次去去数据对应的值
        return this.getVal(vm, arguments[1]);
    })
},
getVal(vm, expr) { // 获取实例上对应的数据
    expr = expr.split('.'); // {{message.a}} [message,a] 实现依次取值
    // vm.$data.message => vm.$data.message.a
    return expr.reduce((prev, next) => { 
        return prev[next];
    }, vm.$data);
}
```

实现Model方法

```
model(node, vm, expr) { // 输入框处理
    let updateFn = this.updater['modelUpdater'];
    // 这里应该加一个监控 数据变化了 应该调用这个watch的callback 
    updateFn && updateFn(node, this.getVal(vm, expr));
}
复制代码
```

看下编译后的效果^_^



![img](https://user-gold-cdn.xitu.io/2018/5/14/1635d666b44b2ee6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



## 数据劫持

我们一直说Object.defineProperty有劫持功能咱就看看这个是怎样劫持的

默认情况下定义属性给属性设置的操作是这样的

```js
let school = {name:''}
school.name = 'jw';  // 当我给属性设置时希望做一些操作
console.log(school.name); // 当我获取属性时也希望对应有写操作
```

这时候Object.defineProperty登场

```js
let school = {name:''}
let val;
Object.defineProperty(school, 'name', {
  enumerable: true, // 可枚举,
  configurable: true, // 可配置
  get() {
    // todo
    return val;
  },
  set(newVal) {
    // todo
    val = newVal
  }
});
school.name = 'jw';
console.log(school.name);
```

这样我们可以在设置值和获取值时做我们想要做的操作了

接下来我们就来写下一个类Observer

```js
// 在MVVM加上Observe的逻辑
if(this.$el){
    // 数据劫持 就是把对想的所有属性 改成get和set方法
    new Observer(this.$data);
    // 用数据和元素进行编译
    new Compile(this.$el, this);
}
--------------------------------------
class Observer{
    constructor(data){
       this.observe(data); 
    }
    observe(data){ 
        // 要对这个data数据将原有的属性改成set和get的形式
        // defineProperty针对的是对象
        if(!data || typeof data !== 'object'){
            return;
        }
        // 要将数据 一一劫持 先获取取到data的key和value
        Object.keys(data).forEach(key=>{
            // 定义响应式变化
            this.defineReactive(data,key,data[key]);
            this.observe(data[key]);// 深度递归劫持
        });
    }
    // 定义响应式
    defineReactive(obj,key,value){
        // 在获取某个值的适合 想弹个框
        let that = this;
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){ // 当取值时调用的方法
                return value;
            },
            set(newValue){ // 当给data属性中设置值的适合 更改获取的属性的值
                if(newValue!=value){
                    // 这里的this不是实例 
                    that.observe(newValue);// 如果是设置的是对象继续劫持
                    value = newValue;
                }
            }
        });
    }
}
```

来再看看效果^_^



![img](https://user-gold-cdn.xitu.io/2018/5/14/1635d671ebdd2929?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



## Watcher实现

观察者的目的就是给需要变化的那个元素增加一个观察者，用新值和老值进行比对,如果数据变化就执行对应的方法

```js
class Watcher{ // 因为要获取老值 所以需要 "数据" 和 "表达式"
    constructor(vm,expr,cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 先获取一下老的值 保留起来
        this.value = this.get();
    }
    // 老套路获取值的方法，这里先不进行封装
    getVal(vm, expr) { 
        expr = expr.split('.'); 
        return expr.reduce((prev, next) => {
            return prev[next];
        }, vm.$data);
    }
    get(){
        let value = this.getVal(this.vm,this.expr);
        return value;
    }
    // 对外暴露的方法，如果值改变就可以调用这个方法来更新
    update(){
        let newValue = this.getVal(this.vm, this.expr);
        let oldValue = this.value;
        if(newValue != oldValue){
            this.cb(newValue); // 对应watch的callback
        }
    }
}
```

### 在哪里使用watcher?答案肯定是compile呀,给需要重新编译的DOM增加watcher

```js
text(node, vm, expr) { // 文本处理
    let updateFn = this.updater['textUpdater'];
    let value = this.getTextVal(vm, expr);
+   expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
+       new Watcher(vm, arguments[1],(newValue)=>{
+           // 如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
+           updateFn && updateFn(node,this.getTextVal(vm,expr));
+       });
+   })
    updateFn && updateFn(node, value)
},
model(node, vm, expr) { // 输入框处理
    let updateFn = this.updater['modelUpdater'];
+   new Watcher(vm,expr,(newValue)=>{
+       // 当值变化后会调用cb 将新的值传递过来 
+       updateFn && updateFn(node, newValue);
+   });
    updateFn && updateFn(node, this.getVal(vm, expr));
}
```

## 发布订阅

如何将视图和数据关联起来呢?就是将每个数据和对应的watcher关联起来。当数据变化时让对应的watcher执行update方法即可！再想想在哪做操作呢？就是我们的set和get!

Dep实现

```js
class Dep{
    constructor(){
        // 订阅的数组
        this.subs = []
    }
    addSub(watcher){
        this.subs.push(watcher);
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update());
    }
}
```

关联dep和watcher

watcher中有个重要的逻辑就是this.get();每个watcher被实例化时都会获取数据从而会调用当前属性的get方法

```js
// watcher中的get方法
get(){
    // 在取值前先将watcher保存到Dep上
    Dep.target = this;
    let value = this.getVal(this.vm,this.expr); // 会调用属性对应的get方法
    Dep.target = null;
    return value;
}
// 更新Observer中的defineReactive
defineReactive(obj,key,value){
    let that = this;
+   let dep = new Dep(); // 每个变化的数据 都会对应一个数组,这个数组是存放所有更新的操作
    Object.defineProperty(obj,key,{
        enumerable:true,
        configurable:true,
        get(){ // 当取值时调用的方法
            Dep.target && dep.addSub(Dep.target);
            return value;
        },
        set(newValue){
            if(newValue!=value){
                that.observe(newValue);
                value = newValue;
                dep.notify(); // 通知所有人 数据更新了
            }
        }
    });
}
```

到此数据和视图就关联起来了！^_^



![img](https://user-gold-cdn.xitu.io/2018/5/14/1635d677223511bc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



## 监听输入事件

```
setVal(vm,expr,value){ 
    expr = expr.split('.');
    return expr.reduce((prev,next,currentIndex)=>{
        if(currentIndex === expr.length-1){
            return prev[next] = value;
        }
        return prev[next];
    },vm.$data);
},
model(node, vm, expr) {
    let updateFn = this.updater['modelUpdater'];
    new Watcher(vm,expr,(newValue)=>{
        // 当值变化后会调用cb 将新的值传递过来 （）
        updateFn && updateFn(node, this.getVal(vm, expr));
    });
+   node.addEventListener('input',(e)=>{
+       let newValue = e.target.value;
+       // 监听输入事件将输入的内容设置到对应数据上
+       this.setVal(vm,expr,newValue)
+   });
    updateFn && updateFn(node, this.getVal(vm, expr));
}
复制代码
```

## 代理数据

```
class MVVM{
    constructor(options){
        this.$el = options.el;
        this.$data = options.data;
        if(this.$el){
            new Observer(this.$data);
            // 将数据代理到实例上直接操作实例即可，不需要通过vm.$data来进行操作
            this.proxyData(this.$data);
            new Compile(this.$el, this);
        }
    }
    proxyData(data){
        Object.keys(data).forEach(key=>{
            Object.defineProperty(this,key,{
                get(){
                    return data[key]
                },
                set(newValue){
                    data[key] = newValue
                }
            })
        })
    }
}
复制代码
```

看看最终效果!



![img](https://user-gold-cdn.xitu.io/2018/5/14/1635d67cf286f248?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


作者：凌晨夏沫
链接：https://juejin.im/post/5af8eb55f265da0b814ba766
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。