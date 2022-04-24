### promise 和await
await 在等什么？
一句话概括： await等的是右侧「表达式」的结果
```
右侧如果是函数，那么函数的return值就是「表达式的结果」

右侧如果是一个 ‘hello’ 或者什么值，那表达式的结果就是 ‘hello’

3.await 等到之后，做了一件什么事情？
等到之后，对于await来说，分2个情况

1.不是promise对象
	如果不是 promise , await会阻塞后面的代码，先执行async外面的同步代码，同步代码执行完，再回到async内部，把这个非promise的东西，作为 await表达式的结果
2.是promise对象
	如果它等到的是一个 promise 对象，await 也会暂停async后面的代码，先执行async外面的同步代码，等着 Promise 对象 fulfilled，然后把 resolve 的参数作为 await 表达式的运算结果。
```
###### promise链式调用：因为then()方法内部返回了一个Promise实例，而返回的这个Promise实例在继续调用了第二个then()方法。并且第二个then的resolve回调的参数，是上一个then的resolve回调函数的返回值。
```js
new Promise((resolve, reject) => {
    resolve(123)
}).then((res) => {
    console.log(res)
    return 456
}).then((res) => {
    console.log(res)
    return 789
}).then((res) => {
    console.log(res)
})
/*
123
456
789
*/
```
###### promise和async
```js
//把reject状态的回调函数放到catch里
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
	   // let res=Math.random()+1
	   let res=Math.random()
	   if(res<1.5){
	       resolve('<0.5')
	   }else{
	       reject('>0.5')
	   }
      	resolve(res)
    }, 1000);
})
promise.then((res) => {
  console.log('resolve:成功回调函数',res)  
}).catch(() => {
    console.log('reject:失败回调函数')
})

//使用async
function test(val){
	return new Promise((resolve,reject)=>{
    setTimeout(() => {
	   let res=Math.random()+1
	   if(res<1.5){
	       resolve('<0.5')
	   }else{
	       reject('>0.5')
	   }
      	resolve(res)
    }, 1000);
 })
}
//promise all
Promise.all([test(1),test(2)]).then((x)=>{console.log(x)},(y)=>{console.log(y)})

async function test2(){
	try{
		let n = await test(1)
		console.log(n)
	    }catch(error){
        console.log("error:",error)
    }
}
test2()


//await是直接获取多个promise的结果的，因为Promise.all()返回的也是一个promise所以如果要使用await拿到多个promise的值，可以直接await Promise.all()
function test(val){
	return new Promise((resolve,reject)=>{
    setTimeout(() => {
	   let res=Math.random()+1
	   if(res<1.5){
	       resolve('<0.5')
	   }else{
	       reject('>0.5')
	   }
      	resolve(res)
    }, 1000);
 })
}
async function test2(){
    try{
        let n = await Promise.all([test(1),test(2)])
        console.log(n)
    }catch(error){
        console.log(error)
    }
}
test2()
```
promise基本规则：
```language
1. 首先Promise构造函数会立即执行，而Promise.then()内部的代码在当次事件循环的结尾立即执行(微任务)。
2. promise的状态一旦由等待pending变为成功fulfilled或者失败rejected(等待（pending）、已完成（fulfilled）、已拒绝（rejected）)。那么当前promise被标记为完成，后面则不会再次改变该状态。
3. resolve函数和reject函数都将当前Promise状态改为完成，并将异步结果，或者错误结果当做参数返回。
```
第一题：
```js
const promise = new Promise((resolve, reject) => {
    console.log(1);
    resolve();
    console.log(2);
    reject('error');
})
promise.then(() => {
    console.log(3);
}).catch(e => console.log(e))
console.log(4);
/*
1
2
4
3
规则一，promise构造函数的代码会立即执行，then或者reject里面的代码会放入异步微任务队列，在宏任务结束后会立即执行。规则二：promise的状态一旦变更为成功或者失败，则不会再次改变，所以执行结果为：1,2,4,3。
*/
```
题目2：
```js
const promise = new Promise((resolve, reject) => {
    console.log(1);
    resolve();
    console.log(2);
    reject('error');
})
promise.then(() => {
    console.log(3);
}).catch(e => console.log(e))
console.log(4);
/*
规则一，promise构造函数的代码会立即执行，then或者reject里面的代码会放入异步微任务队列，在宏任务结束后会立即执行。规则二：promise的状态一旦变更为成功或者失败，则不会再次改变，所以执行结果为：1,2,4,3。而catch里面的函数不会再执行。
*/
```
题目3：
```js
const p1 = () => (new Promise((resolve, reject) => {
	console.log(1);
	let p2 = new Promise((resolve, reject) => {
		console.log(2);
		const timeOut1 = setTimeout(() => {
			console.log(3);
			resolve(4);
		}, 0)
		resolve(5);
	});
	resolve(6);
	p2.then((arg) => {
		console.log(arg);
	});

}));
const timeOut2 = setTimeout(() => {
	console.log(8);
	const p3 = new Promise(reject => {
		reject(9);
	}).then(res => {
		console.log(res)
	})
}, 0)


p1().then((arg) => {
	console.log(arg);
});
console.log(10);
/*
回到题目，结果为：'1,2,10,5,6,8,9,3'。你答对了吗？如果对了，那你基本理解了事件队列，微任务，宏任务了。

第一步：执行宏任务，结合规则一，输出：1,2,10。这时候事件循环里面有异步任务timeOut1,timeOut2,p2.then,p1.then。

第二步：宏任务执行完后Event Loop会去任务队列取异步任务，微任务会优先执行，这时候会先后执行p2.then,p1.then，打印5,6。

第三步：微任务执行完了，开始宏任务，由于2个settimeout等待时间一样，所以会执行先进入异步队列的timeOut2,先后打印：8。执行宏任务的过程中，p3.then微任务进入了队列，宏任务执行完毕会执行微任务，输出：9。之后执行timeOut1,输出：3。

第四步：结合规则6，由于p2这个Promise对象的执行结果已经确定，所以4不会被打印
*/
```

题目4：
```js
Promise.resolve(1)
  .then((res) => {
    console.log(res)
    return 2
  })
  .catch((err) => {
    return 3
  })
  .then((res) => {
    console.log(res)
  })
/*
1
2
解释：promise 可以链式调用。提起链式调用我们通常会想到通过 return this 实现，不过 Promise 并不是这样实现的。
promise 每次调用 .then 或者 .catch 都会返回一个新的 promise，从而实现了链式调用。
*/
```


### async
这道题的坑就在于 async 中如果没有 await，那么它就是一个纯同步函数。
```js
async function async1() {
  console.log("AAAA");
  async2(); 
  console.log("BBBB");
}
async function async2() {
  console.log("CCCC");
}

console.log("DDDD");
setTimeout(function () {
  console.log("FFFF");
}, 0);
async1();
new Promise(function (resolve) {
  console.log("GGGG");
  resolve();
}).then(function () {
  console.log("HHHH");
});
console.log("IIII");
/*
DDDD

AAA

CCC
BBB

GGGG
IIII
HHHH
这道题的起始代码在第 9 行，输出DDDD
第 10 行计时器开启一个异步任务 t1（一个称呼），这个任务且为宏任务。
第 13 行函数async1执行，这个函数内没有 await 所以它其实就是一个纯同步函数，打印输出AAAA,
在async1中执行async2函数，因为async2的内部也没有 await，所以它也是个纯同步函数，打印输出CCCC
紧接着打印输出BBBB。
第 14 行 new Promise 执行里面的代码也是同步的,所以打印输出GGGG,resolve()调用的时候开启一个异步任务 t2（一个称呼），且这个任务 t2 是微任务，它的执行交给 then()中的第一个回调函数执行，且优先级高于宏任务（t1）执行。
第 20 行打印输出IIII,此时线程上的同步任务全部执行结束。
在执行任务队列中的异步任务时，微任务优先于宏任务执行，所以先执行微任务 t2 打印输出 HHHH,然后执行宏任务 t1 打印输出 FFFF
所以综上 结果输出是 DDDD AAAA CCCC BBBB GGGG IIII HHHH FFFF
*/
```
题目2：
```js
async function t1() {
  let a = await "lagou";
  console.log(a);
}
t1();
console.log('a')
/*
a
lagou

先打印A 后执行微任务里的 let a = await “lagou”;
console.log(a);
原理其实就是Generator
*/
```
题目3：
```js
async function t2 () {
  let a = await new Promise((resolve) => {});
  console.log(a); //
}
t2();
/*
await后面如果跟一个 promise 对象，await 将等待这个 promise 对象的 resolve 状态的值 value，且将这个值返回给前面的变量，

此时的 promise 对象的状态是一个 pending 状态，没有 resolve 状态值，所以什么也打印不了。
*/
async function t2 () {
  let a = await new Promise((resolve) => {
  	resolve(2)
  });
  console.log(a); //
}
t2();
//log:2
```
题目3：
```js
async function t5() {
  let a = await new Promise((resolve) => {
    resolve("hello");
  }).then(() => {
    return "lala";
  });
  console.log(a); //lala
}
t5();
/*
await后面如果跟一个promise 对象，await 将等待这个 promise 对象的 resolve 状态的值，且将这个值返回给前面的变量，此时的 promise 对象的状态是一个 resolve 状态，它的状态值是 hello，紧接着后面又执行了一个 then 方法，then 方法又会返回一个全新的 promise 对象，且这个 then 方法中的返回值会作为这个全新的 promise 中 resolve 的值，所以最终的结果是 lala。
*/
```

### promise源码
```
1.promise有三种状态：pending，fulfilled，rejected。pending代表等待的状态，在此状态下，可能执行resolve（）的方法，也可能执行reject（）方法，fulfilld代表成功态，此状态下执行resolve（）方法，rejected代表失败态，此状态下执行reject（）方法，一旦成功了就不能失败，反过来也是一样
2.每个promsie都有一个then方法
3.如果new promise 报错了会走失败态（throw new Error（'报错'）也会走失败态）
```