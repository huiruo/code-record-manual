
### 入口
第一步：
```js
//node_modules\react-dom\cjs\react-dom.development.js
function render(element, container, callback) {
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

```js
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  {
    topLevelUpdateWarnings(container);
    warnOnInvalidCallback$1(callback === undefined ? null : callback, 'render');
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
  console.log("fiberRoot->",fiberRoot)
  return getPublicRootInstance(fiberRoot);
}
```

console.log("fiberRoot->",fiberRoot)
```
callbackNode: null
callbackPriority: 0
containerInfo: div#root
context: {}
current: FiberNode {tag: 3, key: null, elementType: null, type: null, stateNode: FiberRootNode, …}
entangledLanes: 0
entanglements: (31) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
eventTimes: (31) [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
expirationTimes: (31) [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
expiredLanes: 0
finishedLanes: 0
finishedWork: null
hydrate: false
interactionThreadID: 1
memoizedInteractions: Set(0) {}
mutableReadLanes: 0
mutableSourceEagerHydrationData: null
pendingChildren: null
pendingContext: null
pendingInteractionMap: Map(0) {}
pendingLanes: 0
pingCache: null
pingedLanes: 0
suspendedLanes: 0
tag: 0
timeoutHandle: -1
_debugRootType: "createLegacyRoot()"
```