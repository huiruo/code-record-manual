


```
文档：
https://blog.csdn.net/leelxp/article/details/108055446?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0.control&spm=1001.2101.3001.4242

React中workingProgress Fiber树存在的意义是什么
在React中最多会同时存在两棵Fiber树，当前显示在页面是current Fiber树，在内存中构建的Fiber树称为workInProgress Fiber树，workingProgress Fiber这棵树是在内存中构建的，构建完成才统一替换，这样不会产生不完全的真实dom。一旦更新完成，react会直接将current树替换成workingProgress Fiber树，以便快速完成DOM的更新。也是react提升性能的一部分


1. React 中使用双缓存的机制，来完成 Firber树的构建与替换，实现 Dom 对象的快速更新。
2. React 中会同时存在两个 Fiber 对象，当前在屏幕中显示的树是 CurrentFiber 树，当发生更新时，React会重新创建一颗新的Firber树是 WorkInProgress Firber树。
在双缓存技术中，workInProgress Fiber 树就是即将显示在页面中的 Fiber树，当这个Fiber 树构建完成后，React 会将它直接与 Current Firber 树进行替换，进而达到 快速更新 Dom 的操作，
因为 workInProgress Fiber 在更新的过程中，是在内存中构建的，所有速度是非常快的，得到最终更新后的 Firber，直接替换 Current Firber。
3. current Firber 树有一个 alternate 属性指向 workInProgress Firber 树，workInProgress Firber 树内也 有一个alternate 属性指向current Firber 树
```

### Fiber Tree 和 WorkInProgress Tree
```
React 在 render 第一次渲染时，会通过 React.createElement 创建一颗 Element 树，可以称之为 Virtual DOM Tree，由于要记录上下文信息，加入了 Fiber，每一个 Element 会对应一个 Fiber Node，将 Fiber Node 链接起来的结构成为 Fiber Tree。它反映了用于渲染 UI 的应用程序的状态。这棵树通常被称为 current 树（当前树，记录当前页面的状态）。

在后续的更新过程中（setState），每次重新渲染都会重新创建 Element, 但是 Fiber 不会，Fiber 只会使用对应的 Element 中的数据来更新自己必要的属性，


Fiber Tree 一个重要的特点是链表结构，将递归遍历编程循环遍历，然后配合 requestIdleCallback API, 实现任务拆分、中断与恢复。

这个链接的结构是怎么构成的呢，这就要主要到之前 Fiber Node 的节点的这几个字段：
```

```
// 单链表树结构
{
   return: Fiber | null, // 指向父节点
   child: Fiber | null,// 指向自己的第一个子节点
   sibling: Fiber | null,// 指向自己的兄弟结构，兄弟节点的return指向同一个父节点
}
```


###### https://www.kancloud.cn/freya001/interview/1480740
fiber的作用
```
进程是操作系统分配资源的最小单元，线程是操作系统调度的最小单元，在计算机科学中还有一个概念叫做Fiber，英文含义就是“纤维”，意指比Thread更细的线，也就是比线程(Thread)控制得更精密的并发处理机制。
上面说的Fiber和React Fiber不是相同的概念，但是，React团队把这个功能命名为Fiber，含义也是更加紧密的处理机制，比Thread更细。

React 官方核心算法名称是Reconciliation， 中文翻译是“协调”！React diff 算法的实现就与之相关。
先简单回顾下React Diff: React首创了“虚拟DOM”概念， “虚拟DOM”能火并流行起来主要原因在于该概念对前端性能优化的突破性创新；
稍微了解浏览器加载页面原理的前端同学都知道网页性能问题大都出现在DOM节点频繁操作上；
而React通过“虚拟DOM” + React Diff算法保证了前端性能；

React Diff算法
将Virtual DOM树转换成actual DOM树的最少操作的过程 称为 协调（Reconciliaton）。
React Diff三大策略：
1.tree diff;
2.component diff;
3.element diff;
PS: 之前H5开发遇到的State 中变量更新但视图未更新的Bug就是element diff检测导致。解决方案：1.两种业务场景下的DOM节点尽量避免雷同； 2.两种业务场景下的DOM节点样式避免雷同；

在V16版本之前协调机制是Stack reconciler， V16版本发布Fiber 架构后是Fiber reconciler。

我们都知道浏览器渲染引擎是单线程的，在 React15.x 及之前版本，从 setState 开始到渲染完成整个过程是不受控制且连续不中断完成的，由于该过程将会占用整个线程，则其他任务都会被阻塞，如样式计算、界面布局以及许多情况下的绘制等。如果需要渲染的是一个很大、层级很深的组件，这可能就会使用户感觉明显卡顿，比如更新一个组件需要1毫秒，如果有200个组件要更新，那就需要200毫秒，在这200毫秒的更新过程中，浏览器唯一的主线程在专心运行更新操作，无暇去做其他任何事情。想象一下，在这200毫秒内，用户往一个input元素中输入点什么，敲击键盘也不会立即获得响应，虽然渲染输入按键结果是浏览器主线程的工作，但是浏览器主线程被React占用，抽不出空，最后的结果就是用户敲了按键看不到反应，等React更新过程结束之后，咔咔咔那些按键一下子出现在input元素里了，这个版本的调和器可以称为栈调和器（Stack Reconciler）。Stack Reconcilier 的主要缺陷就是不能暂停渲染任务，也不能切分任务，更无法有效平衡组件更新渲染与动画相关任务间的执行顺序（即不能划分任务优先级），这样就很有可能导致重要任务卡顿，动画掉帧等问题。

为了解决这个问题，React 团队经过两年多的努力，提出了一个更先进的调和器，它允许渲染过程分段完成，而不必一次性完成，在渲染期间可返回到主线程控制执行其他任务。这是通过计算部分组件树的变更，并暂停渲染更新，询问主线程是否有更高需求的绘制或者更新任务需要执行，这些高需求的任务完成后再重新渲染。这一切的实现是在代码层引入了一个新的数据结构：Fiber对象，每一个组件实例对应有一个fiber实例，此fiber实例负责管理组件实例的更新，渲染任务及与其他fiber实例的通信，这个先进的调和器叫做纤维调和器（Fiber Reconciler）**，它提供的新功能主要有：
**一：**把可中断的任务拆分成小任务；
**二：**可重用各分阶段任务，对正在做的工作调整优先次序；
**三：**可以在父子组件任务间前进后退切换任务，以支持React执行过程中的布局刷新；
**四：**支持 render 方法返回多个元素；
**五：**对异常边界处理提供了更好的支持；
```