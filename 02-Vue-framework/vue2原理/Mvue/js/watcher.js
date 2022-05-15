
//观察者的目的就是给需要变化的那个元素增加一个观察者，
// 用新值和老值进行比对,如果数据变化就执行对应的方法

// 在哪里使用watcher?答案肯定是compile呀,给需要重新编译的DOM增加watcher
// 因为要获取老值 所以需要 "数据" 和 "prop"
function Watcher(vm, prop, callback) {
  this.vm = vm;
  this.prop = prop;
  this.callback = callback;
  // 先获取一下老的值 保留起来
  this.value = this.get();
  console.log('watch__',)
}

// 对外暴露的方法，如果值改变就可以调用这个方法来更新
Watcher.prototype.update = function () {
  const value = this.vm.$data[this.prop];
  const oldVal = this.value;
  if (value !== oldVal) {
    this.value = value;
    this.callback(value);
  }
}

// watcher中有个重要的逻辑就是this.get();
// 每个watcher被实例化时都会获取数据从而会调用当前属性的get方法
Watcher.prototype.get = function () {
  Dep.target = this; //储存订阅器
  // 因为属性被监听，这一步会执行监听器里的 get方法
  const value = this.vm.$data[this.prop];
  Dep.target = null;
  return value;
}