##### Vue-router跳转和location.href有什么区别
```text
答：使用location.href='/url'来跳转，简单方便，但是刷新了页面；
   使用history.pushState('/url')，无刷新页面，静态跳转；
   
引进router，然后使用router.push('/url')来跳转，使用了diff算法，实现了按需加载，减少了dom的消耗。
其实使用router跳转和使用history.pushState()没什么差别的，因为vue-router就是用了history.pushState()，尤其是在history模式下。
```

#### router 和 route 的区别
router 是VueRouter的一个对象，通过Vue.use(VueRouter)和VueRouter构造函数的到的一个router对象
route是一个跳转路由对象，每一个路由都会有一个router对象，是一个局部的对象，可以获取对应的name、path、params、query等

