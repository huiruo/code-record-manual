## fiber单元执行顺序
儿子 ===》兄弟 ===》叔叔
```javaScript
let nextUnitOfWork = null;//下一个执行单元
let startTime = Date.now();

function workLoop(deadline) {
    //while (nextUnitOfWork) {//如果有待执行的执行单元，就执行，然后会返回下一个执行单元
    while ((deadline.timeRemaining() > 1 || deadline.didTimeout) && nextUnitOfWork) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (!nextUnitOfWork) {
        console.log('render阶段结束了');
        
    } else {//请求下次浏览器空闲的时候帮我调
        requestIdleCallback(workLoop, { timeout: 1000 });
    }
}

function performUnitOfWork(fiber) {
    beginWork(fiber);//处理此fiber
    if (fiber.child) {//如果有儿子，返回大儿子
        return fiber.child;
    }//如果没有儿子，说明此fiber已经完成了
    while (fiber) {
        completeUnitOfWork(fiber);
        if (fiber.sibling) {
            return fiber.sibling;//如果说有弟弟返回弟弟
        }
        fiber = fiber.return;// 如果没有弟弟当前的fiber指向自己的父亲，父亲也完成了，继续循环返回父亲的弟弟
    }
}

function completeUnitOfWork(fiber) {
    console.log('结束', fiber.key);// C1 C2 B1 B2 A1
}

function beginWork(fiber) {
    sleep(20);
    console.log('开始', fiber.key);//A1 B1 C1 C2  B2
}

nextUnitOfWork = A1;

requestIdleCallback(workLoop, { timeout: 1000 });
```