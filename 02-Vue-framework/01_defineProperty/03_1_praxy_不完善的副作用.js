let data = {
    name: 'js',
};

const obj1 = new Proxy(data, {
    get(target, key) {
        return target[key];
    },
    set(target, key, val) {
        target[key] = val;
        console.log('监听赋值成功', key,'val:',val)
        // render();
    },
});

obj1.name = 'java';
console.log('分割线：==============》')

// 定义一个副作用函数，如果obj.name发生变化，这个函数就会自动执行
/*
effect(() => {
  document.body.innerHTML = obj.name;
});
setTimeout(() => {
  obj.name = '你好，掘金';
}, 2000);
* */
// effect 副作用函数不止一个，所以我们需要有个数组去存放所有的副作用函数，先用 Set 来存放好了
// 从使用上来看 effect 入参接收的是一个函数 fn，所以 effect 是个高阶函数。当 obj 触发 set 时需要执行这个 fn，所以 fn 函数需要暴露出来以便使用。
// 存放所有的副作用
// 触发get的时候去收集，触发set的时候去执行，所以完整代码如下所示：
// 这种依赖收集和触发的模式也是我们常说的发布订阅模式。

/*
* 另外一个问题：
* 我们发现虽然 effect 中没有依赖 obj.age ,但当我们改变 obj.age 时，effect 还是会重新执行。
* 这是因为我们的响应式系统的依赖收集和触发的颗粒度不够，我们现在的解决方案是只要 obj 里面的值发生变化都会触发副作用的更新，这显然是不对的。
* 所以收集依赖时，必须精确到 obj 的key，大致的数据结构设计如下所示：
* 在 vue3 中，使用的是 WeakMap来描述这一关系
* */

let activeEffect;
let effects = new Set();
const obj = new Proxy(data, {
    get(target, key) {
        if (activeEffect) {
            // 收集副作用
            effects.add(activeEffect);
        }
        return target[key];
    },
    set(target, key, val) {
        target[key] = val;
        //执行所有的副作用
        effects.forEach((effect) => effect());
    },
});
function effect(fn) {
    activeEffect = fn;
    fn();
}
//   当 obj.name 改变的时候，希望 effect可以再次被执行
effect(() => {
    console.log('模拟dom更新===》')
    // document.body.innerHTML = obj.name;
});
// 可以存在多个effect
effect(() => {
    console.log('当前obj:',obj.name);
});

setTimeout(() => {
    obj.name = '你好，掘金';
}, 2000);

