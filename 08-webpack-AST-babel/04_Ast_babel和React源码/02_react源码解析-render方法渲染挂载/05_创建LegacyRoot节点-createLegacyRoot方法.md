

# 1.createLegacyRoot 通过实例化 ReactDOMBlockingRoot 类创建 LegacyRoot
## 1.createLegacyRoot 通过实例化 ReactDOMBlockingRoot 类创建 LegacyRoot
### 1.createLegacyRoot 通过实例化 ReactDOMBlockingRoot 类创建 LegacyRoot
在 legacyCreateRootFromDOMContainer 方法中-----> ReactDOMBlockingRoot

详细方法
```javaScript
/*
* 通过实例化 ReactDOMBlockingRoot 类创建 LegacyRoot
*/
function createLegacyRoot(container, options) {
  // container => <div id="root"></div>
  // LegacyRoot 常量, 值为 0,
  // 通过 render 方法创建的 container 就是 LegacyRoot
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}
```

LegacyRoot 是 React 标记的 root 类型，通过不同方法创建的 root 的标记不同：
```javaScript
// packages\shared\ReactRootTags.js
// ReactDOM.render
export const LegacyRoot = 0;

// ReactDOM.createBlockingRoot
export const BlockingRoot = 1;

// ReactDOM.createRoot
export const ConcurrentRoot = 2;
```

### 2.createLegacyRoot 方法内调用 New ReactDOMBlockingRoot()
createLegacyRoot方法通过 ReactDOMBlockingRoot 构造函数重新实例化：
```javaScript
/*
* 
* 通过它可以创建 LegacyRoot 的 Fiber 数据结构
* 只是向对象中添加了一个 _internalRoot 属性
*/
function ReactDOMBlockingRoot(container, tag, options) {
  // tag => 0 => legacyRoot
  // container => <div id="root"></div>
  // container._reactRootContainer = {_internalRoot: {}}
  this._internalRoot = createRootImpl(container, tag, options);
}
```

### 3.ReactDOMBlockingRoot 方法内 调用 createRootImpl
```javaScript
/*
* 该方法最终返回了处理完成后的root
*/
function createRootImpl(container, tag, options) {
  // container => <div id="root"></div>
  // tag => 0
  // options => undefined

  // Tag is either LegacyRoot or Concurrent Root
  // 检测是否为服务器端渲染 false
  var hydrate = options != null && options.hydrate === true;
  var hydrationCallbacks = options != null && options.hydrationOptions || null;
  var mutableSources = options != null && options.hydrationOptions != null && options.hydrationOptions.mutableSources || null;

  var root = createContainer(container, tag, hydrate);

  // 将 root.current 存储到 container
  markContainerAsRoot(root.current, container);
  var containerNodeType = container.nodeType;

  {
    var rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
    listenToAllSupportedEvents(rootContainerElement);
  }

  if (mutableSources) {
    for (var i = 0; i < mutableSources.length; i++) {
      var mutableSource = mutableSources[i];
      registerMutableSourceForHydration(root, mutableSource);
    }
  }
  console.log('分割线createRootImpl=======>start')
  console.log('dom-ReactDOMBlockingRoot 方法内 调用 createRootImpl 返回值：该方法最终返回了处理完成后的root:', root)
  console.log('分割线createRootImpl=======>end')
  return root;
}
```