# 渲染挂载

## 1. 调用render方法-渲染
render 方法位于 react-dom.development17.js
主要具备两个功能：
1. 将ast树转换为真实的dom
2. 挂载到页面上

render方法中判断是否可用的dom元素及一些错误判断，此处可以不管。

```javaScript
function render(element, container, callback) {
  console.log('react-dom.development17.js-render',element, container, callback)
  if (!isValidContainer(container)) {
    {
      throw Error("Target container is not a DOM element.");
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
## 第二步
render函数最后调用的是 legacyRenderSubtreeIntoContainer()
react-dom.development17.js
具体函数实现如下:
```javaScript
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  {
    topLevelUpdateWarnings(container);
    warnOnInvalidCallback(callback === undefined ? null : callback, 'render');
  } // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type." Whyyyyyy.
  var root = container._reactRootContainer;
  var fiberRoot;

  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {
      var originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } // Initial mount should not be batched.


    unbatchedUpdates(function () {
        // 挂载关注这个函数从这个函数去，会有ast转换为dom树的逻辑和如何插入到dom元素的逻辑
        
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {
      var _originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);

        _originalCallback.call(instance);
      };
    } // Update


    updateContainer(children, fiberRoot, parentComponent, callback);
  }

  return getPublicRootInstance(fiberRoot);
}
```
