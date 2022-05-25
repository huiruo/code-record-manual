
### 方法2： legacyCreateRootFromDOMContainer 初始化 fiberRoot
调用：
```javaScript
root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
```

- 该方法中首先判断是否是服务器端渲染：
  - 如果不是服务器端渲染，需要清空容器内容
  - 如果是服务器端渲染，不需要清空容器内容，因为之后需要复用容器内部的 DOM
- 最后调用 createLegacyRoot 方法，创建并返回调用结果

```
作用：清空 container,创建 root

1.根据 forceHydrate 和 container 上是否已经被标记是一个 ReactContainer 来判断是否需要清空 container（SSR 不需要清空，但是 web 端初始化情况）
2.创建一个 root 结点

shouleHydrate = forceHydrate && isReactContainer(contaiber)?{ hydrate:true }:undefinde

调用 createLegacyRoot(container,shouleHydrate)
```

```javaScript
/**
 * 判断是否为服务器端渲染 如果不是服务器端渲染
 * 清空 container 容器中的节点
 */
function legacyCreateRootFromDOMContainer(
  container: Container,
  forceHydrate: boolean,
): RootType {
  // container => <div id="root"></div>
  // 检测是否为服务器端渲染
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // 如果不是服务器端渲染
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    // 开启循环 删除 container 容器中的节点
    while ((rootSibling = container.lastChild)) {
      // 删除 container 容器中的节点
      container.removeChild(rootSibling);
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

### 调用 createLegacyRoot(container,shouleHydrate)
> 05_创建LegacyRoot节点-createLegacyRoot方法.md