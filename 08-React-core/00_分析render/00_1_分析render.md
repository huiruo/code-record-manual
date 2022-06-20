
## 第一步
```
react.development18.js
调用:createElement--->return ReactElement()

--->ReactDOM.render(astTree, container)
```

## 第二步
见流程图

## 1.render函数
```javaScript
function render(element, container, callback) {
  {
    error('ReactDOM.render is no longer supported in React 18. Use createRoot ' + 'instead. Until you switch to the new API, your app will behave as ' + "if it's running React 17. Learn " + 'more: https://reactjs.org/link/switch-to-createroot');
  }

  if (!isValidContainerLegacy(container)) {
    throw new Error('Target container is not a DOM element.');
  }

  {
    var isModernRoot = isContainerMarkedAsRoot(container) && container._reactRootContainer === undefined;

    if (isModernRoot) {
      error('You are calling ReactDOM.render() on a container that was previously ' + 'passed to ReactDOMClient.createRoot(). This is not supported. ' + 'Did you mean to call root.render(element)?');
    }
  }

  /*
  parentComponent => null:SSR 专用，父结点
  children => element:需要渲染的 ReactElemtn
  container => container:HtmlElment
  forceHydrate => false:SSR 专用，通过 Hydrate 这里会是 true
  callBack => callback
  */
  return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
}
```

## 2.legacyRenderSubtreeIntoContainer 作用：
根据 container 是否存在 root 区分初始化/更新，创建或获取 fiberRoot，进而启动更新
从 container 取出 _reactRootContainer 作为 react 的一个根

const root = container._reactRootContainer

检查 root 是否存在，如果存在就是 Update，如果不存在就是初始化
```javaScript
  function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
    {
      topLevelUpdateWarnings(container);
      warnOnInvalidCallback$1(callback === undefined ? null : callback, 'render');
    }

    var maybeRoot = container._reactRootContainer;
    var root;

    if (!maybeRoot) {
      // Initial mount
      root = legacyCreateRootFromDOMContainer(container, children, parentComponent, callback, forceHydrate);
    } else {
      root = maybeRoot;

      if (typeof callback === 'function') {
        var originalCallback = callback;

        callback = function () {
          var instance = getPublicRootInstance(root);
          originalCallback.call(instance);
        };
      } // Update


      updateContainer(children, root, parentComponent, callback);
    }

    return getPublicRootInstance(root);
  }
```

## 2-1.若 root 存在：
```
从 root 中取出 fiberRoot

const fiberRoot = root._internalRoot

调用 updateContainer(children,fiberRoot,parentComponent,callBack)

注意：这里 callBack 会通过 getPublicRootInstance() 递归找到 fiberRoot 上第一个非 HTMlElement 结点,并将 callback 绑定在它上边。
```
```javaScript
if (typeof callback === 'function') {
  const originalCallback = callback;
  callback = function() {
    const instance = getPublicRootInstance(fiberRoot);
    originalCallback.call(instance);
  };
}
```


## 2-2.若root不存在：
调用 legacyCreateRootFromDOMContainer(contaiber,forceHydrate) 初始化 root。
将 root 赋值给 container._reactRootContainer,取出 root 中的_internalRoot 作为 fiberRoot。

### legacyCreateRootFromDOMContainer
调用 legacyCreateRootFromDOMContainer(contaiber,forceHydrate) 初始化 root。
作用：清空container,创建root:
```
参数：
container:HTMLElement
forceHydrate:fasle
```

将root赋值给container._reactRootContainer,取出 root 中的_internalRoot 作为 fiberRoot。

调用 updateContainer(children,fiberRoot,parentComponent,callBack)。
```javaScript
// 注意这里调用的时候，是非批量的。因为是初始化的内部挂载，所以需要使用非批量更新
unbatchedUpdates(() => {
  updateContainer(children, fiberRoot, parentComponent, callback);
});

// updateContainer() 就到了更新流程
```

- 根据 forceHydrate 和 container 上是否已经被标记是一个 ReactContainer 来判断是否需要清空 container（SSR 不需要清空，但是 web 端初始化情况）

- 创建一个 root 结点

```javaScript
shouleHydrate = forceHydrate && isReactContainer(contaiber)?{ hydrate:true }

调用 createLegacyRoot(container,shouleHydrate)
```

## createLegacyRoot
```
container --------------- HTMLElement
options:shouleHydrate --- 忽略
```

