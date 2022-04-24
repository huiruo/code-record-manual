/* 记录代理，防止重复代理 */
let toProxy = new WeakMap();/* (target,observed) 用于验证是否有代理*/
let toRow = new WeakMap();/* (obseved,target) 拥有验证是否被代理过*/
function isObject(target) {
    return typeof target === 'object' && target;
}
function hasKey(target, key) {
    return target.hasOwnProperty(key);
}
function reactive(target) {
    // 创建响应式对象
    return createReactiveObject(target);
}
function createReactiveObject(target) {
    /* 非对象或者已被代理 */
    if (!isObject(target) || toRow.has(target)) {
        return target;
    }
    /* 获取代理的对象 */
    let proxy = toProxy.get(target);
    if (proxy) {
        return proxy;
    }
    let baseHandler = {
        get(target, key, receiver) {
            console.log(`get---key(${key})`);
            let res = Reflect.get(target, key);

            track(target, key);
            return isObject(res) ? reactive(res) : res;
        },
        set(target, key, val, receiver) {
            console.log(`set---key(${key})`)
            /* 判断原来是否有该属性 */
            let has = hasKey(target, key);
            let oldval = target[key];
            let res = Reflect.set(target, key, val, receiver);
            if (!has) {
                trigger(target, 'add', key);
                console.log('新增属性');
            } else if (val !== oldval) {
                trigger(target, 'set', key);
                console.log('修改属性');
            }
            return res;
        },
        deleteProperty(target, key) {
            console.log(`delete---key(${key})`)
            return Reflect.deleteProperty(target, key)
        }
    }
    /* 创建代理 */
    let observed = new Proxy(target, baseHandler);
    /* 记录代理关系 */
    toProxy.set(target, observed);
    toRow.set(observed, target);
    return observed;
}

// let arr = [1, 3, 2, 7];
// let proxy = reactive(arr);
// proxy.push(8);
// proxy.length = 100;

// let proxy = reactive({ name: { n: 'aeip' } });
// console.log(proxy.name.n);
// proxy.name.n = 'yuan';
/*
get---name
get---n
aeip
get---name
set---n */
let activeEffectStacks = [];
function effect(fun) {
    let effect = createReactiveEffect(fun);
    effect();/* 默认先执行一次 */
}
function createReactiveEffect(fun) {
    /* 创造响应式effect */
    let effect = function () {
        return run(effect, fun);
    }
    return effect;
}
function run(effect, fun) {
    try {
        activeEffectStacks.push(effect);
        fun();
    } finally {
        activeEffectStacks.pop();
    }
}
/* 
targetsMap --- (target,depsMap)
depsMap ------ (key,deps)
deps --------- [effect1,effect2...]
*/
let targetsMap = new WeakMap();
function track(target, key) {
    /* 取出栈顶的原因是栈顶元素为最新的事件，也就是触发get的事件，接着将该事件作为订阅者加入到数组中 */
    let effect = activeEffectStacks[activeEffectStacks.length - 1];
    if (effect) {
        /* 获取target对应的depsMap */
        let depsMap = targetsMap.get(target);
        if (!depsMap) {
            targetsMap.set(target, depsMap = new Map());
        }
        /* 获取target.key的所有deps订阅者 */
        let deps = depsMap.get(key);
        /* 没有订阅者则创建一个新Set用于存订阅者 */
        if (!deps) {
            depsMap.set(key, deps = new Set());
        }
        /* 如果当前事件不在Set中,加入到其中作为订阅者*/
        if (!deps.has(effect)) {
            deps.add(effect);
        }
    }
}
/* key变化触发 */
function trigger(target, type, key) {
    /* 获取target对应的存了key区分的多个Set的Map */
    let depsMap = targetsMap.get(target);
    if (depsMap) {
        /* 获取key对应的Set */
        let deps = depsMap.get(key);
        if (deps) {
            /* 将订阅者数组的事件全部执行 */
            deps.forEach(effect => {
                effect();
            })
        }
    }
}
/* 依赖收集 - 发布订阅 */
let obj = reactive({ name: 'aeip' });
// 更改后会自动执行effect
effect(() => {
    console.log(obj.name)
});
obj.name = 'yuan';