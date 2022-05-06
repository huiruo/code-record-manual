
#### 1.取数组-->对象
```javaScript
const result = _.get(chartlist, '[0]', {})
console.log("result", result)
```

#### 1.取对象-->数组
```javaScript
const result = _.get(res, 'result.data', [])
```

```javaScript
const result = _.get(res, 'result.data[0]', {})
```
