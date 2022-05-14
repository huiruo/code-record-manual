```js
// 如果是定时器要在路由干掉
beforeRouteLeave(to, from, next) {
    //**记录滚动写在去使用里面,因为点击回退是不用记录滚动的
    // let wrapperScrollTop = this.$refs.containerMyRef.scrollTop
    // // console.log('containerMyRef---', wrapperScrollTop)
    // this.setScrollTop(wrapperScrollTop)
    // this.timer && clearTimeout(this.timer)
    next()
}
```

```js
this.setCouponMyReList(finalData)
// this.timer = setTimeout(() => {
//   this.$refs.containerMyRef.scrollTop = this.scrollTop
// }, 500)
this.$nextTick(() => {
this.$refs.containerMyRef.scrollTop = this.scrollTop
})
``



