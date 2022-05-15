

/*
如何将视图和数据关联起来呢?就是将每个数据和对应的watcher关联起来。当数据变化时让对应的
watcher执行update方法即可！再想想在哪做操作呢？就是我们的set和get!
*/
class Dep {
  constructor() {
    // 订阅的数组
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}

Dep.target = null;