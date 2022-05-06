# 先来个总结
```
ReactDom.render函数主要是处理传入的root节点，创建一个ReactRoot,同时创建一个FiberRoot，

创建FiberRoot的过程中也会创建一个FiberRoot对象，根据创建的FiberRoot去更新。
```
```
ReactDOM.render() 的更新步骤
（1）创建 ReactRoot，ReactRoot 是创建整个React应用的根对象

（2）创建 FiberRoot 和 RootFiber

（3）创建更新 （创建更新后，就会进入调度阶段，调度阶段由调度器进行管理）
```
```
在ReactDom.render的过程中,我们创建了一个reactRoot,同时创建了一个FiberRoot.在FiberRoot创建的过程中,会创建一个Fiber对象.
在root上我们创建了一个ExpirationTime和update更新对象,然后把这个更新对象加入到Fiber对象中.此过程为创建更新.
然后我们开始进行任务调度,开始调度更新scheduleWork
```
# ReactDOM.render()流程图
```txt
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
     |
     V
legacyRenderSubtreeIntoContainer --->初始化container
     |
     V
legacyCreateRootFromDOMContainer()
     |
     V
shouldHydrateDueToLegacyHeuristic() -->判断是否是服务端渲染的标记
     |                                       |
     |                                       |
     V                                       V否-------->当首次调用，容器节点所有dom元素都会被替换（删除），后续的调用则会使用React的DOM差分算法进行高效更新
new ReactDOMBlockingRoot()
     |
     V
创建ReactRoot
     |
     v
创建fiberRoot()
```

### 例
```js
import React, { version } from 'react';
function App(props) {

  const onClick = () => {
    // props.history.push("/detail")
    console.log("version", version)
  }
  return (
    <div className="container">
      <p>Component1</p>
      <div>
        <button onClick={() => onClick()}>跳转到详情</button>
      </div>
    </div>
  );
}

export default App;
/*
在node_modules\react\cjs\react.development.js
比如将版本号：
//var ReactVersion = '17.0.2';
var ReactVersion = '17.0.3';
在源码可以找到 ReactVersion
react-test\node_modules\react\cjs\react.production.min.js
或：
react-test\node_modules\react\cjs\react.development.js
从新run之后就会生效
*/
```

### 再来看下开始index.js源码
```js
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```
```
https://blog.csdn.net/wu_xianqiang/article/details/113521191
StrictMode 是一个用来检查项目中潜在问题的工具。与 Fragment 一样，StrictMode 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告

1、识别不安全的生命周期
2、关于使用过时字符串 ref API 的警告
3、关于使用废弃的 findDOMNode 方法的警告
4、检测意外的副作用
5、检测过时的 context AP
```
###### 1.render
node_modules\react-dom\cjs\react-dom.development.js
如果是源码：
请切换到,17.0.2分支:
react\packages\react-dom\src\client\ReactDOMLegacy.js
```js
if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';
......
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Internals;
exports.createPortal = createPortal$1;
exports.findDOMNode = findDOMNode;
exports.flushSync = flushSync;
exports.hydrate = hydrate;
exports.render = render;
exports.unmountComponentAtNode = unmountComponentAtNode;
exports.unstable_batchedUpdates = batchedUpdates$1;
exports.unstable_createPortal = unstable_createPortal;
exports.unstable_renderSubtreeIntoContainer = renderSubtreeIntoContainer;
exports.version = ReactVersion;
  })();
}

```
render方法作用：
1、判断传入的容器是否是dom元素，2、调用legacyRenderSubtreeIntoContainer函数
```js
//packages\react-dom\src\client\ReactDOMLegacy.js
//or
//node_modules\react-dom\cjs\react-dom.development.js
//参数：元素,挂载节点，渲染完回调
//源码
export function render(
  element: React$Element<any>,
  container: Container,
  callback: ?Function,
) {
  invariant(
    isValidContainer(container),
    'Target container is not a DOM element.',
  );
  if (__DEV__) {
    const isModernRoot =
      isContainerMarkedAsRoot(container) &&
      container._reactRootContainer === undefined;
    if (isModernRoot) {
      console.error(
        'You are calling ReactDOM.render() on a container that was previously ' +
          'passed to ReactDOM.createRoot(). This is not supported. ' +
          'Did you mean to call root.render(element)?',
      );
    }
  }
  return legacyRenderSubtreeIntoContainer(null, element, container, false, callback, );
}
//dev
function render(element, container, callback) {
  console.log("rendr-element",element)
  if (!isValidContainer(container)) {
    {
      throw Error( "Target container is not a DOM element." );
    }
  }
  {
    var isModernRoot = isContainerMarkedAsRoot(container) && container._reactRootContainer === undefined;
    if (isModernRoot) {
      error('You are calling ReactDOM.render() on a container that was previously ' + 'passed to ReactDOM.createRoot(). This is not supported. ' + 'Did you mean to call root.render(element)?');
    }
  }
  return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
}
```
```ts
//render方法本质是返回了函数 legacyRenderSubtreeIntoContainer
return legacyRenderSubtreeIntoContainer(
  null,
  element,
  container,
  //render不会复用节点，因为是前端渲染,true，表示在服务端尽可能复用节点，提高性能;
  false,
  callback,
);
```
###### 2.legacyRenderSubtreeIntoContainer()
作用：初始化Container
```ts
//packages\react-dom\src\client\ReactDOMLegacy.js
//forceHydrate主要来区别是服务端渲染（hydrate）还是客户端渲染（render）。
//参数：父元素，渲染的元素，容器id,创建为false,回调
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: Container,
  forceHydrate: boolean,
  callback: ?Function,
) {
  if (__DEV__) {
    topLevelUpdateWarnings(container);
    warnOnInvalidCallback(callback === undefined ? null : callback, 'render');
  }
	/*
	container是一个dom元素，所以没有_reactRootContainer属性，会调用
	legacyCreateRootFromDOMContainer 方法，给该方法传入了container forceHydrate参数。
	创建一个ReactRooter
	*/
  let root = container._reactRootContainer;
  let fiberRoot: FiberRoot;
  if (!root) {
    // Initial mount
    //创建一个ReactRooter
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root;
    //判断是否有callback
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
      	//根据fiberRoot获取公共Root实例
        //就是fiberRoot.current.child.stateNode
        const instance = getPublicRootInstance(fiberRoot);
        //通过该实例instance 去调用originalCallback方法
        originalCallback.call(instance);
      };
    }
    //初始化安装不应该批量更新
    //初始化函数不需要进行batchedUpdates批处理
    // Initial mount should not be batched.
    flushSyncWithoutWarningIfAlreadyRendering(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  // 将dom挂在到页面的父节点上，不再具体展开
  return getPublicRootInstance(fiberRoot);
}
```
#### 我们可以看到，在这个函数中进行了几步处理
```
1.判断组件类型，处理不同逻辑
2.将虚拟dom处理成真实dom
3.将生成的dom挂载到传入的父元素上
```

```
（1）由于是第一次渲染更新，所以root是null，只需看!root的情况
（2）legacyCreateRootFromDOMContainer(container,false,)的作用是创建ReactRooter，稍后会讲解
（3） unbatchedUpdates (fn)的简化源码如下
     unbatchedUpdates(fn){
       return fn()
     }
（4）updateContainer()的作用是更新container，稍后讲解
```

###### 3.legacyCreateRootFromDOMContainer()
作用： 创建一个 ReactRooter
清除container下面所有元素，最终调用createLegacyRoot函数
```ts
//packages\react-dom\src\client\ReactDOMLegacy.js
//参数：容器id,forceHydrate主要来区别是服务端渲染（hydrate）还是客户端渲染（render:false）
import {createLegacyRoot, isValidContainer} from './ReactDOMRoot';
function legacyCreateRootFromDOMContainer(container: Container, forceHydrate: boolean,
): RootType {
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // First clear any existing content.
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    //会清除container下面所有元素，最终调用createLegacyRoot函数
    while ((rootSibling = container.lastChild)) {
      if (__DEV__) {
        if (
          !warned &&
          rootSibling.nodeType === ELEMENT_NODE &&
          (rootSibling: any).hasAttribute(ROOT_ATTRIBUTE_NAME)
        ) {
          warned = true;
          console.error(
            'render(): Target node has markup rendered by React, but there ' +
              'are unrelated nodes as well. This is most commonly caused by ' +
              'white-space inserted around server-rendered markup.',
          );
        }
      }
      container.removeChild(rootSibling);
    }
  }
  if (__DEV__) {
    if (shouldHydrate && !forceHydrate && !warnedAboutHydrateAPI) {
      warnedAboutHydrateAPI = true;
      console.warn(
        'render(): Calling ReactDOM.render() to hydrate server-rendered markup ' +
          'will stop working in React v18. Replace the ReactDOM.render() call ' +
          'with ReactDOM.hydrate() if you want React to attach to the server HTML.',
      );
    }
  }
  return createLegacyRoot(
    container,
    shouldHydrate
      ? {
          hydrate: true,
        }
      : undefined,
  );
}
```

###### 4.createLegacyRoot
```ts
//packages\react-dom\src\client\ReactDOMRoot.js
//参数：dom节点，配置参数：主要区分render和hydrate
export function createLegacyRoot(
  container: Container,
  options?: RootOptions,
): RootType {
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}

function ReactDOMBlockingRoot(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  this._internalRoot = createRootImpl(container, tag, options);
}
```
```
经过一段大规模的处理，最终root和container._reactRootContainer得到一个ReactDOMBlockingRoot，

所以只需要看 ReactDOMBlockingRoot 函数中createRootIml就行, createRootIml 函数调用了 createContainer
```

createRootImpl:
```ts
//packages\react-dom\src\client\ReactDOMRoot.js
/*
//createRootIml函数调用了createContainer
const root = createContainer(container, tag, hydrate, hydrationCallbacks);
*/
import {
  createContainer,
  updateContainer,
  findHostInstanceWithNoPortals,
  registerMutableSourceForHydration,
} from 'react-reconciler/src/ReactFiberReconciler'
function createRootImpl(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  // Tag is either LegacyRoot or Concurrent Root
  const hydrate = options != null && options.hydrate === true;
  const hydrationCallbacks =
    (options != null && options.hydrationOptions) || null;
  const mutableSources =
    (options != null &&
      options.hydrationOptions != null &&
      options.hydrationOptions.mutableSources) ||
    null;

  const root = createContainer(container, tag, hydrate, hydrationCallbacks);

  markContainerAsRoot(root.current, container);
  const containerNodeType = container.nodeType;
  if (enableEagerRootListeners) {
    const rootContainerElement =
      container.nodeType === COMMENT_NODE ? container.parentNode : container;
    listenToAllSupportedEvents(rootContainerElement);
  } else {
    if (hydrate && tag !== LegacyRoot) {
      const doc =
        containerNodeType === DOCUMENT_NODE
          ? container
          : container.ownerDocument;
      // We need to cast this because Flow doesn't work
      // with the hoisted containerNodeType. If we inline
      // it, then Flow doesn't complain. We intentionally
      // hoist it to reduce code-size.
      eagerlyTrapReplayableEvents(container, ((doc: any): Document));
    } else if (
      containerNodeType !== DOCUMENT_FRAGMENT_NODE &&
      containerNodeType !== DOCUMENT_NODE
    ) {
      ensureListeningTo(container, 'onMouseEnter', null);
    }
  }
  if (mutableSources) {
    for (let i = 0; i < mutableSources.length; i++) {
      const mutableSource = mutableSources[i];
      registerMutableSourceForHydration(root, mutableSource);
    }
  }
  return root;
}
```
注意：执行了 createContainer 方法 并且在原型上声明了几个方法.(记住render方法是在这里注册的)
packages\react-dom\src\client\ReactDOMRoot.js
```ts
ReactDOMRoot.prototype.unmount = ReactDOMBlockingRoot.prototype.unmount = function(): void {
	...
}
ReactDOMRoot.prototype.render = ReactDOMBlockingRoot.prototype.render = function(
  children: ReactNodeList,
): void {
	...
  updateContainer(children, root, null, null);
}
```

###### 5.createContainer 主要调用了FiberRootNode
packages\react-reconciler\src\ReactFiberReconciler.js
```ts
import {
  createContainer as createContainer_old,
} from './ReactFiberReconciler.old';
import {
  createContainer as createContainer_new,
} from './ReactFiberReconciler.new';
export const createContainer = enableNewReconciler
  ? createContainer_new
  : createContainer_old;
```

这个方法的核心是创建一个FiberRoot,createContainer调用并返回了createFiberRoot函数
packages\react-reconciler\src\ReactFiberReconciler.old.js
或则：
packages\react-reconciler\src\ReactFiberReconciler.new.js
```ts
import {createFiberRoot} from './ReactFiberRoot.old';
//or
import {createFiberRoot} from './ReactFiberRoot.new';
export function createContainer(
  containerInfo: Container,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): OpaqueRoot {
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}
```

最终其实就是调用了FiberRootNode函数，返回的是一个FiberRootNode实例
packages\react-reconciler\src\ReactFiberRoot.old.js
```ts
import type {FiberRoot, SuspenseHydrationCallbacks} from './ReactInternalTypes';
import type {RootTag} from './ReactRootTags';

import {noTimeout, supportsHydration} from './ReactFiberHostConfig';
import {createHostRootFiber} from './ReactFiber.old';
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): FiberRoot {
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  if (enableSuspenseCallback) {
    root.hydrationCallbacks = hydrationCallbacks;
  }

  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  const uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  initializeUpdateQueue(uninitializedFiber);

  return root;
}
```
# end 已上基本所有代码都是在处理container相关代码

## 第二条线路: updateContainer 函数
```ts
//packages\react-dom\src\client\ReactDOMLegacy.js
import {
  findHostInstanceWithNoPortals,
  updateContainer,
  unbatchedUpdates,
  getPublicRootInstance,
  findHostInstance,
  findHostInstanceWithWarning,
} from 'react-reconciler/src/ReactFiberReconciler';
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: Container,
  forceHydrate: boolean,
  callback: ?Function,
) {
	...
    if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
	//初始化安装不应该批量更新
    // Initial mount should not be batched.
    unbatchedUpdates(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
    ...
  }
}
```
###### updateContainer
```ts
//packages\react-reconciler\src\ReactFiberReconciler.js
import {
  createContainer as createContainer_new,
  updateContainer as updateContainer_new,
} from './ReactFiberReconciler.new';
import {
  createContainer as createContainer_old,
  updateContainer as updateContainer_old,
} from './ReactFiberReconciler.old';

export const createContainer = enableNewReconciler
  ? createContainer_new
  : createContainer_old;
export const updateContainer = enableNewReconciler
  ? updateContainer_new
  : updateContainer_old;
```
```ts
//packages\react-reconciler\src\ReactFiberReconciler.old.js
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): Lane {
  if (__DEV__) {
    onScheduleRoot(container, element);
  }
  const current = container.current; //是处理后的节点了，fiberroot
  const eventTime = requestEventTime();//这个事件非常重要，用于算法更新
  if (__DEV__) {
    // $FlowExpectedError - jest isn't a global, and isn't recognized outside of tests
    if ('undefined' !== typeof jest) {
      warnIfUnmockedScheduler(current);
      warnIfNotScopedWithMatchingAct(current);
    }
  }
  const lane = requestUpdateLane(current);

  if (enableSchedulingProfiler) {
    markRenderScheduled(lane);
  }

  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  if (__DEV__) {
    if (
      ReactCurrentFiberIsRendering &&
      ReactCurrentFiberCurrent !== null &&
      !didWarnAboutNestedUpdates
    ) {
      didWarnAboutNestedUpdates = true;
      console.error(
        'Render methods should be a pure function of props and state; ' +
          'triggering nested component updates from render is not allowed. ' +
          'If necessary, trigger nested updates in componentDidUpdate.\n\n' +
          'Check the render method of %s.',
        getComponentName(ReactCurrentFiberCurrent.type) || 'Unknown',
      );
    }
  }

  //标记要更新的节点
  const update = createUpdate(eventTime, lane);
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = {element};

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    if (__DEV__) {
      if (typeof callback !== 'function') {
        console.error(
          'render(...): Expected the last optional `callback` argument to be a ' +
            'function. Instead received: %s.',
          callback,
        );
      }
    }
    update.callback = callback;
  }

  enqueueUpdate(current, update);
  //任务调度，开始更新了,fiber机制比较复杂
  scheduleUpdateOnFiber(current, lane, eventTime);

  return lane;
}
```