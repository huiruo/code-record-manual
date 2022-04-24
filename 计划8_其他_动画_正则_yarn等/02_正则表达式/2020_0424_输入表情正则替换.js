//表情emoji 限制
const emojiReg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
let customerReviewsFilter = this.customerReviews
if (emojiReg.test(this.customerReviews)) {
  // console.log('输入暂不支持表情,过滤')
  customerReviewsFilter = this.customerReviews.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '')
  // console.log('customerReviewsFilter__', customerReviewsFilter)
}