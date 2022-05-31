## 一.layout阶段的主函数 commitLayoutEffect
要注意一点，在执行commitLayoutEffect之前，会执行root.current = finishwork，这印证了之前分析的双缓存架构，经过mutation阶段，WIP已经渲染完成，fiberRoot.current就指向了代表当前界面的fiber树，

因此layout阶段触发的生命周期钩子和hook可以直接访问到已经改变后的DOM。

```javaScript
function commitRootImpl(root, recoverableErrors, transitions, renderPriorityLevel) {
    {
        // ...
        commitMutationEffects(root, finishedWork, lanes);

        resetAfterCommit(root.containerInfo); // The work-in-progress tree is now the current tree. This must come after
        // the mutation phase, so that the previous tree is still current during
        // componentWillUnmount, but before the layout phase, so that the finished
        // work is current during componentDidMount/Update.

        root.current = finishedWork; // The next phase is the layout phase, where we call effects that read

        {
            markLayoutEffectsStarted(lanes);
        }

        commitLayoutEffects(finishedWork, root, lanes);

        // ...
    }
}
```

```
commitRootImpl-->commitLayoutEffects(finishedWork, root, lanes)-->commitLayoutEffects_begin
-->
```

```javascript
function commitLayoutEffects(finishedWork, root, committedLanes) {
    inProgressLanes = committedLanes;
    inProgressRoot = root;
    nextEffect = finishedWork;
    commitLayoutEffects_begin(finishedWork, root, committedLanes);
    inProgressLanes = null;
    inProgressRoot = null;
}

function commitLayoutEffects_begin(subtreeRoot, root, committedLanes) {
    // Suspense layout effects semantics don't change for legacy roots.
    var isModernRoot = (subtreeRoot.mode & ConcurrentMode) !== NoMode;

    while (nextEffect !== null) {
      var fiber = nextEffect;
      var firstChild = fiber.child;

      if (fiber.tag === OffscreenComponent && isModernRoot) {
        // Keep track of the current Offscreen stack's state.
        var isHidden = fiber.memoizedState !== null;
        var newOffscreenSubtreeIsHidden = isHidden || offscreenSubtreeIsHidden;

        if (newOffscreenSubtreeIsHidden) {
          // The Offscreen tree is hidden. Skip over its layout effects.
          commitLayoutMountEffects_complete(subtreeRoot, root, committedLanes);
          continue;
        } else {
          // TODO (Offscreen) Also check: subtreeFlags & LayoutMask
          var current = fiber.alternate;

          // ...
            
          var child = firstChild;

          while (child !== null) {
            nextEffect = child;
            commitLayoutEffects_begin(child, // New root; bubble back up to here and stop.
              root, committedLanes);
            child = child.sibling;
          } // Restore Offscreen state and resume in our-progress traversal.


          nextEffect = fiber;
          offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
          commitLayoutMountEffects_complete(subtreeRoot, root, committedLanes);
          continue;
        }
      }

      if ((fiber.subtreeFlags & LayoutMask) !== NoFlags && firstChild !== null) {
        firstChild.return = fiber;
        nextEffect = firstChild;
      } else {
        commitLayoutMountEffects_complete(subtreeRoot, root, committedLanes);
      }
    }
}



function commitLayoutMountEffects_complete(subtreeRoot, root, committedLanes) {
    while (nextEffect !== null) {
        var fiber = nextEffect;

        if ((fiber.flags & LayoutMask) !== NoFlags) {
            var current = fiber.alternate;
            setCurrentFiber(fiber);

            try {
                // 执行useLayoutEffect的回调
                commitLayoutEffectOnFiber(root, current, fiber, committedLanes);
            } catch (error) {
                captureCommitPhaseError(fiber, fiber.return, error);
            }

            resetCurrentFiber();
        }

        if (fiber === subtreeRoot) {
            nextEffect = null;
            return;
        }

        var sibling = fiber.sibling;

        if (sibling !== null) {
            sibling.return = fiber.return;
            nextEffect = sibling;
            return;
        }

        nextEffect = fiber.return;
    }
}
```

## 1-1 我们重点分析 commitLayoutEffectOnFiber
根据不同tag进入不同case，对于函数组件会执行commitHookEffectListMount，
事实上此方法与前面分析的commitHookEffectListUnmount方法是相对应的，

前者执行指定副作用的回调函数，后者执行指定副作用的销毁函数
```javascript
function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork, committedLanes) {
    if ((finishedWork.flags & LayoutMask) !== NoFlags) {
    switch (finishedWork.tag) {
        case FunctionComponent:
        case ForwardRef:
        case SimpleMemoComponent:
        {
            if (!offscreenSubtreeWasHidden) {
                // At this point layout effects have already been destroyed (during mutation phase).
                // This is done to prevent sibling component effects from interfering with each other,
                // e.g. a destroy function in one component should never override a ref set
                // by a create function in another component during the same commit.
                if (finishedWork.mode & ProfileMode) {
                    try {
                        startLayoutEffectTimer();
                        // 执行useLayoutEffect的回调
                        commitHookEffectListMount(Layout | HasEffect, finishedWork);
                    } finally {
                        recordLayoutEffectDuration(finishedWork);
                    }
                } else {
                    commitHookEffectListMount(Layout | HasEffect, finishedWork);
                }
            }

            break;
        }

        case ClassComponent: {
            var instance = finishedWork.stateNode;

            if (finishedWork.flags & Update) {
                if (!offscreenSubtreeWasHidden) {
                    if (current === null) {
                        // We could update instance props and state here,
                        // but instead we rely on them being set during last render.
                        // TODO: revisit this when we implement resuming.
                        {
                            if (finishedWork.type === finishedWork.elementType && !didWarnAboutReassigningProps) {
                                if (instance.props !== finishedWork.memoizedProps) {
                                    error('Expected %s props to match memoized props before ' + 'componentDidMount. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
                                }

                                if (instance.state !== finishedWork.memoizedState) {
                                    error('Expected %s state to match memoized state before ' + 'componentDidMount. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.state`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
                                }
                            }
                        }

                        if (finishedWork.mode & ProfileMode) {
                            try {
                                startLayoutEffectTimer();
                                // 根据current是否存在执行不同生命周期
                                instance.componentDidMount();
                            } finally {
                                recordLayoutEffectDuration(finishedWork);
                            }
                        } else {
                            instance.componentDidMount();
                        }
                        // ...
                    }
                }
            }
        }
        
        // ...
                        
        case SuspenseListComponent:
        case IncompleteClassComponent:
        case ScopeComponent:
        case OffscreenComponent:
        case LegacyHiddenComponent:
          {
            break;
          }

        default:
          throw new Error('This unit of work tag should not have side-effects. This error is ' + 'likely caused by a bug in React. Please file an issue.');
      }
    }

    if (!offscreenSubtreeWasHidden) {
      {
        if (finishedWork.flags & Ref) {
          commitAttachRef(finishedWork);
        }
      }
    }
}
```

### 1-2 commitHookEffectListMount 的大概实现
此方法的第一个入参是副作用类型，方法内会遍历当前fiber的所有副作用链表，符合当前指定的副作用会
执行其create函数并得到对应的销毁函数。

这里传入方法的flag是useLayoutEffect对应的flag，因此我们可以明确，useLayoutEffect的回调函数会在layout阶段同步执行。

对于class组件则会根据current是否存在来决定执行ComponentDidMount还是ComponentDidUpdate，
此外还会执行commitUpdateQueue，该方法用于执行我们在this.setState中指定的callback
```javascript
function commitHookEffectListMount(flags: HookFlags, finishedWork: Fiber) {
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        // create即我们在副作用中指定的回调
        const create = effect.create;
        // 执行回调得到销毁函数，赋值给destroy，将来会在commitHookEffectListUnmount中执行
        effect.destroy = create();
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```

## 二.layout之后的逻辑
layout阶段的最后会判断rootDoesHavePassiveEffects，即看看是否有未处理的副作用，有则将 rootWithPendingPassiveEffects
赋值为root（整个应用的根节点）
```javascript
function commitRootImpl(root, recoverableErrors, transitions, renderPriorityLevel) {

    commitLayoutEffects(finishedWork, root, lanes);
    
    // ...
    
    if (rootDoesHavePassiveEffects) {
        // This commit has passive effects. Stash a reference to them. But don't
        // schedule a callback until after flushing layout work.
        rootDoesHavePassiveEffects = false;
        rootWithPendingPassiveEffects = root;
        pendingPassiveEffectsLanes = lanes;
    } else {

        {
            nestedPassiveUpdateCount = 0;
            rootWithPassiveNestedUpdates = null;
        }
    } // Read this again, since an effect might have updated it
    
    // ...
    
    // 1. 检测常规(异步)任务, 如果有则会发起异步调度
    ensureRootIsScheduled(root, now());
    
    // ...
    
    // 2. 检测同步任务, 如果有则主动调用flushSyncCallbackQueue,再次进入fiber树构造循环
    flushSyncCallbacks();
    // ...
}
```

layout阶段的最后会判断rootDoesHavePassiveEffects，即看看是否有未处理的副作用，
有则将rootWithPendingPassiveEffects赋值为root（整个应用的根节点），
这有什么用呢？让我们回到commitRootImpl的方法开头，它会循环判断rootWithPendingPassiveEffects，
当其不为null时，执行flushPassiveEffects，此函数的调用栈如下
```
flushPassiveEffects =>
flushPassiveEffectsImpl=>
// 执行useEffect的销毁函数
commitPassiveUnmountEffects(root.current);
// 执行useEffect的create函数
commitPassiveMountEffects(root, root.current);
```
### 总结flushPassiveEffects的功能
就是执行useEffect在上次更新的产生的销毁函数以及本次更新的回调函数。
因此我们可以明确commit阶段开始之前会先清理掉之前遗留的effect，由于effect中又可能触发新的更新而产生新的effect，
因此要循环判断rootWithPendingPassiveEffects直到为null。

我们之前在介绍before mutation阶段之前的逻辑时提到过该阶段会以一个优先级来调度执行flushPassiveEffects，
这表明在这里注册的flushPassiveEffects会在commit阶段之后执行，而我们已经知道了flushPassiveEffects的职责，
因此也就明确了我们在useEffect中指定的回调是会在dom渲染后异步执行的，这就有别于useLayoutEffect，
我们不妨来梳理下二者的回调和销毁的执行时机。

- useLayoutEffect的销毁函数在mutation阶段执行
- useLayoutEffect的回调在layout阶段执行
- useEffect的销毁和回调都是在commit阶段后异步执行，先执行上次更新产生的销毁，再执行本次更新的回调。

useLayoutEffect的销毁函数在mutation阶段执行
useLayoutEffect的回调在layout阶段执行
useEffect的销毁和回调都是在commit阶段后异步执行，先执行上次更新产生的销毁，再执行本次更新的回调。

至此首屏渲染的render与commit的流程就梳理完成了，接下来分析update流程与mount流程的不同点。