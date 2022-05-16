
/*
* substr 从起始索引号提取字符串中指定数目的字符。
*
* substr 与substring的不同之处是：
substr（a，b），可以从下标为a的位置开始截取，一直截取到下标为b的位置，（取头取尾）；
而substring（a，b），是从下标为a的位置开始截取，截取到下标为b-1的位置，（取头取不到尾）。
* */

/*
* substring
* */
const str = "Hello world!"

console.log('substring 1:', str.substring(3)) // lo world!
//因为indexEnd为默认，所以从下标3开始截取，后面的全部截取
console.log('substring 2:', str.substring(3, 7)) // lo w
// indexStart为3，所以从三开始取，取到'l'
// indexEnd为7，所以取到第六位（注意：是第六位），'w'
// 所以输出为'lo w'

/*
* slice 和 substring 的差别在于slice的参数可以是负数，而substring不行。
* start	要抽取的片断的起始下标。如果是负数，则该参数规定的是从字符串的尾部开始算起的位置。
* 也就是说，-1 指字符串的最后一个字符，-2 指倒数第二个字符，以此类推。
*
* end 紧接着要抽取的片段的结尾的下标。若未指定此参数，则要提取的子串包括 start 到原字符串结尾的字符串。
* 如果该参数是负数，那么它规定的是从字符串的尾部开始算起的位置。
* */
const str3 = "Hello world!"
console.log('slice 1:', str3.slice(3)) // lo world!!
console.log('slice 2:', str3.slice(3, 7)) // lo w
console.log('str3:', str3)

/*
substr 已经不建议使用：
此示例，只有前面提取字符的位置（即start），后面的length则没有填，
所以从第3个开始后面的所有都能截取得到
* */
console.log('substr1:', str.substr(3))
// 输出lo world！
console.log('substr1_test:', str.substr(1))
// substr1_test: ello world!
console.log('substr2', str.substr(3, 7))
// lo worl


