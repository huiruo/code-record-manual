#### vue
数据流：
this.state = Vue 的底层使用了依赖追踪，页面更新渲染已经是最优的了，但是 React 还是需要用户手动去优化这方面的问题。

模板编译(Compile)

数据劫持(Observer)

发布的订阅(Dep)

观察者(Watcher)
在哪里使用 watcher?答案肯定是 compile 呀,给需要重新编译的 DOM 增加 watcher
观察者的目的就是给需要变化的那个元素增加一个观察者，用新值和老值进行比对,如果数据变化就执行对应的方法


> Vue 内部通过 Object.defineProperty 方法属性拦截的方式，把 data 对象里每个数据的读写转化成 getter/setter，当数据变化时通知视图更新。
>
> 当 data 有变化的时候它通过 Object.defineProperty(）方法中的 set 方法进行监控，并调用在此之前已经定义好 data 和 view 的关系了的回调函数，来通知 view 进行数据的改变
>
> 而 view 发生改变则是通过底层的 input 事件来进行 data 的响应更改

### vue2 响应式
```js
vue实现数据双向绑定主要是：采用数据劫持,结合发布者-订阅者模式的方式，通过 Object.defineProperty() 来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调。当把一个普通 Javascript 对象传给 Vue实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty() 将它们转为 getter/setter。用户看不到 getter/setter，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。

vue的数据双向绑定 将MVVM作为数据绑定的入口，整合Observer，Compile和Watcher三者，

通过Observer来监听自己的model的数据变化，
通过Compile来解析编译模板指令（vue中是用来解析 {{}}），

最终利用watcher搭起observer和Compile之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据model变更双向绑定效果。
```
### 双向数据绑定深入
```
面试的时候问起vue的原理，大部分的人都会说通过Object.defineProperty修改属性的get, set方法，从而达到数据改变的目的。然而作为vue的MVVM驱动核心，从数据的改变到视图的改变，远远不止这句话就能解释，而是通过Observer, Dep, Watcher, Compile 4个类以及一个CpompileUtil辅助类完成。
```
Vue 主要通过以下 4 个步骤来实现数据双向绑定的：订阅者 Watcher：Watcher是 Observer 和 Compile 之间通信的桥梁
```
1.监听器 Observer：对数据对象进行遍历，包括子属性对象的属性，利用 Object.defineProperty() 对属性都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化。

2.解析器 Compile：解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新。

3.订阅者 Watcher：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁 ，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。

4.订阅器 Dep：订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理。
```

```js
//vue中属性变化,首先触发Object.defineProperty中属性的set监听,执行updateComponent方法(异步),通过vm._render()更新vNode(新旧node对比),最后渲染到html中
//observer:观察者
function observer(obj) {
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) break;
            defineReactive(obj, key, obj[key]);
        }
    }
}
function defineReactive(obj, key, value) {
    observer(value);
    Object.defineProperty(obj, key, {
        get() {
            return value;
        },
        set(newValue) {
            observer(newValue);
            if (value === newValue) return;
            value = newValue;
        }
    });
}
function $set(data, key, value) {
    defineReactive(data, key, value);
}
```

```


### vue实现数据绑定原理
1、vue使用数据劫持实现数据双向绑定
```text
1. vue.js 采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter
2. 在数据变动时发布消息给订阅者，触发相应的监听回调。
```
2、数据劫持原理
```text
1、实现一个数据监听器Observer，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者

2、实现一个指令解析器Compile，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数

3、实现一个Watcher，作为连接Observer和Compile的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图

4、mvvm入口函数，整合以上三者
```
https://img2018.cnblogs.com/blog/1080958/201905/1080958-20190509151007317-380306546.png
###### 第一步：实现Observer
1. 我们知道可以利用Obeject.defineProperty()来监听属性变动
2. 那么将需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter和getter
3. 这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化。
```js
//Observer 给对象添加setter、getter属性

var data = {name: 'kindeng'};
observe(data);
data.name = 'dmq'; // 哈哈哈，监听到值变化了 kindeng --> dmq

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    // 取出所有属性遍历
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key]);
    });
};

function defineReactive(data, key, val) {
    observe(val); // 监听子属性
    Object.defineProperty(data, key, {
        enumerable: true, // 可枚举
        configurable: false, // 不能再define
        get: function() {
            return val;
        },
        set: function(newVal) {
            console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal);
            val = newVal;
        }
    });
}
```
###### 4. 这样我们已经可以监听每个数据的变化了，那么监听到变化之后就是怎么通知订阅者了，所以接下来我们需要实现一个消息订阅器
###### 5. 很简单维护一个数组，用来收集订阅者，数据变动触发notify，再调用订阅者的update方法
```js
数据变化触发notify调用订阅者的update方法

// ... 省略
function defineReactive(data, key, val) {
    var dep = new Dep();
    observe(val); // 监听子属性

    Object.defineProperty(data, key, {
        // ... 省略
        set: function(newVal) {
            if (val === newVal) return;
            console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal);
            val = newVal;
            dep.notify(); // 通知所有订阅者
        }
    });
}

function Dep() {
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};

```
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

#### 实例2
```javaScript
// 1.MVVM 中调用了 Compile 类来编译我们的页面,开始来实现模板编译
class MVVM {
  constructor(options) {
    // 一上来 先把可用的东西挂载在实例上
    this.$el = options.el;
    this.$data = options.data;
    // 如果有要编译的模板我就开始编译
    if (this.$el) {
      // 数据劫持 就是把对想的所有属性 改成get和set方法
      new Observer(this.$data);
      // 用数据和元素进行编译
      new Compile(this.$el, this);
    }
  }
}

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

#### 观察者模式： 当一个变量值被修改时，可以自动通知所有关注这个变量的其他对象，自动重新更新获取这个变量的新值。
```javaScript
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

### 观察者的目的就是给需要变化的那个元素增加一个观察者，用新值和老值进行比对,如果数据变化就执行对应的方法
在哪里使用 watcher?答案肯定是 compile 呀,给需要重新编译的 DOM 增加 watcher
```javaScript
class Watcher {
  // 因为要获取老值 所以需要 "数据" 和 "表达式"
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    // 先获取一下老的值 保留起来
    this.value = this.get();
  }
  // 老套路获取值的方法，这里先不进行封装
  getVal(vm, expr) {
    expr = expr.split(".");
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  }
  get() {
    let value = this.getVal(this.vm, this.expr);
    return value;
  }
  // 对外暴露的方法，如果值改变就可以调用这个方法来更新
  update() {
    let newValue = this.getVal(this.vm, this.expr);
    let oldValue = this.value;
    if (newValue != oldValue) {
      this.cb(newValue); // 对应watch的callback
    }
  }
}
```

#### 发布订阅

如何将视图和数据关联起来呢?就是将每个数据和对应的 watcher 关联起来。当数据变化时让对应的 watcher 执行 update 方法即可！再想想在哪做操作呢？就是我们的 set 和 get!
Dep 实现
```js
class Dep {
  constructor() {
    // 订阅的数组
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}
```