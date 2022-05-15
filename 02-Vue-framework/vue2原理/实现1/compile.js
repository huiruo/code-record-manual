// 我们要实现一个专门用来配合Complie类的工具对象

// 先只处理文本和输入框的情况
const CompileUtil = {
  /*
  text(node, vm, expr) { // 文本处理
    let updateFn = this.updater['textUpdater'];
    // 用处理好的节点和内容进行编译
    updateFn && updateFn(node, value)
  },
  */
  /*
  model(node, vm, expr) { // 输入框处理
    let updateFn = this.updater['modelUpdater'];
    // 用处理好的节点和内容进行编译
    updateFn && updateFn(node, value);
  },
  */
  setVal(vm, expr, value) {
    console.log('setVal1----->', vm)
    console.log('setVal2----->', value)
    expr = expr.split('.');
    return expr.reduce((prev, next, currentIndex) => {
      if (currentIndex === expr.length - 1) {
        return prev[next] = value;
      }
      return prev[next];
    }, vm.$data);
  },
  model(node, vm, expr) { // 输入框处理
    let updateFn = this.updater['modelUpdater'];
    // 添加watcher start
    // 添加watcher start
    new Watcher(vm, expr, (newValue) => {
      // 当值变化后会调用cb 将新的值传递过来 
      updateFn && updateFn(node, newValue);
    });
    // 添加watcher end
    // 添加watcher end
    // 监听输入事件
    node.addEventListener('input', (e) => {
      let newValue = e.target.value;
      // 监听输入事件将输入的内容设置到对应数据上
      this.setVal(vm, expr, newValue)
    });
    // 这里应该加一个监控 数据变化了 应该调用这个watch的callback 
    updateFn && updateFn(node, this.getVal(vm, expr));
  },
  updater: {
    // 文本更新
    textUpdater(node, value) {
      node.textContent = value
    },
    // 输入框更新
    modelUpdater(node, value) {
      node.value = value;
    }
  },
  //
  text(node, vm, expr) { // 文本处理
    let updateFn = this.updater['textUpdater'];
    // 文本比较特殊 expr可能是'{{message.a}} {{b}}'
    // 调用getTextVal方法去取到对应的结果
    let value = this.getTextVal(vm, expr);
    updateFn && updateFn(node, value)
    // 添加watcher start
    // 添加watcher start
    expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
      new Watcher(vm, arguments[1], (newValue) => {
        // 如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
        updateFn && updateFn(node, this.getTextVal(vm, expr));
      });
    })
    // 添加watcher end
    // 添加watcher end
  },
  getTextVal(vm, expr) { // 获取编译文本后的结果
    return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
      // 依次去去数据对应的值
      return this.getVal(vm, arguments[1]);
    })
  },
  getVal(vm, expr) { // 获取实例上对应的数据
    expr = expr.split('.'); // {{message.a}} [message,a] 实现依次取值
    // vm.$data.message => vm.$data.message.a
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  }
}



class Compile {
  constructor(el, vm) {
    // 看看传递的元素是不是DOM,不是DOM我就来获取一下~
    console.log('Compile=====>')
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    if (this.el) {
      // 如果这个元素能获取到 我们才开始编译
      // 1.先把这些真实的DOM移入到内存中 fragment (性能优化)
      let fragment = this.node2fragment(this.el);
      // 2.编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
      this.compile(fragment);
      // 3.把编译号的fragment在塞回到页面里去
      this.el.appendChild(fragment);
    }
  }
  /* 专门写一些辅助的方法 */
  isElementNode(node) {
    return node.nodeType === 1;
  }
  /*辅助的方法*/
  // 是不是指令
  isDirective(name) {
    return name.includes('v-');
  }

  /* 核心的方法 */
  compileElement(node) {
    // 带v-model v-text 
    let attrs = node.attributes; // 取出当前节点的属性
    Array.from(attrs).forEach(attr => {
      // 判断属性名字是不是包含v-model 
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        // 取到对应的值放到节点中
        let expr = attr.value;
        let [, type] = attrName.split('-'); // 
        // 调用对应的编译方法 编译哪个节点,用数据替换掉表达式
        CompileUtil[type](node, this.vm, expr);
      }
    })
  }
  compileText(node) {
    let expr = node.textContent; // 取文本中的内容
    let reg = /\{\{([^}]+)\}\}/g; // {{a}} {{b}} {{c}}
    if (reg.test(expr)) {
      // 调用编译文本的方法 编译哪个节点,用数据替换掉表达式
      CompileUtil['text'](node, this.vm, expr);
    }
  }
  compile(fragment) {
    // 需要递归 每次拿子元素
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        // 是元素节点，还需要继续深入的检查
        // 这里需要编译元素
        this.compileElement(node);
        this.compile(node)
      } else {
        // 文本节点
        // 这里需要编译文本
        this.compileText(node);
      }
    });
  }
  node2fragment(el) { // 需要将el中的内容全部放到内存中
    // 文档碎片 内存中的dom节点
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild);
      // appendChild具有移动性
    }
    return fragment; // 内存中的节点
  }
}
