## 1.实现Promise基本的方法

- Promise是一个类，需要传递一个executor函数，函数里有两个参数resolve和reject，调用resolve代表成功，调用reject代表失败
- Promise有三种状态：默认状态是等待状态pending，成功resolved，失败rejected

> 使用例子

```
let Promise = require('./Promise');
// Promise是一个类,需要传递一个executor函数,这个函数我们称之为执行函数,函数中有两个参数resolve和reject他们也是函数，调用resolve表示成功，调用reject表示失败
let promise = new Promise(function(resolve,reject){
    // 成功就不会再调用失败,默认状态是等待状态pending
    resolve('ok'); 
    reject('faild');
});
// then是原型上的一个方法接收两个参数分别是成功的回调和失败的回调
promise.then(function(data){// 调用resolve后会执行成功的回调，调用reject后会执行失败的回调
    console.log(data);
},function(err){
    console.log(err);
});
```

> 实现对应的Promise库代码

```
function Promise(executor) {  // Promise中需要接收一个执行函数executor
    let self = this;
    self.status = 'pending'; //默认是pending状态
    self.value = undefined; // 成功的原因
    self.reason = undefined; // 失败的原因
    function resolve(value) { // 调用resolve 会传入为什么成功
        if(self.status === 'pending'){ // 只有再pending才能转换成功态
            self.value = value; // 将成功的原因保存下来
            self.status = 'resolved'; // 状态改成成功态 
        }
    }
    function reject(reason) { // 调用reject会传入为什么失败
        if(self.status === 'pending'){
            self.reason = reason;
            self.status = 'rejected';
        }
    }
    try {
        executor(resolve, reject);// executor中需要传入resolve和reject
    } catch (e) {
        // 如果executor执行发生异常，表示当前的promise是失败态
        reject(e);
    }
}
// then中要传入成功的回调和失败的回调
Promise.prototype.then = function(onFufilled,onRejected){
    let self = this;
    // 如果要是成功就调用成功的回调,并将成功的值传入
    if(self.status === 'resolved'){
        onFufilled(self.value);
    }
    if(self.status === 'rejected'){
        onRejected(self.reason);
    }
}
module.exports = Promise
```

## 2.异步Promise

在new Promise时内部可以写异步代码，并且产生的实例可以then多次

- 用两个数组存放成功和失败的回调，当调用的时候再执行

> 使用例子

```
let Promise = require('./Promise');
let promise = new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve('ok');
    },1000)
});
// 当调用then时可能状态依然是pending状态,我们需要将then中的回调函数保留起来,当调用resolve或者reject时按照顺序执行
promise.then(function(data){
    console.log(data);
},function(err){
    console.log(err);
});
promise.then(function(data){
    console.log(data);
},function(err){
    console.log(err);
});
```

> 实现对应的Promise库代码

```
function Promise(executor) {  
     self.status = 'pending'; 
     self.value = undefined; 
     self.reason = undefined; 
+    self.onResolvedCallbacks = []; // 成功回调存放的地方
+    self.onRejectedCallbacks = [];// 失败回调存放的地方
     function resolve(value) { 
         if(self.status === 'pending'){ 
             self.value = value; 
             self.status = 'resolved'; 
+            // 依次执行成功的回调
+            self.onResolvedCallbacks.forEach(item=>item());
         }
     }
     function reject(reason) {
         if(self.status === 'pending'){
             self.reason = reason;
             self.status = 'rejected';
+            // 依次执行失败的回调
+            self.onRejectedCallbacks.forEach(item=>item());
         }
     }
}
Promise.prototype.then = function(onFufilled,onRejected){
     if(self.status === 'rejected'){
         onRejected(self.reason);
     }
+    if(self.status === 'pending'){
+        // 如果是等待态,就将成功和失败的回调放到数组中
+        self.onResolvedCallbacks.push(function(){
+            onFufilled(self.value);
+        });
+        self.onRejectedCallbacks.push(function(){
+            onRejected(self.reason);
+        });
+    }
 }
```

## 3.Promise链式调用

- 如果当前promise已经进入成功的回调，回调中发生了异常返回this的话，那么当前的promise的状态无法更改到失败台！所以promise实现链式调用,返回的并不是this而是一个新的promise。
- 执行回调中
  - 如果返回的是一个普通的值，会将结果传入下一次then的成功回调中
  - 如果发生错误会被下一次then的失败回调捕获
  - 如果返回的是promise看这个promise是成功还是失败,对应调用下一次的then

所以写一个resolvePromise方法，这是promise中最重要的方法,用来解析then返回的结果

- 有些人可能成功失败同时调用，如果两个都调用，用第一个调用的，不允许同时调用。

> 使用例子

```
promise.then(function(data){
    throw Error('出错了');// 当前promise已经成功了，成功就不会再失败
    return 'renee' 
}).then(null,function(err){ // 如果返回的是同一个promise那么还怎么走向失败呢?所以必须要返回一个新的promise
    console.log(err);
})
```

> 实现对应的Promise库代码

```
 Promise.prototype.then = function(onFufilled,onRejected){
     let self = this;
+    let promise2; // promise2为then调用后返回的新promise
     // 如果要是成功就调用成功的回调,并将成功的值传入
     if(self.status === 'resolved'){
-        onFufilled(self.value);
+        promise2 = new Promise(function(resolve,reject){
+            try{
+                // 执行时有异常发生,需要将promise2的状态置为失败态
+                let x = onFufilled(self.value); 
+                // x为返回的结果
+                // 写一个方法resolvePromise，是对当前返回值进行解析,通过解析让promise2的状态转化成成功态还是失败态
+                resolvePromise(promise2,x,resolve,reject);
+            }catch(e){
+                reject(e);
+            }
+        })
     }
     if(self.status === 'rejected'){
-        onRejected(self.reason);
+        promise2 = new Promise(function(resolve,reject){
+            try{
+                let x = onRejected(self.reason);
+                resolvePromise(promise2,x,resolve,reject);
+            }catch(e){
+                reject(e)
+            }
+        })
     }
     if(self.status === 'pending'){
+       promise2 = new Promise(function(resolve,reject){
         self.onResolvedCallbacks.push(function(){
-            onFufilled(self.value);
+                try{
+                    let x = onFufilled(self.value);
+                    resolvePromise(promise2,x,resolve,reject)
+                }catch(e){
+                    reject(e);
+                }
+            })
         });
         self.onRejectedCallbacks.push(function(){
-            onRejected(self.reason);
+                try{
+                    let x = onRejected(self.reason);
+                    resolvePromise(promise2,x,resolve,reject)
+                }catch(e){
+                    reject(e);
+                }
         });
+       })
     }
+    return promise2;
 }
function resolvePromise(promise2, x, resolve, reject) {
    //x是返回的结果，如果promise和then中返回的promise是同一个，是不科学的，要报错
    if(promise2===x){
        return reject(new Error('循环引用'))
    }
    if(x!==null&&(typeof x === 'object'|| typeof x === 'function')){
        let called; //表示是否调用过成功或者失败
        try{
            let then=x.then;
            //如果then是函数，说明是promise，我们要让promise执行
            if(typeof then==='function'){
                then.call(x,function(y){
                    if(called)return; //如果调用过直接return
                    called=true;
                    //如果resolve的结果依旧是promise那就继续解析
                },function(err){
                    if(called) return;
                    called=true;
                    reject(err)
                })
            }else{//如果不是函数，x是一个普通的对象，直接成功即可
                resolve(x)
            }
        }catch(e){
            if(called) return;
            called=true;
            reject(e);
        }
    }else{
        //是普通值直接调用成功
        resolve(x);
    }
}
```

## 4.值的穿透

- 在规范中定义then函数可以不传参,不传参默认会将成功的结果和失败的结果继续向下传递

> 使用例子

```
promise.then().then().then(function(data){
  console.log(data)
})
```

> 实现对应的Promise库代码

```
Promise.prototype.then = function (onFufilled, onRejected) {
  //失败和成功默认不传给一个函数
+    onFufilled = typeof onFufilled === 'function'?onFufilled:function(value){
+        return value
+    }
+    onRejected = typeof onRejected === 'function'?onRejected:function(err){
+        throw err
+    }
```