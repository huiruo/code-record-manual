function Compile(vm) {
  console.log('step2.Compile')
  this.vm = vm;
  this.el = vm.$el;
  this.fragment = null;
  this.init();
}

Compile.prototype = {
  init: function () {
    console.log('step2.1.Compile.init')
    this.fragment = this.nodeFragment(this.el);
    console.log('step2.1.Compile.nodeFragment:',this.fragment)
    // #document-fragment
    this.compileNode(this.fragment);
    this.el.appendChild(this.fragment); //解析完成添加到元素中
  },
  nodeFragment: function (el) {
    const fragment = document.createDocumentFragment();
    let child = el.firstChild;
    //将子节点，全部移动文档片段里
    while (child) {
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  },
  compileNode: function (fragment) {
    let childNodes = fragment.childNodes;
    [...childNodes].forEach(node => {

      if (this.isElementNode(node)) {
        this.compile(node);
      }

      let reg = /\{\{(.*)\}\}/;
      let text = node.textContent;

      if (reg.test(text)) {
        let prop = reg.exec(text)[1];
        this.compileText(node, prop); //替换模板
      }

      //编译子节点
      if (node.childNodes && node.childNodes.length) {
        this.compileNode(node);
      }
    });
  },
  compile: function (node) {
    let nodeAttrs = node.attributes;
    [...nodeAttrs].forEach(attr => {
      let name = attr.name;
      if (this.isDirective(name)) {
        let value = attr.value;
        if (name === "v-model") {
          this.compileModel(node, value);
        }
      }
    });
  },
  compileModel: function (node, prop) {
    let val = this.vm.$data[prop];
    this.updateModel(node, val);
    // 添加watcher start
    // 添加watcher start
    new Watcher(this.vm, prop, (value) => {
      // 当值变化后会调用cb 将新的值传递过来
      this.updateModel(node, value);
    });

    node.addEventListener('input', e => {
      let newValue = e.target.value;
      if (val === newValue) {
        return;
      }
      this.vm.$data[prop] = newValue;
    });
  },
  compileText: function (node, prop) {
    // // 取文本中的内容
    let text = this.vm.$data[prop];
    this.updateView(node, text);
    // 添加watcher start
    // 添加watcher start
    new Watcher(this.vm, prop, (value) => {
      // 当值变化后会调用cb 将新的值传递过来
      this.updateView(node, value);
    });
  },

  updateModel: function(node, value) {
    node.value = typeof value == 'undefined' ? '' : value;
  },
  updateView: function (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  },
  // 是不是指令
  isDirective: function (attr) {
    return attr.indexOf('v-') !== -1;
  },

  isElementNode: function (node) {
    return node.nodeType === 1;
  },
  isTextNode: function (node) {
    return node.nodeType === 3;
  }
}