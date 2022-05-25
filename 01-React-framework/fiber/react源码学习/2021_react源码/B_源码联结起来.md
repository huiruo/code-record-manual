
参考:
https://zhuanlan.zhihu.com/p/355615380
## react 17 
源码解析
```
整个React的Fiber架构的核心在于对浏览器进行了时间分片处理（ps：Firefox新版本自身也实现了时间分片），抹掉了平台的差异，从而使得浏览器处理时候可以将控制权交出去，避免了js线程过多占用而阻塞渲染线程，实现了更细粒度的调度，即为：协程或纤程的调度
```
- packages
- react
  - src
    - jsx
		- ReactJSX.js
		- ReactJSXElement.js (定义了jsx)
		- ReactJSXElementValidator.js
	- React.js
	- ReactBaseClasses.js （setState及forceState)
	- ReactContext.js (context上下文及Provider和Consumer)
	- ReactElement.js (定义了ReactElement的格式)
	- ReactForwardRef.js (Ref的定义)
	- ReactHooks.js (ReactHooks相关)
	- ReactLazy.js
	- ReactMemo.js
	- ReactMutableSource.js
	- ReactStartTransition.js (批量更新的事务的概念)

## react-dom
- react-dom
	- src
		- clients
			- ReactDOMHostConfig.js
			- ReactDOMLegacy.js
			- ReactDOMRoot.js (三种模式：legacy模式、blocking模式、concurrent模式)
		- events
		    - ReactDOMEventListener.js (合成事件)
		- server
		- shared
- scheduler (本质是根据任务开始时间和过期时间利用小顶堆的优先队列而进行的时间分片处理及调度)
	- Scheduler.js
	- SchedulerMinHeap.js

### DOM处理
```
React17的进行了模式的设置，分别为：Legacy模式、Concurrent模式、Blocking模式，其中Concurrent模式是启用fiber分片的异步渲染方式，而Legacy模式则仍是15的同步渲染模式，Blocking则是介于二者之间的模式，React有意按照这样一种渐进的方式进行过度
```

### 合成事件:ReactDOMEventListeners.js
```
核心是dispatchEvent进行事件的分发，17之后不再将事件全部冒泡到document去代理，这和浏览器的改进有关，不再需要代理绑定，浏览器可以对更细粒度的区域进行监听
```
### Schdeuler.js

### SchedulerMinHeap.js
小顶堆的实现，可对比优先队列的考察，具体可以看一下leetcode的这道题 23. 合并K个升序链表，以及对fiber应用的扩展思考 86. 分隔链表
### SchedulePostTask.js

### Reconciler & Renderer
```
在经过了Scheduler的分片及调度后，将分片后的单元调度进合成器中，Reconciler阶段的主要目的是找寻不同，从而对虚拟dom的不同进行fiber层级的派发和合并；对于浏览器的分片可以利用setTimeout及MessageChannel来实现，具体浏览器是如何实现setTimeout的，可以看一下这个浏览器工作原理(16) - setTimeout实现原理，

https://link.zhihu.com/?target=https%3A//blog.csdn.net/u013448372/article/details/108425124
```
### ReactChildFiber.js

### ReactFiber.js
### ReactFiberBeginWork.js
### ReactFiberCommitWork.js
对不同的真实dom类型进行对应提交

### ReactFiberCompleteWork.js

### 总结
```
createRootFiber => FiberRootNode => initialUpdateQueue => updateContainer => createUpdate => scheduleUpdateOnFiber => renderRootSync => workLoopSync => performUnitOfWork => beginWork => updateHostRoot => processUpdateQueue => reconcileChildFibers => reconcileSingleElement => createFiberFromElement => completeUnitWork => completeWork => createInstance => createElement => finalizeInitialChildren

react16之后通过fiber对整个运行时的stack reconciler进行了修改，实现了分片的协程调度，对于层级较深的js调用栈可以实现停止与启动更细粒度的控制，从而避免js线程的长时间占用而导致的渲染线程的卡死，整体的设计体现了react架构人员的计算机素养相当的扎实，对操作系统乃至整体数据结构把控能力之强，可见一斑，从这个层面上看，国外程序员设计者确实在优化性能等方面总是从计算机最底层的思路去着手，值得我们学习与思考。
```

### 额外
```
实际上通过JSX创建的虚拟元素最终会被编译成调用React的createElement方法，而createElement只是做了一个简单的参数修正，返回一个ReactElement对象这个对象就是将我们的JSX与内部方法链接起来的纽带
```


# react 17 笔记
```ts
//packages\react\src\ReactElement.js
// return 调用ReactElement()
export function createElement(type, config, children) {
  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
  	// 具有ref ,非undefined
    if (hasValidRef(config)) {
      ref = config.ref;

      if (__DEV__) {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }
    // 具有key 非undefined
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    // 遍历属性
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  // 去除type 和props
  const childrenLength = arguments.length - 2; // 获取子节点
  if (childrenLength === 1) {// 单个子节点
    props.children = children;
  } else if (childrenLength > 1) { // 多个子节点
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];// 设置子节点
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;// 设置children
  }

  // Resolve default props// 默认属性
  if (type && type.defaultProps) { // 设置默认值
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];// 绑定默认设置值
      }
    }
  }
  if (__DEV__) {
    if (key || ref) {
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
/*
// 备注 ： 书写React的jsx代码， 经过babel 解析后，其实就是一些React.ReactElement函数调用。
// 包含type, key, ref等属性， children 属性在props中。
*/
```

### react cloneElement 方法定义
```ts
//  备注：1 根据传入 element参数生成 key ref, children , 组合defaultProps 生成props,
// 2   return 调用ReactElement 函数执行结果
/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */
export function cloneElement(element, config, children) {
  invariant(
    !(element === null || element === undefined),
    'React.cloneElement(...): The argument must be a React element, but you passed %s.',
    element,
  );

  let propName;

  // Original props are copied // 复用原来的节点的属性
  const props = Object.assign({}, element.props);

  // Reserved names are extracted
  let key = element.key; // 复用key
  let ref = element.ref; // 复用ref
  // Self is preserved since the owner is preserved.
  const self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  const source = element._source;

  // Owner will be preserved, unless ref is overridden
  let owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) { //具有ref 
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) { // 具有key
      key = '' + config.key;
    }

    // Remaining properties override existing props
    let defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    // 遍历config 的属性， 合并属性
    for (propName in config) {
      // 具有的属性
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
      	// 设置默认值
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          // 可能被覆盖
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  // 去除type 和props
  const childrenLength = arguments.length - 2; // 子节点的数目减去2
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}
```

## 定义 jsx 函数
```ts
//使用：
//  react 17 中新增的方法， 可用于手动创建reactElement 。使用方式有差异， 除了type元素，
// 都可以在config中设置
import {jsx as _jsx} from 'react/jsx-runtime'
function App{
	return _jsx('h1',{children:'Hello world'})
}
```
```ts
//定义jsx函数， 17.0.0版本新增
export function jsx(type, config, maybeKey) {
  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;

  // Currently, key can be spread in as a prop. This causes a potential
  // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
  // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
  // but as an intermediary step, we will use jsxDEV for everything except
  // <div {...props} key="Hi" />, because we aren't currently able to tell if
  // key is explicitly declared to be undefined or not.
  if (maybeKey !== undefined) {
    key = '' + maybeKey;
  }

  if (hasValidKey(config)) {
    key = '' + config.key;
  }

  if (hasValidRef(config)) {
    ref = config.ref;
  }

  // Remaining properties are added to a new props object
  for (propName in config) {
    if (
      hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName];
    }
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return ReactElement(
    type,
    key,
    ref,
    undefined,
    undefined,
    ReactCurrentOwner.current,
    props,
  );
}
```

