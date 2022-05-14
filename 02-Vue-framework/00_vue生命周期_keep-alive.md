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

