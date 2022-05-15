
/*
* 基础1：需要注意的是:value,writable 和get,set不能同时进行配置
* */
let obj = {}
Object.defineProperty(obj, 'name', {
    configurable: true, // 可删除
    enumerable: true,	//可枚举
    writable: true,	//可修改
    value: 'test1'
})
console.log('test1',obj.name)

/*
* 基础2： 同理：上面的例子还可以写成
* */
let obj2 = {}
let name = 'test2'
Object.defineProperty(obj2, 'name', {
    configurable: true, // 可删除
    enumerable: true,	//可枚举
    get() {
        return name
    },
    set(newVal) {
        name = newVal
    }
})
console.log('test2',obj2.name) // 码不停息

/*
* 现在要解决以下几个问题:
*
* obj对象有多个属性,可能需要__循环__添加到Object.defineProperty里面
* obj的属性也可能是对象或者数组,可能需要__递归__
* 用户可能给obj赋值新的属性,这种情况可能需要 单独处理
*
* 总结：
* 用Object.defineProperty实现数据响应式时我们必须要遍历所有的数据,还需要重写数组的方法,性能消耗也比较大,我们知道Vue2.x就是基于
* Object.defineProperty实现数据响应式的但新版本的Vue3放弃了Object.defineProperty采用Proxy重写了响应式系统
* */

// 数组的监听 start
// 数组的监听 start
// 那我们怎么来实现对数组的监听呢?答案就是重写Array的原型方法
// 原理就是重写数组的七个原始方法,当使用者执行这些方法时,我们就可以监听到数据的变化,然后做些跟新操作,下面我们在observer中加上关于对数组的判断
const orginalProto = Array.prototype;
const arrayProto = Object.create(orginalProto); // 先克隆一份Array的原型出来
const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
methodsToPatch.forEach(method => {
    arrayProto[method] = function () {
        // 执行原始操作
        orginalProto[method].apply(this, arguments)
        console.log('监听赋值成功', method)
    }
})
// 数组的监听 end
// 数组的监听 end

function observer(obj) {
    if (typeof obj !== 'object' || obj == null) {
        return
    }
    if (Array.isArray(obj)) {
        // /*
        // 如果是数组, 重写原型
        obj.__proto__ = arrayProto
        // 传入的数据可能是多维度的,也需要执行响应式
        for (let i = 0; i < obj.length; i++) {
            observer(obj[i])
        }
        // */
    } else {
        for (const key in obj) {
            // 给对象中的每一个方法都设置响应式
            defineProperty(obj, key, obj[key])
        }
    }
}

function defineProperty(obj, key, val){
    // obj的属性也可能是对象或者数组,这里递归实现非常简单,只需要把`observer`函数在`defineProperty` 重新调用一遍即可,
    // 在此判断传过来的`val`是不是一个对象,如果是一个对象在遍历下这个对象进行响应式收集
    observer(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            // 读取方法
            console.log('读取', key, '成功')
            return val
        },
        set(newVal) {
            // 赋值监听方法
            if (newVal === val) return
            // observer(newVal)
            console.log('监听赋值成功', newVal)
            val = newVal
            // 可以执行渲染操作
        }
    })
}

let obj3 = {
    name:'js',
    age:1,
    item:{
     name:'golang'
    },
    level:[1,2,3,4,5,6]
}

observer(obj3)
obj3.name = 'java'
obj3.item.name = 'test'
console.log('数组监听测试o----->')
obj3.level.push(10)
/*
*
数组监听测试o----->
读取 level 成功
监听赋值成功 push
* */
