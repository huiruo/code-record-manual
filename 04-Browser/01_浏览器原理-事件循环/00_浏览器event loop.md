### 浏览器event loop

- 首先执行同步代码，这属于宏任务
- 当执行完所有同步代码后，执行栈为空，查询是否有异步代码需要执行
- 执行所有微任务
- 当执行完所有微任务后
- 然后开始下一轮 Event Loop，执行宏任务中的异步代码，也就是 setTimeout 中的回调函数
```
微任务包括 process.nextTick ，promise ，MutationObserver 。

宏任务包括 script ， setTimeout  ，setInterval ，setImmediate ，I/O ，UI rendering 。

这里很多人会有个误区，认为微任务快于宏任务，其实是错误的。因为宏任务中包括了 script ，浏览器会先执行一个宏任务，接下来有异步代码的话才会先执行微任务。
```



然后执行微任务，最后执行宏任务，即使定时器的时间为0也是如此;
```js
1. Promise:new Promise().then 的回调
2. MutaionObserver
3. Object.observe（已废弃；Proxy 对象替代）
4. process.nextTick（Node.js）
```
以下事件属于宏任务：
```js
1. script (可以理解为外层同步代码)
2. setTimeout/setInterval
3. UI rendering/UI事件
4. postMessage，MessageChannel
5. setImmediate，I/O（Node.js）
```
### 浏览器 事件循环
js是单线程语言，浏览器只分配给js一个主线程，用来执行任务（函数），但一次只能执行一个任务，这些任务形成一个任务队列排队等候执行，但前端的某些任务是非常耗时的，比如网络请求，定时器和事件监听，如果让他们和别的任务一样，都老老实实的排队等待执行的话，执行效率会非常的低，甚至导致页面的假死。所以，浏览器为这些耗时任务开辟了另外的线程，主要包括http请求线程，浏览器定时触发器，浏览器事件触发线程，这些任务是异步的。

任务队列
刚才说到浏览器为网络请求这样的异步任务单独开了一个线程，那么问题来了，这些异步任务完成后，主线程怎么知道呢？答案就是回调函数，整个程序是事件驱动的，每个事件都会绑定相应的回调函数，举个栗子，有段代码设置了一个定时器
```js
setTimeout(function(){
    console.log(time is out);
}，1000）;
```
执行这段代码的时候，浏览器异步执行计时操作，当1000ms到了后，会触发定时事件，这个时候，就会把回调函数放到任务队列里。整个程序就是通过这样的一个个事件驱动起来的。
所以说，js是一直是单线程的，浏览器才是实现异步的那个家伙。
```
-同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。
-当指定的事情完成时，Event Table会将这个函数移入Event Queue。
-主线程内的任务执行完毕为空，会去Event Queue读取对应的函数，进入主线程执行。
-上述过程会不断重复，也就是常说的Event Loop(事件循环)。
```

```js
因为Promise定义之后便会立即执行，其后的.then()是异步里面的微任务。
setTimeout(()=>{console.log('我是宏任务')},0);

let promise = new Promise(resolve => {resolve();console.log('新建promise')});

promise.then(value =>{console.log('我是微任务')});

console.log('主流程');
/*
新建promise
主流程
我是微任务
我是宏任务
*/
```
题目2：
```js
console.log('打印'+1);

setTimeout(function(){
	console.log('打印setTimeout'+2);
}) 

new Promise(function(resolve,reject){
	console.log('打印'+3);
	resolve()
}).then(function(){
	console.log('打印then('+4)
});;

console.log('打印'+10); 

let promiseA= new Promise(function(resolve,reject){
	setTimeout(function () {
		console.log('打印setTimeout'+5);
	});
	resolve()
})

promiseA.then(()=>{
	console.log('打印then('+6)
});

setTimeout(function(){ 
	new Promise(function(resolve,reject){
		console.log('打印setTimeout'+7);
	});
})
/*
打印1
打印3
打印10
打印then(4

打印then(6
打印setTimeout2
打印setTimeout5
打印setTimeout7
*/
```

###### 经典案例
```js
for (var i=1; i<=5; i++) { 
    setTimeout( function timer() {
        console.log(i); //输出6 6 6 6 6 6
    }, i*1000 );
}
因为：根据setTimeout定义的操作在函数调用栈清空之后才会执行的特点，for循环里定义了5个setTimeout操作。而当这些操作开始执行时，for循环的i值，已经先一步变成了6。因此输出结果总为6。
```
###### 解决：
而我们知道在函数中闭包判定的准则，即执行时是否在内部定义的函数中访问了上层作用域的变量。因此我们需要包裹一层自执行函数为闭包的形成提供条件。
因此，我们只需要2个操作就可以完成题目需求，一是使用自执行函数提供闭包条件，二是传入i值并保存在闭包中。

//而我们想要让输出结果依次执行，我们就必须借助闭包的特性，每次循环时，将i值保存在一个闭包中，当setTimeout中定义的操作执行时，则访问对应闭包保存的i值即可。
```js
for (var i=1; i<=5; i++) { 
    (function(i) {
        setTimeout( function timer() {
            console.log(i);
        }, i*1000 );
    })(i)
}
```
###### 解析
```
这道题涉及了异步、作用域、闭包

 settimeout是异步执行，10ms后往任务队列里面添加一个任务，只有主线上的全部执行完，才会执行任务队列里的任务，当主线执行完成后，i是4，所以此时再去执行任务队列里的任务时，i全部是4了。对于打印4次是：

 每一次for循环的时候，settimeout都执行一次，但是里面的函数没有被执行，而是被放到了任务队列里面，等待执行，for循环了4次，就放了4次，当主线程执行完成后，才进入任务队列里面执行。

（注意：for循环从开始到结束的过程，需要维持几微秒或几毫秒。)

 当我把var 变成let 时

 for(let i=0;i<=3;i++){ setTimeout(function() {  console.log(i)  }, 10);}

 打印出的是：0,1,2,3

 当解决变量作用域，

 因为for循环头部的let不仅将i绑定到for循环快中，事实上它将其重新绑定到循环体的每一次迭代中，确保上一次迭代结束的值重新被赋值。setTimeout里面的function()属于一个新的域，通过 var 定义的变量是无法传入到这个函数执行域中的，通过使用 let 来声明块变量，这时候变量就能作用于这个块，所以 function就能使用 i 这个变量了；这个匿名函数的参数作用域 和 for参数的作用域 不一样，是利用了这一点来完成的。这个匿名函数的作用域有点类似类的属性，是可以被内层方法使用的。
```
