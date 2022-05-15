/*
* 另外一个问题：
* 我们发现虽然 effect 中没有依赖 obj.age ,但当我们改变 obj.age 时，effect 还是会重新执行。
* 这是因为我们的响应式系统的依赖收集和触发的颗粒度不够，我们现在的解决方案是只要 obj 里面的值发生变化都会触发副作用的更新，这显然是不对的。
* 所以收集依赖时，必须精确到 obj 的key，大致的数据结构设计如下所示：
* 在 vue3 中，使用的是 WeakMap来描述这一关系
*
* Vue3 响应式设计的巧妙之处就在于此，通过这样一种数据结构就把整个响应式的依赖收集以及对应关系描述的清清楚楚。当然我们今天实现的内容是 vue3
* 响应式的核心，但不是全部，一个完整的响应式系统会非常复杂，需要考虑到的情况也非常的多，但最终都会基于以上这种数据结构去缝缝补补。
* */
let data = {
    name: 'js',
};

let activeEffect;
let effects = new WeakMap(); // 存放所有的对象及副作用的关系
const obj = new Proxy(data, {
    get(target, key) {
        // 判断，有没有 target的关系树
        let depsMap = effects.get(target);
        //如果没有就创建，以当前 obj 为 key
        if (!depsMap) {
            effects.set(target, (depsMap = new Map()));
        }
        // 看 obj.xxx 具体的key有没有创建依赖关系
        let deps = depsMap.get(key);
        // 如果没有就创建
        if (!deps) {
            depsMap.set(key, (deps = new Set()));
        }
        // 如果有依赖 就添加到对应的 key上
        if (activeEffect) {
            deps.add(activeEffect);
        }
        return target[key];
    },
    set(target, key, val) {
        target[key] = val;
        // 从WeakMap中取出对应的依赖关系
        const depsMap = effects.get(target);
        if (depsMap) {
            // 取出obj对应的key
            const effect = depsMap.get(key);
            //如果有副作用函数就执行所有的副作用函数
            effect && effect.forEach((fn) => fn());
        }
    },
});
function effect(fn) {
    activeEffect = fn;
    fn();
}
effect(() => {
    console.log('模拟dom更新===》')
    // document.body.innerHTML = obj.name;
});
setTimeout(() => {
    obj.age = 18;
}, 2000);
