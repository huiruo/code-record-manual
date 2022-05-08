
/*
* ### 1.正则匹配html
* */
let richText = `<div>test<p><b> </b></p></div>`
let reg = /<([a-z]+?)(?:\s+?[^>]*?)?>\s*?<\/\1>/ig;
while (reg.test(richText)) {
    richText = richText.replace(reg,"");
}
console.log("1.正则匹配html",richText)

/*
* 去除空格
* */
let str = " 546546 4564 46 46 88 88 ";
let strR = str.replace(/\s+/g,"");
console.log('去除空格:',strR);

/*
* 请输入正确的金额,如果有小数点保留后两位
* */
// let input = 12222
let input = 12222.0999
const reg2 = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
if(reg2.test(input)){
    console.log('输入数字合法')
}else {
    console.log('输入不合法')
}

/*
* 取出数字：
* */
const strN = "中国移动:10086,中国联通:10010,中国电信:10000";
const regN=/\d{5}/g;
//通过正则表达式匹配这个字符串
let arrayN=regN.exec(str);
while (arrayN!=null){
    //输出匹配的内容
    console.log(arrayN[0]);
    arrayN=regN.exec(strN);  // 再次匹配
}
console.log('arrayN',arrayN)

// 用math 实现
console.log('取出数字用math实现：',strN.match(regN))

/*
*
*
* */
let sharebyStr = 'lang=en'
let regShare = RegExp(/lang=en/);
if (sharebyStr && sharebyStr.match(regShare)) {
    console.log("带参且带lang=en")
} else {
    console.log("不带参数")
}

/*
//表情emoji 限制
const emojiReg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
let customerReviewsFilter = this.customerReviews
if (emojiReg.test(this.customerReviews)) {
    // console.log('输入暂不支持表情,过滤')
    customerReviewsFilter = this.customerReviews.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '')
    // console.log('customerReviewsFilter__', customerReviewsFilter)
}
* */