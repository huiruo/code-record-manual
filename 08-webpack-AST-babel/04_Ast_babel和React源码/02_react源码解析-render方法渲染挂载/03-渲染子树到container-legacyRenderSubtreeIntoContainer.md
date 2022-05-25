## legacyRenderSubtreeIntoContainer
是render 方法的核心内容，字面意思是渲染子树到 container 中。

主要内容：

- 初始化 fiberRoot
- 更改 callback（render 方法的第三个参数）内部 this 指向
- 更新
  - 调度任务
  - 进入 commit 阶段
- 返回 render 方法的第一个参数对应的真实 DOM 对象

```javaScript
// render 方法中的调用
return legacyRenderSubtreeIntoContainer(
  // 父组件 初始渲染没有父组件 传递 null 占位
  null,
  element,
  container,
  // 是否为服务器端渲染 false 不是服务器端渲染 true 是服务器端渲染
  false,
  callback,
);
```

legacyRenderSubtreeIntoContainer 方法最核心的内容就是 创建 fiberRoot 和 rootFiber。

- 首先判断 container 下是否包含 _reactRootContainer 属性
  - 如果没有，则表示是初始化渲染
    - 调用方法创建 fiberRoot 对象，将包裹 fiberRoot 的对象存储到这个属性
  - 如果有，则表示是更新操作

- 接着将 render 方法的第三个参数（回调函数）的 this 指向 render 方法的第一个参数所对应的实例对象（stateNode）
  - 如果是普通元素，则是 DOM 对象
  - 如果是类组件，则是组件实例对象
  - 如果是函数组件，则为 null

- 接着使用非批量更新的方式，执行更新操作 undateContainer

- 最后返回 render 方法第一个参数对应的实例对象

```javaScript
/**
 * 将子树渲染到容器中 (初始化 Fiber 数据结构: 创建 fiberRoot 及 rootFiber)
 * parentComponent: 父组件, 初始渲染传入了 null
 * children: render 方法中的第一个参数, 要渲染的 ReactElement
 * container: 渲染容器
 * forceHydrate: true 为服务端渲染, false 为客户端渲染
 * callback: 组件渲染完成后需要执行的回调函数
 **/
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: Container,
  forceHydrate: boolean,
  callback: ?Function,
) {
  /**
   * 检测 container 是否已经是初始化过的渲染容器
   * react 在初始渲染时会为最外层容器添加 _reactRootContainer 属性
   * react 会根据此属性进行不同的渲染方式
   * root 不存在 表示初始渲染
   * root 存在 表示更新
   */
  // 获取 container 容器对象下是否有 _reactRootContainer 属性
  let root: RootType = (container._reactRootContainer: any);
  // 即将存储根 Fiber 对象
  let fiberRoot;
  if (!root) {
    // 初始渲染
    // 初始化根 Fiber 数据结构
    // 为 container 容器添加 _reactRootContainer 属性
    // 在 _reactRootContainer 对象中有一个属性叫做 _internalRoot
    // _internalRoot 属性值即为 FiberRoot 表示根节点 Fiber 数据结构
    // legacyCreateRootFromDOMContainer 就是用来创建 fiberRoot和rootFiber,内部依次调用了其它方法：
    // 		createLegacyRoot
    // 		new ReactDOMBlockingRoot -> this._internalRoot
    // 		createRootImpl
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );

    // 获取 Fiber Root 对象
    fiberRoot = root._internalRoot;


    ...

    // 初始化渲染不执行批量更新
    // 因为批量更新是异步的是可以被打断的, 但是初始化渲染应该尽快完成不能被打断
    // 所以不执行批量更新
    unbatchedUpdates(function () {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    ...
    // 非初始化渲染 即更新
    fiberRoot = root._internalRoot;
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  // 返回 render 方法第一个参数的真实 DOM 对象作为 render 方法的返回值
  // 就是说渲染谁 返回谁的真实 DOM 对象
  return getPublicRootInstance(fiberRoot);
}
```

### 关于 forceHydrate 参数
legacyRenderSubtreeIntoContainer方法需要参数判断是否是服务器端渲染的原因是：

如果是服务器端渲染，就要复用 container 内部的 DOM 元素，如果不是，则直接删除 container 内部的内容。
```javaScript
root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
```

### 方法2： legacyCreateRootFromDOMContainer 初始化 fiberRoot
> 04_初始化fiberRoot-legacyCreateRootFromDOMContainer.md