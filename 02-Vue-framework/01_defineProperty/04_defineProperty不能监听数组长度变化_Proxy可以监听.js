let obj = {
    name:'js',
    age:1,
    level:[1,2,3,4,5,6]
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
            console.log('test1:读取', key, '成功')
            return val
        },
        set(newVal) {
            // 赋值监听方法
            if (newVal === val) return
            // observer(newVal)
            console.log('test1:监听赋值成功',key,'key:',newVal)
            val = newVal
            // 可以执行渲染操作
        }
    })
}

function observer(obj) {
    if (typeof obj !== 'object' || obj == null) {
        return
    }

    for (const key in obj) {
        // 给对象中的每一个方法都设置响应式
        defineProperty(obj, key, obj[key])
    }
}

observer(obj)
// 这里push 并不能实现监听
obj.level.push(10)
obj.level[0]=100
obj.name = 'java'

const arr = [1,2,3,4]
console.log('test:',Object.getOwnPropertyDescriptors(arr))
/*
可见：configurable: false,所以造成了pop,push这种会修改原数组长度的值都无法被监听到
test: {
  '0': { value: 1, writable: true, enumerable: true, configurable: true },
  '1': { value: 2, writable: true, enumerable: true, configurable: true },
  '2': { value: 3, writable: true, enumerable: true, configurable: true },
  '3': { value: 4, writable: true, enumerable: true, configurable: true },
  length: { value: 4, writable: true, enumerable: false, configurable: false }
}
* */

/*
* 使用Proxy
* */

let handler={
    set(target,key,value){
        // 如果是数组，忽略更新length
        if(key==='length')return true
        console.log('监听赋值成功',key,'key:',value)
        return Reflect.set(target,key,value)
    },
    get(target,key){
        if(typeof target[key]==='object'){
            return new Proxy(target[key],handler)
        }
        console.log('读取', key, '成功',target[key])
        return Reflect.get(target,key)
    }
}
console.log('分割线-----》')
const list2 = [1,2,3,4]
const proxyFn2 = new Proxy(list2,handler)
proxyFn2.push(1)
list2[0]=100
