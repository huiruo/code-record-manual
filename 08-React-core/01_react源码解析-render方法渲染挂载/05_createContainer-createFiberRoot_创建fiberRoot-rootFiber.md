
## 1.createContainer 仅仅返回了 createFiberRoot 的调用结果：
该方法在 createRootImpl 中调用
```javaScript
function createRootImpl(container, tag, options) {
  ...

  var root = createContainer(container, tag, hydrate);
  ...

  return root;
}
```

```javaScript
/*
* 仅仅返回了 createFiberRoot 的调用结果
*/
function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
  return createFiberRoot(containerInfo, tag, hydrate);
}
```

## 2.createFiberRoot 创建fiberRoot,rootFiber