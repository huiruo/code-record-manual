**1. 虚拟DOM重写**
虚拟 DOM 从头开始重写，我们可以期待更多的编译时提示来减少运行时开销。重写将包括更有效的代码来创建虚拟节点。

**2. 优化 slots 的生成**
目前在 Vue 中，当父组件重新渲染时，其子组件也必须重新渲染。使用Vue 3，可以单独重新渲染父级和子级。

**3. 静态树提升(Static Tree Hoisting)**
使用静态树提升，这意味着 Vue 3 的编译器将能够检测到什么是静态的，然后将其提升，从而降低了渲染成本。它将能够跳过 patching 整棵树。

**4. 静态属性提升**
此外，我们可以期待静态属性提升，其中 Vue 3 将跳过不会改变的 patching 节点。

**5. 基于 Proxy 的 Observation（划重点）**
目前，Vue 的响应式系统是使用带有 Object.defineProperty 的getter 和 setter。但是，Vue 3 将使用 ES2015 Proxy 作为其观察机制。这消除了以前存在的警告，使速度加倍，并使用了一半的内存。
PS:为了继续支持 IE11，Vue 3 将发布一个支持旧观察机制和新代理版本的构建。

```js
其实就是在对目标对象的操作之前提供了拦截，可以对外界的操作进行过滤和改写，修改某些操作的默认行为，这样我们可以不直接操作对象本身，而是通过操作对象的代理对象来间接来操作对象，达到预期的目的~

let obj = {
  a : 1
}
let proxyObj = new Proxy(obj,{
    get : function (target,prop) {
        return prop in target ? target[prop] : 0
    },
    set : function (target,prop,value) {
        target[prop] = 888;
    }
})

console.log(proxyObj.a);        // 1
console.log(proxyObj.b);        // 0

proxyObj.a = 666;
console.log(proxyObj.a)         // 888

上述例子中，我们事先定义了一个对象 obj , 通过 Proxy 构造器生成了一个 proxyObj 对象，并对其的 set(写入) 和 get (读取) 行为重新做了修改。

当我们访问对象内原本存在的属性时，会返回原有属性内对应的值，如果试图访问一个不存在的属性时，会返回0 ，即我们访问 proxyObj.a 时，原本对象中有 a 属性，因此会返回 1 ，当我们试图访问对象中不存在的 b 属性时，不会再返回 undefined ，而是返回了 0 ，当我们试图去设置新的属性值的时候，总是会返回 888 ，因此，即便我们对 proxyObj.a 赋值为 666 ，但是并不会生效，依旧会返回 888!
```

## 语法
`ES6` 原生提供的 `Proxy` 语法很简单，用法如下：
```
let proxy = new Proxy(target, handler);
```

参数 `target` 是用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）, 参数 `handler` 也是一个对象，其属性是当执行一个操作时定义代理的行为的函数，也就是自定义的行为。
```js
Proxy 的基本用法就如同上面这样，不同的是 handler 对象的不同，handler 可以是空对象 {} ，则表示对 proxy 操作就是对目标对象 target 操作，即：
let obj = {}

let proxyObj = new Proxy(obj,{})

proxyObj.a = 1;
proxyObj.fn = function () {
    console.log('it is a function')
}

console.log(proxyObj.a); // 1
console.log(obj.a);      // 1
console.log(obj.fn())    // it is a function
```
