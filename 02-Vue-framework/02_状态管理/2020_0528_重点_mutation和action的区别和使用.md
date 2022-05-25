## 01.mutations 类似于事件，用于提交 Vuex 中的状态 state
```
Mutation：专注于修改State，理论上是修改State的唯一途径。
Action：业务代码、异步请求。
```

## 02.action 和 mutations 也很类似，主要的区别在于mutations 只能是同步操作,action 可以包含异步操作，而且可以通过 action 来提交 mutations
```text
mutations 有一个固有参数 state，接收的是 Vuex 中的 state 对象

action 也有一个固有参数 context，但是 context 是 state 的父级，包含 state、getters

Vuex 的仓库是 store.js，将 axios 引入，并在 action 添加新的方法

分发调用action：

this.$store.dispatch('action中的函数名'，发送到action中的数据)

在组件中提交 Mutation：
this.$store.commit(“mutation函数名”，发送到mutation中的数据)
```

## 使用：01.在action中提交mutation ：
```javaScript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {    //官方给出的指定对象, 此处context可以理解为store对象
      context.commit('increment');
    }
  }
})
```

```javaScript
// 第一种写法简写形式
　　const actions = {
　　　　action的函数名({commit}) { 
　　　　　　commit(“mutation函数名”, value);   //调用mutation中的函数
　　　　　　//此处value可以是对象,可以是固定值等
　　　　}
　　}
　　// 第二种形式
　　const actions = {
　　　　action中的函数名(context) {
　　　　　　//context 官方给出的指定对象, 此处context可以理解为store对象
　　　　　　context.commit(“mutation函数名”, value);     //调用mutation中的函数
　　　　}
　　}
```

## 异步active
```javaScript
async login3({ commit }, value) {
  const result = await getInfo()
  console.log("getInfo:", result)
  return new Promise((resolve, reject)=>{
            // axios.post(`${INTERFACE.SUBMIT_INFO}/${result.num}/products`, {...params}).then(data => {
    //   resolve(data)
    resolve(data) 
  }).catch((err) => {
    console.log('login2错误')
  })
},
```
