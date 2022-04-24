/* 判断类型是否为object */
function isObject(obj) {
    return obj && typeof obj === 'object';
}
/* 判断是否为已有属性 */
function hasOwn(target, key) {
    return target.hasOwnProperty(key);
}

/* ----------------响应式对象---------------- */
function reactive(target) {
    /* 创建响应式对象 */
    return createReactiveObject(target);
}
/* 防止重复设置代理(target,observer) */
let toProxy = new WeakMap();
/* 防止重复被代理(observer,target) */
let toRow = new WeakMap();
/* 设置响应监听 */
function createReactiveObject(target) {
    /* 非对象或被代理过则直接返回 */
    if (!isObject(target) || toRow.has(target)) return target;
    /* 已经有代理则直接返回 */
    let proxy = toProxy.get(target);
    if (proxy) {
        return proxy;
    }
    /* 监听 */
    let handler = {
        get(target, key) {
            console.log(`get---key(${key})`);
            let res = Reflect.get(target, key);
            /* 添加追踪 */
            track(target, key);
            /* 如果是对象则继续往下设置响应 */
            return isObject(res) ? reactive(res) : res;
        },/* 获取属性 */
        set(target, key, val, receiver) {
            console.log(`set---key(${key})`);
            /* 判断是否为新增属性 */
            let hasKey = hasOwn(target, key);
            /* 存储旧值用于比对 */
            let oldVal = target[key];
            let res = Reflect.set(target, key, val, receiver);
            if (!hasKey) {
                console.log(`新增属性---key(${key})`);
                /* 调用追踪器,绑定新增属性 */
                track(target, key);
                /* 调用触发器,更改视图 */
                trigger(target, key);
            } else if (val !== oldVal) {
                console.log(`修改属性---key(${key})`);
                trigger(target, key);
            }
            return res;
        },/* 修改属性 */
        deleteProperty(target, key) {
            console.log(`delete---key(${key})`);
            let res = Reflect.deleteProperty(target, key);
            return res;
        }/* 删除属性 */
    }
    /* 创建代理 */
    let observer = new Proxy(target, handler);
    /* 记录与target的联系 */
    toProxy.set(target, observer);
    toRow.set(observer, target);
    return observer;
}
/* ----------------依赖收集(发布订阅)---------------- */
/* 事件栈 */
let effectStack = [];
/* ----effect函数---- */
function effect(fun) {
    /* 将fun压入栈 */
    let effect = createReactiveEffect(fun);
    /* 初始化执行一次 */
    effect();//实际上是运行run
}
function createReactiveEffect(fun) {
    /* 创建响应式effect */
    let effect = function () {
        return run(effect, fun);
    }
    return effect;
}
function run(effect, fun) {
    /* 防止报错导致栈内元素无法弹出 */
    try {
        effectStack.push(effect);
        fun();
    } finally {
        effectStack.pop();
    }
}
/* 
targetsMap --- WeakMap(target,depsMap)
depsMap ------ Map(key,deps)
deps --------- Set[effect1,effect2,effect3...]
*/
/* 目标Map */
let targetsMap = new WeakMap();
/* ----追踪器---- */
function track(target, key) {
    /* 获取触发track的事件 */
    let effect = effectStack[effectStack.length - 1];
    if (effect) {
        /* 获取以target作为标识的depsMap */
        let depsMap = targetsMap.get(target);
        if (!depsMap) {
            /* 如果不存在就创建一个新Map */
            targetsMap.set(target, depsMap = new Map());
        }
        /* 获取以key为标识的deps */
        let deps = depsMap.get(key);
        if (!deps) {
            depsMap.set(key, deps = new Set());
        }
        /* 向deps中加入事件 */
        if (!deps.has(effect)) {
            deps.add(effect);
        }
    }
}
/* ----触发器---- */
function trigger(target, key) {
    /* 获取depsMap */
    let depsMap = targetsMap.get(target);
    if (depsMap) {
        /* 获取deps */
        let deps = depsMap.get(key);
        /* 执行deps数组中所有的事件 */
        deps.forEach(effect => {
            effect();
        });
    }
}








let person = reactive({
    name: 'zhangsan'
});
effect(() => {
    console.log(person.name);
})
person.name = "lisi";
person.name = "lisi"
// delete person.name