每个阶段的含义：
```
1.timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调
2.I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
3.idle, prepare 阶段：仅 node 内部使用
4.poll 阶段：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里
5.check 阶段：执行 setImmediate() 的回调
6.close callbacks 阶段：执行 socket 的 close 事件回调

外部输入数据–>轮询阶段(poll)–>检查阶段(check)–>关闭事件回调阶段(close callback)–>定时器检测阶段(timer)–>I/O 事件回调阶段(I/O callbacks)–>闲置阶段(idle, prepare)–>轮询阶段
```

## 执行顺序
当个v8引擎将js代码解析后传入libuv引擎后，循环首先进入poll阶段，poll阶段相当于整体同步代码的解析，会生成一个执行栈，同时会把setImmediate的回调放入check队列，在setTimeout() 和 setInterval()定时到期后把其回调事件放入timers队列，
poll queue清空后，会转到check阶段，检查执行check队列，检查执行timer队列，之后进入到callbacks阶段，执行回调。check和timer两者的顺序是不固定的，受到代码运行的环境的影响。

总结：
poll轮询属于io观察者，process.nextTick()属于idle观察者, setImmediate()属于check观察者。

在每一轮循环检查中,idle观察者先于I/O观察者,I/O观察者先于check观察者.

第一次进入代码时，idle观察者不存在。

## Node中的process.nextTick()
process.nextTick()是node中一个特殊的队列，这些事件会在每一个阶段执行完毕准备进入下一个阶段时优先执行。也就是说process.nextTick()在阶段切换时执行。并且，不管其有多深的回调，都会被一次执行完毕。

## Promise
上面的阶段没有包括Promise，在node中，promise和浏览器中类似，执行在process.nextTick()之后，在setTimeout之前

## 形象化理解
固执的探险家(每个房间都要走到底)

所有的代码就像是已经设定好的迷宫，而引擎就是去探险的人，我们称为小呆。

小呆到达迷宫，已经有了地图，根据地图冒险。

迷宫有六个房间，分别是timer, i/ocallback, ide prepare(内部使用，已封闭), poll, check， close callback，

其中timer是虚拟现实房间，小呆随时可以看到里面的场景。

其他的每个房间又五个房间，有的开放，有的不开放。

探险规则：每次离开一个房间，都要检查有没有受伤（peocess.nextTick()）

小呆首先进入poll房间，开始探险（执行poll 队列），之后进入check房间，timer房间（随机），探险完之后出来，进入close callback，探险完之后，进入io/callback房间，最后完成探险，离开。

小呆说任务总算完成了。