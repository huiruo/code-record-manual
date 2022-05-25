## 来看看vue中data属性和computed相关的源代码。
```js
// src/core/instance/state.js
// 初始化组件的state
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  // 当组件存在data属性
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  // 当组件存在 computed属性
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
initState方法当组件实例化时会自动触发，该方法主要完成了初始化data,methods,props,computed,watch这些我们常用的属性，我们来看看我们需要关注的initData和initComputed（为了节省时间，去除了不太相关的代码）
### 先看看initData这条线:
```js
// src/core/instance/state.js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  // .....省略无关代码
  
  // 将vue的data传入observe方法
  observe(data, true /* asRootData */)
}

// src/core/observer/index.js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value)) {
    return
  }
  let ob: Observer | void
  // ...省略无关代码
  ob = new Observer(value)
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```
### 在初始化的时候observe方法本质上是实例化了一个Observer对象，这个对象的类是这样的
```js
// src/core/observer/index.js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value
    // 关键代码 new Dep对象
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    // ...省略无关代码
    this.walk(value)
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      // 给data的所有属性调用defineReactive
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}
```
### 在对象的构造函数中，最后调用了walk方法，该方法即遍历data中的所有属性，并调用defineReactive方法
```
defineReactive方法是vue实现 MDV(Model-Driven-View)的基础，本质上就是代理了数据的set,get方法，当数据修改或获取的时候，能够感知（当然vue还要考虑数组，Object中嵌套Object等各种情况，本文不在分析）。我们具体看看defineReactive的源代码
```
```js
// src/core/observer/index.js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 重点，在给具体属性调用该方法时，都会为该属性生成唯一的dep对象
  const dep = new Dep()

  // 获取该属性的描述对象
  // 该方法会返回对象中某个属性的具体描述
  // api地址https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
  const property = Object.getOwnPropertyDescriptor(obj, key)
  // 如果该描述不能被更改，直接返回，因为不能更改，那么就无法代理set和get方法，无法做到响应式
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set

  let childOb = !shallow && observe(val)
  // 重新定义data当中的属性，对get和set进行代理。
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      // 收集依赖， reversedMessage为什么会跟着message变化的原因
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
        if (Array.isArray(value)) {
          dependArray(value)
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      // 通知依赖进行更新
      dep.notify()
    }
  })
}
```


我们可以看到，在所代理的属性的get方法中，当dep.Target存在的时候会调用dep.depend()方法，这个方法非常的简单，不过在说这个方法之前，我们要认识一个新的类Dep:
```js
// src/core/observer/dep.js
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      // 更新 watcher 的值，与 watcher.evaluate() 类似，
      // 但 update 是给依赖变化时使用的，包含对 watch 的处理
      subs[i].update()
    }
  }
}

// 当首次计算 computed 属性的值时，Dep 将会在计算期间对依赖进行收集
Dep.target = null
const targetStack = []

export function pushTarget (_target: Watcher) {
  // 在一次依赖收集期间，如果有其他依赖收集任务开始（比如：当前 computed 计算属性嵌套其他 computed 计算属性），
  // 那么将会把当前 target 暂存到 targetStack，先进行其他 target 的依赖收集，
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  // 当嵌套的依赖收集任务完成后，将 target 恢复为上一层的 Watcher，并继续做依赖收集
  Dep.target = targetStack.pop()
}
```

代码非常的简单，回到调用dep.depend()方法的时候，当Dep.Target存在，就会调用，而depend方法则是将该dep加入watcher的newDeps中,同时，将所访问当前属性的dep对象中的subs插入当前Dep.target的watcher.看起来有点绕，不过没关系，我们一会跟着例子讲解一下就清楚了。

讲完了代理的get,方法，我们讲一下代理的set方法，set方法的最后调用了dep.notify(),当设置data中具体属性值的时候，就会调用该属性下面的dep.notify()方法，通过class Dep了解到，notify方法即将加入该dep的watcher全部更新，也就是说，当你修改data中某个属性值时，会同时调用dep.notify()来更新依赖该值的所有watcher。

介绍完了initData这条线，我们继续来介绍initComputed这条线，这条线主要解决了什么时候去设置Dep.target的问题（如果没有设置该值，就不会调用dep.depend(), 即无法获取依赖）。
```js
// src/core/instance/state.js
const computedWatcherOptions = { lazy: true }
function initComputed (vm: Component, computed: Object) {
  // 初始化watchers列表
  const watchers = vm._computedWatchers = Object.create(null)
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (!isSSR) {
      // 关注点1，给所有属性生成自己的watcher, 可以在this._computedWatchers下看到
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    if (!(key in vm)) {
      // 关注点2
      defineComputed(vm, key, userDef)
    }
  }
}
```

在初始化computed时，有2个地方需要去关注

对每一个属性都生成了一个属于自己的Watcher实例，并将 { lazy: true }作为options传入
对每一个属性调用了defineComputed方法(本质和data一样，代理了自己的set和get方法，我们重点关注代理的get方法)
我们看看Watcher的构造函数
```js
// src/core/observer/watcher.js
constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: Object
  ) {
    this.vm = vm
    vm._watchers.push(this)
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // 如果初始化lazy=true时（暗示是computed属性），那么dirty也是true,需要等待更新
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.getter = expOrFn // 在computed实例化时，将具体的属性值放入this.getter中
    // 省略不相关的代码
    this.value = this.lazy
      ? undefined
      : this.get()
  }
```
