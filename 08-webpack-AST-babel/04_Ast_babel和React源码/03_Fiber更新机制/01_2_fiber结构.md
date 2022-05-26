
## 结构分析
真实dom对应在内存中的Fiber节点形成Fiber树，

这颗Fiber树在react中叫current Fibe，

而正在构建Fiber树叫workInProgress Fiber，这两颗树的节点通过alternate相连.
```javaScript
function App() {
  return (
		<>
      <h1>
        <p>count</p> xiaochen
      </h1>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
```

构建workInProgress Fiber发生在createWorkInProgress中，它能创建或者复用Fiber
```javaScript
export function createWorkInProgress(current: Fiber, pendingProps: any): Fiber {
  let workInProgress = current.alternate;
  // 区分是在mount时还是在update时
  if (workInProgress === null) {
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode,
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
   
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    // 复用属性
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;

    workInProgress.nextEffect = null;
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;
	
    //...
  }

  workInProgress.childLanes = current.childLanes;//复用属性
  workInProgress.lanes = current.lanes;

  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  const currentDependencies = current.dependencies;
  workInProgress.dependencies =
    currentDependencies === null
      ? null
      : {
          lanes: currentDependencies.lanes,
          firstContext: currentDependencies.firstContext,
        };

  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;


  return workInProgress;
}
```
