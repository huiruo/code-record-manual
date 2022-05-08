
首先当我们这样写时
```javascript
  const [name,setName] = useState('杜皮')
  const [address,setAddress] = useState('杭州')
```

每一个useState都会在当前组件中创建一个hook对象  ，并且这个对象中的next属性始终执行下一个useState的hook对象
这些对象以一种类似链表的形式存在 Fiber.memoizedState 中
而函数组件就是通过fiber这个数据结构来实现每次render后name address不会被useState重新初始化

正是因为hooks中是这样存储state的 所以我们只能在hooks的根作用域中使用useState，而不能在条件语句和循环中使用
因为我们不能每次都保证条件或循环语句都会执行:
```javascript
if (something) {
  const [state1] = useState(1)
}

// or

for (something) {
  const [state2] = useState(2)
}
```

#### fiber
每一个组件都会有一个fiber对象，在fiber中我们主要关注memoizedState这个对象，它就是调用完useState后对应的存储state的对象
调用useState后设置在memoizedState上的对象长这样：（又叫Hook对象）
```
{
  baseState,
  next,  
  baseUpdate,
  queue,
  memoizedState
}
```

这里面我们最需要关心的是memoizedState和next，memoizedState是用来记录这个useState应该返回的结果的，而next指向的是下一次useState对应的`Hook对象，即
```
hook1  ==>	Fiber.memoizedState
state1 === hook1.memoizedState
hook1.next	==>	hook2
state2	==>	hook2.memoizedState
....
```