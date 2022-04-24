
# 遍历for
```
      for (let i = 0; i < this.row.length; i++) {
        let el = this.row[i];
        console.log("el", el);
      }
```

# 升序
```
this.row.sort((a, b) => a.index - b.index);
```

# 降序
```
console.log(obj.sort((a, b) => b.age - a.age)) // {age: 48},{age: 24},{age: 12} 这样倒叙
```
## 总结
```
//数组
let arrs = [6, 9, 2, 5]
console.log(arrs.sort((a, b) => a - b)) //[2, 5, 6, 9]
console.log(arrs.sort((a, b) => b - a)) // [9, 6, 5, 2]
```
