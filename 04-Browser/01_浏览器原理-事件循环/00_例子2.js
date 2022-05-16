
// 因为Promise定义之后便会立即执行，其后的.then()是异步里面的微任务。
setTimeout(() => { console.log('我是宏任务') }, 0);

let promise = new Promise(resolve => { resolve(); console.log('新建promise') });

promise.then(value => { console.log('我是微任务') });

console.log('主流程');
/*
新建promise
主流程
我是微任务
我是宏任务
*/