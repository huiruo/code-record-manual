## 
答：vue 双向数据绑定是通过 数据劫持 结合 发布订阅模式的方式来实现的， 也就是说数据和视图同步，数据发生变化，视图跟着变化，视图变化，数据也随之发生改变；
核心：关于VUE双向数据绑定，其核心是 Object.defineProperty()方法。
dɪˈfaɪn  prɒpəti

vue响应式更新，通过过劫持可以精确响应更新,检测到值的改变就会重新渲染(vue 值会立刻改变，但是 DOM 是异步更新的)
关于Vue，当你把一个普通的 JavaScript 对象传给 Vue 实例的data选项，Vue 将遍历此对象所有的属性，并使用Object.defineProperty把这些属性全部转为getter/setter。从而实现响应式。
vue中属性变化,首先触发Object.defineProperty中属性的set监听,执行updateComponent方法(异步),通过vm._render()更新vNode(新旧node对比),最后渲染到html中
```js
//observer:观察者
function observer(obj) {
	if (obj && typeof obj === 'object') {
		for (let key in obj) {
			if (!obj.hasOwnProperty(key)) break;
			defineReactive(obj, key, obj[key]);
		}
	}
}

function defineReactive(obj, key, value) {
	observer(value);
	Object.defineProperty(obj, key, {
		get() {
			return value;
		},
		set(newValue) {
			observer(newValue);
			if (value === newValue) return;
			value = newValue;
		}
	});
}

function $set(data, key, value) {
	defineReactive(data, key, value);
}
```