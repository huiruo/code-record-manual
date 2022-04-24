
### 两者之间最主要的区别就是Object.keys( )不会走原型链，而for in 会走原型链；
```
Object.prototype.test = ‘test';

let obj= {
    a:1,
    b:2,
}
//Object.keys不会输出原型链中的数据；
console.log(Object.keys(obj))
// ["a", "b"]

for(let key in obj){
    console.log(key)
}
// a
// b
// test　　　　//for in 会把原型链中test 输出
```

### 区别2：
一个返回数组：Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组

一个数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 。
```
      const data = {
        bannerUrl,
        type,
        targetObject,
        showByFunLevel,
        showType,
        title,
        sharedSubtitle,
        sharedIconUrl,
        pushSwitch, //是否推送
        showPosition: showposArr.join(","),
        startDateTime: selectedTime[0],
        endDateTime: selectedTime[1],
        pushTime //条件
      };
      for (let item in data) {
        data[item] = encodeURIComponent(data[item]);
      }
```
