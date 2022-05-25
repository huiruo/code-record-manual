

## 01.导入组件

```js
<script>
import TabContent from "./tabContent";
export default {
  name: "Index",
  components: {
    TabContent
  },
  data() {
    return {
      input: ""
    };
  }
};
</script>
```



## 02.导入css

```js
<style scoped>
@import "../../static/css/index.css";
</style>
```

