#### vue生命周期
```
1.beforeCreate(){}在执行的时候，data还有methods都没有被初始化

2.created(){} data还有methods都被初始化好了，如果要调用methods方法或者操作data里面的数据，最早只能在created里面进行操作。

3.beforeMount(){} 表示模板已经在内存中编辑完成了，但是尚未渲染到模板页面中。即页面中的元素，没有被真正的替换过来，只是之前写的一些模板字符串。

4.mounted(){} 表示内存中模板已经真实的挂载到页面中去了，用户可以看到渲染好的界面了

注意这是一个生命周期函数的最后一个函数了，执行完这个函数表示 整个vue实例已经初始化完成了，组件脱离了创建阶段，进入运行阶段。
```

下面是运行期间的两个生命周期函数的钩子：
```
5.beforeUpdate(){}  表示我们的界面还没更新 但是data里面的数据是最新的。即页面尚未和最新的data里面的数据包同步。

6.update(){} 表示页面和data里面的数据已经包吃同步了 都是最新的。

7.beforeDestory(){}  当执行这个生命周期钩子的时候 vue的实例从运行阶段进入销毁阶段 此时实例身上的data 还有 methods处于可用的状态。

8.Destoryed(){} 表示组件已经完全被销毁了 组件中所有的实例方法都是不能用了
```
#### vue3
```javaScript
// 一个组件 正常来说，会触发的几个hock函数，就是onBeforeMount、onMounted
onBeforeMount(() => {
  console.log('组件挂载前onBeforeMount')
})
onMounted(() => {
  console.log('组件挂载后onMounted')
})
// 注意点：就是组件内的数据更新时，会触发这两个hoch函数 onBeforeUpdate、onUpdated
onBeforeUpdate(() => {
  console.log('组件更新前onBeforeUpdate')
})
onUpdated(() => {
  console.log('组件更新后onUpdated')
})
// 注意点：就是此前组件被销毁的时候，会触发以下两个hock函数onBeforeUnmount、onUnmounted
onBeforeUnmount(() => {
  console.log('组件销毁前onBeforeUnmount')
})
onUnmounted(() => {
  console.log('组件销毁后onUnmounted')
})
```

##### 第一次页面加载会触发哪几个钩子?
答：beforeCreate， created， beforeMount， mounted

1.beforeCreate：
2.create
3.mounted
4.beforeUpdate
5.updated
6.beforeDestory
7.destroyed

答：一般 created/beforeMount/mounted 皆可.
(如果你要操作 DOM , 那肯定 mounted 时候才能操作.)


### keep-alive
#### keep-alive平时在哪里使用?原理是什么?
使用keep-alive包裹动态组件时，会对组件进行缓存，避免组件重新创建

使用有两个场景，一个是动态组件，一个是router-view
```
如果不需要缓存，直接返回虚拟节点。

如果需要缓存，就用组件的id和标签名，生成一个key，把当前vnode的instance作为value，存成一个对象。这就是缓存列表

如果设置了最大的缓存数，就删除第0个缓存。新增最新的缓存。

并且给组件添加一个keepAlive变量为true，当组件初始化的时候，不再初始化。
```

- include 使该标签作用于所有name属性的值跟此标签 include的属性值一致的vue页面
- exclude 使该标签不作用于所有name属性的值跟此标签 exclude的属性值一致的vue页面


#### 注意：
- activated,deactivated这两个生命周期函数一定是要在使用了keep-alive组件后才会有的，否则则不存在。
- exclude不是用 route的name；而是组件的name;

注意一定要给需要缓存的组件都写name属性的值。我一开始还以为是路由的name值，后来发现搞错了
当引入keep-alive的时候，页面第一次进入，钩子的触发顺序created-> mounted-> activated，退出时触发deactivated。
当再次进入（前进或者后退）时，只触发activated。
```
使用include/exclude 属性需要给所有vue类的name赋值（注意不是给route的name赋值），否则 include/exclude不生效。
export default {
 name:'a', // include 或 exclude所使用的name
 data () {
 return{
    }
  },
}
```

路由：
```
// 保持 name为a和b的组件
<keep-alive include="a,b">
    <router-view/>
</keep-alive>
```
#### 实例：
```
<keep-alive include="test-keep-alive">
  <!-- 将缓存name为test-keep-alive的组件 -->
  <component></component>
</keep-alive>
 
<keep-alive include="a,b">
  <!-- 将缓存name为a或者b的组件，结合动态组件使用 -->
  <component :is="view"></component>
</keep-alive>
 
<!-- 使用正则表达式，需使用v-bind -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>
 
<!-- 动态判断 -->
<keep-alive :include="includedComponents">
  <router-view></router-view>
</keep-alive>
 
<keep-alive exclude="test-keep-alive">
  <!-- 将不缓存name为test-keep-alive的组件 -->
  <component></component>
</keep-alive>
```

#### vue-router有几种钩子函数?执行流程如何?
钩子函数有三种：

全局守卫

路由守卫

组件守卫

### Vue.use是干什么的?
Vue.use是用来使用插件的。我们可以在插件中扩展全局组件、指令、原型方法等。 会调用install方法将Vue的构建函数默认传入，在插件中可以使用vue，无需依赖vue库

### 组件写name有啥好处?
增加name属性，会在components属性中增加组件本身，实现组件的递归调用。

可以表示组件的具体名称，方便调试和查找对应的组件。

### vue的修饰符有哪些?
```
.stop

.prevent

.capture

.self

.once

.passive

.right

.center

.middle

.alt
```
### 如何理解自定义指令?
在生成ast语法树时，遇到指令会给当前元素添加directives属性

通过genDirectives生成指令代码

在patch前，将指令的钩子提取到cbs中，在patch过程中调用对应的钩子

当执行cbs对应的钩子时，调用对应指令定义方法