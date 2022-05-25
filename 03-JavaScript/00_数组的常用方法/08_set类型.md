
## 特点是不能存放相同的元素
1.成员唯一、无序且不重复。
2.[value, value]，键值与键名是一致的（或者说只有键值，没有键名）。
3.可以遍历，方法有：add、delete、has。

## WeakSet：
```
1.成员都是对象。
2.成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏。
3.不能遍历，方法有add、delete、has。
```

## set方法
```
set 有add添加，delete删除，clear清楚所有，size长度

// 将set转换为数组对象
set=Array.from(set)
```