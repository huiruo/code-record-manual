### 直观
```js
        <div class="pic-container" :class="{ noMoments :profilePic.length===0}">
        </div>
```
//常用class使用方式：
<div class="container" :class='{forNorecode:couponList.length===0}'></div>

```js
// 1.最简单的绑定
:class="{active: isActive }"

// 2.绑定并判断多个
// 2.1第一种（用逗号隔开）
:class="{ 'active': isActive, 'sort': isSort }"
//2.2第二种（放在data里面）
//也可以把后面绑定的对象写在一个变量放在data里面，可以变成下面这样
:class="classObject"
data() {
  return {
    classObject:{ active: true, sort:false }
  }
}


// 3.数组方法
:class="[isActive,isSort]"

//3.1数组与三元运算符结合判断选择需要的class
:class="[isActive?'active':'']"
或者
:class="[isActive==1?'active':'']"
或者
:class="[isActive==index?'active':'']"
或者
:class="[isActive==index?'active':'otherActiveClass']"
```


### :style的使用
```js
<p :style="{fontFamily:arr.conFontFamily,color:arr.conFontColor,backgroundColor:arr.conBgColor}">{{con.title}}</p>
```
