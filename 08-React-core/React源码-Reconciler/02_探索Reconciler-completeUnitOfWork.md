## 一. completeUnitOfWork
前面提到：
render阶段的执行其实是一个深度优先遍历的过程，它有两个核心函数，beginWork和completeUnitOfWork,
在遍历的过程中，会对每个遍历到的节点执行beginWork创建子fiber节点。若当前节点不存在子节点（next === null），则对其执行
completeUnitOfWork。completeUnitOfWork方法内部会判断当前节点有无兄弟节点，有则进入兄弟节点的beginWork流程，否则进
入父节点的completeUnitOfWork流程

当beginWork返回值为空时，代表在遍历父->子链表的过程中发现当前链表已经无下一个节点了（也就是已遍历完当前父->子链表），
此时会进入到completeUnitOfWork函数。

### 1-1.completeUnitOfWork主要流程
1. 调用completeWork。
2. 用于进行父节点的effectList的收集：
   - 把当前 fiber 节点的 effectList 合并到父节点的effectList中。
   - 若当前 fiber 节点存在存在副作用(增,删,改)， 则将其加入到父节点的effectList中。
3. 沿着此节点所在的兄 -> 弟链表查看其是否拥有兄弟fiber节点（即fiber.sibling !== null），如果存在，则进入其兄弟fiber父 -> 子链表
   的遍历（即进入其兄弟节点的beginWork阶段）。如果不存在兄弟fiber，会通过子 -> 父链表回溯到父节点上，直到回溯到根节点，也即完成本次协调。

```javaScript
function completeUnitOfWork(unitOfWork: Fiber): void {
  let completedWork = unitOfWork;
  // 此循环控制fiber节点向父节点回溯
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    if ((completedWork.flags & Incomplete) === NoFlags) {
      let next;
      //  使用completeWork处理Fiber节点，后面再详细分析completeWork
      next = completeWork(current, completedWork, subtreeRenderLanes); // 处理单个节点
      if (next !== null) {
        // Suspense类型的组件可能回派生出其他节点, 此时回到`beginWork`阶段进行处理此节点
        workInProgress = next;
        return;
      }
      // 重置子节点的优先级
      resetChildLanes(completedWork);
      if (
        returnFiber !== null &&
        (returnFiber.flags & Incomplete) === NoFlags
      ) {
        // 将此节点的effectList合并到到父节点的effectList中
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = completedWork.firstEffect;
        }
        if (completedWork.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
          }
          returnFiber.lastEffect = completedWork.lastEffect;
        }
        // 若当前 fiber 节点存在存在副作用(增,删,改)， 则将其加入到父节点的`effectList`中。
        const flags = completedWork.flags;
        if (flags > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = completedWork;
          } else {
            returnFiber.firstEffect = completedWork;
          }
          returnFiber.lastEffect = completedWork;
        }
      }
    } else {
      // 异常处理
      //...
    }

    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      // 如果有兄弟节点, 则将兄弟节点作为下一个工作单元，进入到兄弟节点的beginWork阶段
      workInProgress = siblingFiber;
      return;
    }
    // 若不存在兄弟节点，则回溯到父节点
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
  // 已回溯到根节点, 设置workInProgressRootExitStatus = RootCompleted
  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }
}
```

## 二.completeWork
completeWork的作用包括：
1. 为新增的 fiber 节点生成对应的DOM节点。
2. 更新DOM节点的属性。
3. 进行事件绑定。
4. 收集effectTag。

### 2-1.与beginWork类似，completeWork针对不同fiber.tag也会进入到不同的逻辑处理分支。
```javaScript
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
    const newProps = workInProgress.pendingProps;

    switch (workInProgress.tag) {
        case IndeterminateComponent:
        case LazyComponent:
        case SimpleMemoComponent:
        case FunctionComponent:
        case ForwardRef:
        case Fragment:
        case Mode:
        case Profiler:
        case ContextConsumer:
        case MemoComponent:
            return null;
        case ClassComponent: {
            // ...
            return null;
        }
        case HostRoot: {
            // ...
            return null;
        }
        case HostComponent: {
            // ...
            return null;
        }
        // ...
    }
}
```
### HostComponent类型的节点为例
在处理HostComponent时，我们同样需要区分当前节点是需要进行新建操作还是更新操作。

但与beginWork阶段判断mount还是update不同的是，判断节点是否需要更新时，除了要满足 current !== null 之外，
我们还需要考虑workInProgress.stateNode节点是否为null，只有当:
current !== null && workInProgress.stateNode != null时，我们才会进行更新操作。

## 三.更新时
进入更新逻辑的fiber节点的stateNode属性不为空，即已经存在对应的DOM节点。这时候我们只需要更新DOM节点的属性并进行相关effectTag的收集。
```javaScript
if (current !== null && workInProgress.stateNode != null) {
  updateHostComponent(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance,
  );

  // ref更新时，收集Ref effectTag
  if (current.ref !== workInProgress.ref) {
    markRef(workInProgress);
  }
}
```

## 四.updateHostComponent
updateHostComponent 用于更新DOM节点的属性并在当前节点存在更新属性，收集Update effectTag。

根据需代码：
要变化的prop会被存储到updatePayload 中，updatePayload 为一个偶数索引的值为变化的prop key，奇数索引的值为变化的prop value的数组。
并最终挂载到挂载到workInProgress.updateQueue上，供后续commit阶段使用。
```javaScript
updateHostComponent = function(
  current: Fiber,
  workInProgress: Fiber,
  type: Type,
  newProps: Props,
  rootContainerInstance: Container,
) {
  // props没有变化，跳过对当前节点的处理
  const oldProps = current.memoizedProps;
  if (oldProps === newProps) {
    return;
  }

  const instance: Instance = workInProgress.stateNode;
  const currentHostContext = getHostContext();

  // 计算需要变化的DOM节点属性，并存储到updatePayload 中，updatePayload 为一个偶数索引的值为变化的prop key，奇数索引的值为变化的prop value的数组。
  const updatePayload = prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    currentHostContext,
  );

  // 将updatePayload挂载到workInProgress.updateQueue上，供后续commit阶段使用
  workInProgress.updateQueue = (updatePayload: any);
 
  // 若updatePayload不为空，即当前节点存在更新属性，收集Update effectTag
  if (updatePayload) {
    markUpdate(workInProgress);
  }
};
```

### 4-1.prepareUpdate
prepareUpdate内部会调用diff方法用于计算updatePayload。
```javaScript
export function prepareUpdate(
  instance: Instance,
  type: string,
  oldProps: Props,
  newProps: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
): null | Object {
  const viewConfig = instance.canonical.viewConfig;
  const updatePayload = diff(oldProps, newProps, viewConfig.validAttributes);

  instance.canonical.currentProps = newProps;
  return updatePayload;
}
```
diff方法内部实际是通过diffProperties方法实现的，diffProperties会对lastProps和nextProps进行对比：
1. 对input/option/select/textarea 的 lastProps & nextProps 做特殊处理，此处和React受控组件的相关，不做展开。
2. 遍历 lastProps：
```
1.当遍历到的prop属性在 nextProps 中也存在时，那么跳出本次循环（continue）。若遍历到的prop属性在 nextProps 中不存在，则进入下一步。

2.特殊处理style，判断当前prop是否为 style prop ，若不是，进入下一步，若是，则将 style prop 整理到styleUpdates中，其中
styleUpdates为以style prop的key值为key，''（空字符串）为value的对象，用于清空style属性。

3.由于进入到此步骤的prop在 nextProps 中不存在，将此类型的prop整理进updatePayload，并赋值为null，表示删除此属性。
```

3. 遍历 nextProps：
```
1.当遍历到的prop属性 与 lastProp 相等，即更新前后没有发生变化，跳过。

2.特殊处理style，判断当前prop是否为 style prop ，若不是，进入下一步，若是，整理到 styleUpdates 变量中，其中styleUpdates
为以style prop的key值为key，tyle prop的 value 为value的对象，用于更新style属性。

3.特殊处理 DANGEROUSLY_SET_INNER_HTML
4.特殊处理 children
5.若以上场景都没命中，直接把 prop 的 key 和值都整理到updatePayload中。
```
4. 若 styleUpdates 不为空，则将styleUpdates作为style prop 的值整理到updatePayload中。


## 五.新建时
进入新建逻辑的fiber节点的stateNode属性为空，不存在对应的DOM节点。相比于更新操作，我们需要做更多的事情：
1. 为 fiber 节点生成对应的 DOM 节点，并赋值给stateNode属性。

2. 将子孙DOM节点插入刚生成的DOM节点中。

3. 处理 DOM 节点的所有属性以及事件回调。

4. 收集effectTag。
```javaScript
if (current !== null && workInProgress.stateNode != null) {
  // 更新操作
  // ...
} else {
    // 新建操作
    // 创建DOM节点
    const instance = createInstance(
      type,
      newProps,
      rootContainerInstance,
      currentHostContext,
      workInProgress,
    );

    // 将子孙DOM节点插入刚生成的DOM节点中
    appendAllChildren(instance, workInProgress, false, false);

    // 将DOM节点赋值给stateNode属性
    workInProgress.stateNode = instance;

    // 处理 DOM 节点的所有属性以及事件回调
    if (
      finalizeInitialChildren(
        instance,
        type,
        newProps,
        rootContainerInstance,
        currentHostContext,
      )
    ) {
      markUpdate(workInProgress);
    }
}
```

### 5-1.createInstance
createInstance负责给fiber节点生成对应的DOM节点。
```javaScript
export function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
): Instance {
  let parentNamespace: string;
  // ...

  // 创建 DOM 元素
  const domElement: Instance = createElement(
    type,
    props,
    rootContainerInstance,
    parentNamespace,
  );

  // 在DOM节点中挂载一个指向 fiber 节点对象的指针
  precacheFiberNode(internalInstanceHandle, domElement);
  // 在 DOM节点中挂载一个指向 props 的指针
  updateFiberProps(domElement, props);
  return domElement;
}
```

### 5-2.appendAllChildren
appendAllChildren负责将子孙DOM节点插入刚生成的DOM节点中。

beginWork时介绍过，在mount时，为了避免每个fiber节点都需要进行插入操作，在mount时，只有根节点会收集effectTag，
其余节点不会进行effectTag的收集。由于每次执行appendAllChildren后，我们都能得到一棵以当前workInProgress为
根节点的DOM树。因此在commit阶段我们只需要对mount的根节点进行一次插入操作就可以了。
```javaScript
  appendAllChildren = function(
    parent: Instance,
    workInProgress: Fiber,
    needsVisibilityToggle: boolean,
    isHidden: boolean,
  ) {
    // 获取workInProgress的子fiber节点
    let node = workInProgress.child;

    // 当存在子节点时，去往下遍历
    while (node !== null) {
      if (node.tag === HostComponent || node.tag === HostText) {
        // 当node节点为HostComponent后HostText时，直接插入到子DOM节点列表的尾部
        appendInitialChild(parent, node.stateNode);
      } else if (enableFundamentalAPI && node.tag === FundamentalComponent) {
        appendInitialChild(parent, node.stateNode.instance);
      } else if (node.tag === HostPortal) {
        // 当node节点为HostPortal类型的节点，什么都不做
      } else if (node.child !== null) {
        // 上面分支都没有命中，说明node节点不存在对应DOM，向下查找拥有stateNode属性的子节点
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === workInProgress) {
        // 回溯到workInProgress时，以添加完所有子节点
        return;
      }

      // 当node节点不存在兄弟节点时，向上回溯
      while (node.sibling === null) {
        // 回溯到workInProgress时，以添加完所有子节点
        if (node.return === null || node.return === workInProgress) {
          return;
        }
        node = node.return;
      }
      
      // 此时workInProgress的第一个子DOM节点已经插入到进入workInProgress对应的DOM节点了，开始进入node节点的兄弟节点的插入操作
      node.sibling.return = node.return;
      node = node.sibling;
    }
  };

  function appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {
    parentInstance.appendChild(child);
  }
```

### 5-2.finalizeInitialChildren
```javaScript
function finalizeInitialChildren(
  domElement: Instance,
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
): boolean {
  // 此方法会将 DOM 属性挂载到 DOM 节点上，并进行事件绑定
  setInitialProperties(domElement, type, props, rootContainerInstance);
  // 返回 props.autoFocus 的值
  return shouldAutoFocusHostComponent(type, props);
}
```

### 5-3.effectList
我们在介绍completeUnitOfWork函数的时候提到，他的其中一个作用是用于进行父节点的effectList的收集：
- 把当前 fiber 节点的 effectList 合并到父节点的effectList中。
- 若当前 fiber 节点存在存在副作用(增,删,改)， 则将其加入到父节点的effectList中。
```javaScript
  // 将此节点的effectList合并到到父节点的effectList中
  if (returnFiber.firstEffect === null) {
    returnFiber.firstEffect = completedWork.firstEffect;
  }
    
  if (completedWork.lastEffect !== null) {
    if (returnFiber.lastEffect !== null) {
      returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
    }
    returnFiber.lastEffect = completedWork.lastEffect;
  }
  // 若当前 fiber 节点存在存在副作用(增,删,改)， 则将其加入到父节点的`effectList`中。
  const flags = completedWork.flags;
  if (flags > PerformedWork) {
    if (returnFiber.lastEffect !== null) {
      returnFiber.lastEffect.nextEffect = completedWork;
    } else {
      returnFiber.firstEffect = completedWork;
    }
    returnFiber.lastEffect = completedWork;
  }
```
effectList存在的目的是为了提升commit阶段的工作效率。
在commit阶段，我们需要找出所有存在effectTag的fiber节点并依次执行effectTag对应操作。为了避免在commit阶段再去做遍历操作去寻找effectTag
不为空的fiber节点，React在completeUnitOfWork函数调用的过程中提前把所有存在effectTag的节点收集到effectList中，在commit阶段，只需要遍
历effectList，并执行各个节点的effectTag的对应操作就好。

## 六.render阶段结束
在completeUnitOfWork的回溯过程中，如果completedWork === null，说明workInProgress fiber tree中的所有节点都已完成了completeWork，
workInProgress fiber tree已经构建完成，至此，render阶段全部工作完成。

后续我们将回到协调阶段的入口函数performSyncWorkOnRoot（legacy模式）或performConcurrentWorkOnRoot（concurrent 模式）中，调用
commitRoot(root)（其中root为fiberRootNode）来开启commit阶段的工作流程。
