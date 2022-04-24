# 限制两种类型
```
  props: {
    classId: [Number, String],
    default() {
      return 0;
    }
  },
```

# 实战限制Object类型
```
  props: {
    countHistory: {
      type: Number,
      default: 0
    },
    operationRow: {
      type: Object,
      default: () => {
        userId: "";
      }
    }
  },
```

# 实战，限制数组类型
```
row: {
    type: Array,
    default() {
      return [];
    }
}
```

# 一种类型
```
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default() {
        return {};
      }
    }
  },

```


### 其他参考
```js
props:{
      //数组
      imageList:{
        type: Array,
        default: ()=>[
          {imageName:'p1',url: 'http://gplove.top/dog1.png'},
          {imageName:'p2',url: 'http://gplove.top/dog2.png'},
          {imageName:'p3',url: 'http://gplove.top/dog3.png'},
        ]
      },
      //对象
      audio:{
        type: Object,
        default: ()=>{
          return {audioName:'多余的解释.mp3',audioUrl:'http://gplove.top/audio1.mp3'}
        }
      }
    },
}
```

```js
props: {
    array: {
        type: Array,
        default () {
            return []
        }
    },
    object: {
        type: Object,
        default () {
            return {}
        }
    }
}
```
