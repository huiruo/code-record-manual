方法一：main.js 注入

（1）在main.js中写入函数
Vue.prototype.changeData = function (){
  alert('执行成功');
}
（2）在所有组件里可调用函数
this.changeData();


方法二：单独创建一个 .js 文件，用于存放常用函数，并全局引用

（1）写好自己需要的base.js文件
exports.install = function (Vue, options) {
  Vue.prototype.changeData = function (){
    alert('执行成功');
  };
};
（2）main.js 引入并使用

import base from './base'
Vue.use(base);
（3）在所有组件里可调用函数
this.changeData();
