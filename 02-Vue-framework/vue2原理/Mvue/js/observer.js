function defineReactive(data, key, value) {
  console.log('defineReactive')
  //递归调用，监听所有属性
  observer(value);
  // 每个变化的数据 都会对应一个数组,这个数组是存放所有更新的操作
  var dep = new Dep();
  Object.defineProperty(data, key, {
    get: function () {
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return value;
    },
    set: function (newVal) {
      if (value !== newVal) {
        value = newVal;
        console.log('defineReactive---->通知订阅器')
        // 通知所有人 数据更新了
        dep.notify(); //通知订阅器
      }
    }
  });
}

function observer(data) {
  if (!data || typeof data !== "object") {
    return;
  }
  // 要将数据 一一劫持 先获取取到data的key和value
  Object.keys(data).forEach(key => {
    // 定义响应式变化
    defineReactive(data, key, data[key]);
  });
}

function Dep() {
  this.subs = [];
}

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub);
}

Dep.prototype.notify = function () {
  this.subs.forEach(sub => {
    sub.update();
  })
}

Dep.target = null;
