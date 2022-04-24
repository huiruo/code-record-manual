
```
1.开篇

3.Fiber 89

4.从legacy或concurrent开始 89
https://1304091558.vod2.myqcloud.com/8f14ee4evodtranscq1304091558/1b01384f5285890813093863336/video_10_3.m3u8?sign=a988c10a013ad152908283abd4aca710&t=7fffffff

5.state更新流程 89
https://1304091558.vod2.myqcloud.com/8f14ee4evodtranscq1304091558/59eda6d25285890813094259078/video_10_3.m3u8?sign=c1536355486b2f6edfa34af6ec59908c&t=7fffffff

6.6.render阶段 89
https://1304091558.vod2.myqcloud.com/8f14ee4evodtranscq1304091558/5c6460735285890813094374783/video_10_3.m3u8?sign=ab4df006ef070d46572b3be5ef7ac94c&t=7fffffff

7.commit阶段 89
https://1304091558.vod2.myqcloud.com/8f14ee4evodtranscq1304091558/681042cf5285890813094878122/video_10_3.m3u8?sign=a1803bf5cebf58b8321637c376712711&t=7fffffff

8.diff算法 89
https://1304091558.vod2.myqcloud.com/8f14ee4evodtranscq1304091558/a229fad35285890813095046966/video_10_3.m3u8?sign=34c283006965387ba996a9b36288a62c&t=7fffffff

9.hooks源码 89 
https://1304091558.vod2.myqcloud.com/8f14ee4evodtranscq1304091558/ab5ad28c5285890813095427074/video_10_3.m3u8?sign=b9250099c8d3a0e651caccb4c8fcee5b&t=7fffffff

10.scheduler&lane模型 89
https://1304091558.vod2.myqcloud.com/8f14ee4evodtranscq1304091558/ae2f3f325285890813095598323/video_10_3.m3u8?sign=e629c0cceeaa02171a0aac670331765c&t=7fffffff

11.concurrent mode
https://1304091558.vod2.myqcloud.com/8f14ee4evodtranscq1304091558/eedcd4c85285890813096008362/video_10_3.m3u8?sign=b6ac2c8fc26a594bdb9e28f54d0ff765&t=7fffffff

12.手写迷你react
https://1304091558.vod2.myqcloud.com/8f14ee4evodtranscq1304091558/c66ecb225285890817013716042/video_10_2.m3u8?sign=0c478dc023d9743b77691c24d59b43d1&t=7fffffff
```
### react架构
https://xiaochen1024.com/article_item/600ac6afecf02e002e6db56b
```js
//生成新的状态，
const state = reconcile(update);
//新的状态 commit会创建相应的ui
const UI = commit(state);
```

+ Scheduler（调度器）： 排序优先级，让优先级高的任务先进行reconcile

+ Reconciler（协调器）： 找出哪些节点发生了改变，并打上不同的Tag
```
在render阶段，作用是创建fiber节点（dom元素在内存的的对象）,fiber节点会形成fiber树，打上插入，更新，删除的副作用tag
```

+ Renderer（渲染器）： 将Reconciler中打好标签的节点渲染到视图上


在mount时，和会创建fiberRoot和rootFiber,然后根据jsx对象创建Fiber节点，节点连成current Fiber树
```
FiberRootNode 

rootFiber 可能存在多个，
```