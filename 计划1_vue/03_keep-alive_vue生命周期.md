# include 使该标签作用于所有name属性的值跟此标签 include的属性值一致的vue页面
# exclude 使该标签不作用于所有name属性的值跟此标签 exclude的属性值一致的vue页面

include 使该标签作用于所有name属性的值跟此标签 include的属性值一致的vue页面
exclude 使该标签不作用于所有name属性的值跟此标签 exclude的属性值一致的vue页面
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
## 实例：
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
## 注意：activated,deactivated这两个生命周期函数一定是要在使用了keep-alive组件后才会有的，否则则不存在。
## 注意2：exclude不是用 route的name；而是组件的name;
```
注意一定要给需要缓存的组件都写name属性的值。我一开始还以为是路由的name值，后来发现搞错了
```

当引入keep-alive的时候，页面第一次进入，钩子的触发顺序created-> mounted-> activated，退出时触发deactivated。
当再次进入（前进或者后退）时，只触发activated。

