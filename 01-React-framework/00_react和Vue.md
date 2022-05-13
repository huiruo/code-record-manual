
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