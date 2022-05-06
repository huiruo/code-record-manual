
### mobx和redux、useContext进行简单对比说明
MobX 的理念是通过观察者模式对数据做出追踪处理，在对可观察属性作出变更或者引用的时候，触发其依赖的监听函数；整体的store注入机制采用react提供的context来进行传递
但是redux、useContext是通过将所有状态放到一个状态树里，全局公用来解决的。
```
而mobx维护了多个状态树，每个状态树相互独立，通过import或 Provider + inject将状态注入至组件。

使用redux、useContext时，状态树发送变动，所有依赖状态树的组件更新，好处是使用方便，任何组件都可以直接获取到整个组件树，（常见的做法还是只会把一些全局状态放到redux中维护），不好的地方在于组件会发送很多不必要更新。


使用redux、useContext时，状态树发送变动，只会更新使用了此状态的组件，其它组件不会更新。用法上来讲麻烦一点，需要手动往组件里注入状态。
```

### 数据状态的所有变化方便追溯
```
redux、useContext中状态的修改需要发出dispatch，通过触发action来修改。不能直接修改Store，那么可以通过dispatch、action追溯状态的变化。

而Mobx虽然也是遵循了Flux思想，让数据和逻辑单向流动，但是，Mobx底层使用的还是数据劫持（Object.defineProperty / Proxy）。它任然支持直接修改数据并更新视图。
```

### 使用
2、mobx-react成员: inject,observer,Provider

Provider: 顶层提供store的服务，Provider store={store}

inject: 注入Provider提供的store到该组件的props中，组件内部使用

inject 是一个高阶组件 高阶组件返回的是组件，作用在包装组件