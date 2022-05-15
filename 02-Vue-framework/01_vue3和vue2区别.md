### vue3与vue2响应式的区别
##### 1.vue2响应式
```text
1.数据在data中注册，编译时直接将data中的所有数据绑定监听
2.利用Object.defineProperyty()监听数据的get和set
3.用Observe,Dep,Watcher三个类实现依赖收集

缺点：对于在html中未使用的数据也设置了监听，需要对每一个基本数据类型都要设置劫持，defineProperty监听不到数组/对象内部变化，同时多次调用observe函数进行递归，性能不高。
```
2.vue3响应式
```text
1.利用reactive注册响应式对象，对函数返回值操作
2.利用Proxy劫持数据的get,set,deleteProperty,has,own
3.利用WeakMap,Map,Set来实现依赖收集

缺点：使用大量ES6新增特性，旧版本浏览器兼容性差。
```
Proxy 和 Reflect是ES6新增的两个类，Proxy相比Object.defineProperty更加好用，解决了后者不能监听数组改变的缺点，并且还支持劫持整个对象,并返回一个新对象,不管是操作便利程度还是底层功能上都远强于Object.defineProperty，Reflect的作用是可以拿到Object内部的方法，并且在操作对象出错时返回false不会报错。

### 路由方面
1.需要安装 router4
2.
```js
我们可以导入它并Vue.use(router)，但这在Vue3中不一样。
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```
vue2
```js
import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import { initMutual } from "./utils/PCmutual.js";
import './index.less'

Vue.config.productionTip = false
Vue.prototype.axios = axios
initMutual();
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

vue3创建

createWebHashHistory hash 路由

createWebHistory history 路由

createMemoryHistory 带缓存 history 路由
```js
const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes
})
export default router
```
vue2
```js
import VueRouter from 'vue-router'
const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
```


### 
```js

createApp(App).use(router).mount('#app')

```

```js
import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import { initMutual } from "./utils/PCmutual.js";
import './registerServiceWorker'
import './index.less'

Vue.config.productionTip = false
// Vue.prototype.$axios = axios
Vue.prototype.axios = axios
initMutual();
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```


### template 不同
不同在于数据获取Vue3中的反应数据（Reactive Data）是包含在一个反应状态（Reactive State）变量中。— 所以我们需要访问这个反应状态来获取数据值。
```js
<template>
  <div class='form-element'>
    <h2> {{ state.title }} </h2>
    <input
     type='text'
     v-model='state.username'
     placeholder='Username'
    />
    
    <input
     type='password'
     v-model='state.password'
     placeholder='Password'
    />

    <button @click='login'>
      Submit
    </button>
    <p> 
      Values: {{ state.username + ' ' + state.password }}
    </p>
  </div>
</template>
```

### 建立数据 data
使用以下三步来建立反应性数据:

1.从vue引入reactive
2.使用reactive()方法来声名我们的数据为反应性数据
3.使用setup()方法来返回我们的反应性数据，从而我们的template可以获取这些反应性数据
```js
import { reactive } from 'vue'

export default {
  props: {
    title: String
  },
  setup () {
    const state = reactive({
      username: '',
      password: ''
    })

    return { state }
  }
}
这里构造的反应性数据就可以被template使用，可以通过state.username和state.password获得数据的值。
```
### Vue2 对比 Vue3的 methods 编写
Vue3 的合成型API里面的setup()方法也是可以用来操控methods的。创建声名方法其实和声名数据状态是一样的。— 我们需要先声名一个方法然后在setup()方法中返回(return)， 这样我们的组件内就可以调用这个方法了。
```js
export default {
  props: {
    title: String
  },
  setup () {
    const state = reactive({
      username: '',
      password: ''
    })

    const login = () => {
      // 登陆方法
    }
    return { 
      login,
      state
    }
  }
}
```

### 生命周期钩子 — Lifecyle Hooks
在 Vue2，我们可以直接在组件属性中调用Vue的生命周期的钩子。
```js
export default {
  props: {
    title: String
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  mounted () {
    console.log('组件已挂载')
  },
  methods: {
    login () {
      // login method
    }
  }
}
```
现在 Vue3 的合成型API里面的setup()方法可以包含了基本所有东西。生命周期的钩子就是其中之一！
setup()方法里面使用onMounted挂载的钩子
```js
import { reactive, onMounted } from 'vue'

export default {
  props: {
    title: String
  },
  setup () {
    // ..

    onMounted(() => {
      console.log('组件已挂载')
    })

    // ...
  }
}
```

### 计算属性 - Computed
在 Vue2 中实现，我们只需要在组件内的选项属性中添加即可
```js
export default {
  // .. 
  computed: {
    lowerCaseUsername () {
      return this.username.toLowerCase()
    }
  }
}
```
Vue3 的设计模式给予开发者们按需引入需要使用的依赖包。这样一来就不需要多余的引用导致性能或者打包后太大的问题。
使用方式就和反应性数据（reactive data）一样，在state中加入一个计算属性:
```js
import { reactive, onMounted, computed } from 'vue'

export default {
  props: {
    title: String
  },
  setup () {
    const state = reactive({
      username: '',
      password: '',
      lowerCaseUsername: computed(() => state.username.toLowerCase())
    })

    // ...
}
```

### 接收 Props
接收组件props参数传递这一块为我们带来了Vue2和Vue3之间最大的区别。—this在vue3中与vue2代表着完全不一样的东西。

在 Vue2，this代表的是当前组件，不是某一个特定的属性。所以我们可以直接使用this访问prop属性值。就比如下面的例子在挂载完成后打印处当前传入组件的参数title。
```js
mounted () {
    console.log('title: ' + this.title)
}
```

但是在 Vue3 中，this无法直接拿到props属性，emit events（触发事件）和组件内的其他属性。不过全新的setup()方法可以接收两个参数：
1.props - 不可变的组件参数
2.context - Vue3 暴露出来的属性（emit，slots，attrs）
```js
setup (props) {
    // ...

    onMounted(() => {
      console.log('title: ' + props.title)
    })

    // ...
}
```

### 事件 - Emitting Events
在 Vue2 中自定义事件是非常直接的，但是在 Vue3 的话，我们会有更多的控制的自由度。
举例，现在我们想在点击提交按钮时触发一个login的事件。
在 Vue2 中我们会调用到this.$emit然后传入事件名和参数对象。
```js
login () {
      this.$emit('login', {
        username: this.username,
        password: this.password
      })
}
```
但是在 Vue3中，我们刚刚说过this已经不是和vue2代表着这个组件了，所以我们需要不一样的自定义事件的方式
在setup()中的第二个参数content对象中就有emit，这个是和this.$emit是一样的。那么我们只要在setup()接收第二个参数中使用分解对象法取出emit就可以在setup方法中随意使用了。
```js
setup (props, { emit }) {
    // ...

    const login = () => {
      emit('login', {
        username: state.username,
        password: state.password
      })
    }

    // ...
}
```

### 总结
只是有一些属性获取方式和声名和定义方式稍微变了
全新的合成式API（Composition API）可以提升代码的解耦程度 —— 特别是大型的前端应用，效果会更加明显。还有就是按需引用的有了更细微的可控性，让项目的性能和打包大小有更好的控制。
vue2 代码
```js
<template>
  <div class='form-element'>
    <h2> {{ title }} </h2>
    <input type='text' v-model='username' placeholder='Username' />
    
    <input type='password' v-model='password' placeholder='Password' />

    <button @click='login'>
      Submit
    </button>
    <p> 
      Values: {{ username + ' ' + password }}
    </p>
  </div>
</template>
<script>
export default {
  props: {
    title: String
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  mounted () {
    console.log('title: ' + this.title)
  },
  computed: {
    lowerCaseUsername () {
      return this.username.toLowerCase()
    }
  },
  methods: {
    login () {
      this.$emit('login', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>
```

Vue3
```js
<template>
  <div class='form-element'>
    <h2> {{ state.title }} </h2>
    <input type='text' v-model='state.username' placeholder='Username' />
    
    <input type='password' v-model='state.password' placeholder='Password' />

    <button @click='login'>
      Submit
    </button>
    <p> 
      Values: {{ state.username + ' ' + state.password }}
    </p>
  </div>
</template>
<script>
import { reactive, onMounted, computed } from 'vue'

export default {
  props: {
    title: String
  },
  setup (props, { emit }) {
    const state = reactive({
      username: '',
      password: '',
      lowerCaseUsername: computed(() => state.username.toLowerCase())
    })

    onMounted(() => {
      console.log('title: ' + props.title)
    })

    const login = () => {
      emit('login', {
        username: state.username,
        password: state.password
      })
    }

    return { 
      login,
      state
    }
  }
}
</script>
```