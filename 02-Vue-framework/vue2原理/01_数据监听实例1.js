
/*
1. 我们知道可以利用Object.defineProperty()来监听属性变动
2. 那么将需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter和getter
3. 这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化。
* */
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
    const dep = new Dep();
    observe(val); // 监听子属性
    Object.defineProperty(data, key, {
        enumerable: true, // 可枚举
        configurable: false, // 不能再define
        get: function() {
            return val;
        },
        set: function(newVal) {
            observer(newVal);
            console.log('监听到值变化了 ', val, 'newVal:', newVal);
            if (value === newVal) return;
            val = newVal;
            // 数据变化触发notify调用订阅者的update方法
            // 通知所有订阅者
            dep.notify();
        }
    });
}

// 这样我们已经可以监听每个数据的变化了，那么监听到变化之后就是怎么通知订阅者了，所以接下来我们需要实现一个消息订阅器
// 很简单维护一个数组，用来收集订阅者，数据变动触发notify，再调用订阅者的update方法
function Dep() {
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        console.log('订阅者------>')
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};


// test
const data = {name: 'test1'};
observe(data);
data.name = 'test2';