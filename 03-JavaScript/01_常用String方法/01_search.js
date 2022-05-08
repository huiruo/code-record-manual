
/*
* str.search(regexp)
* regexp 一个正则表达式（regular expression）对象。如果传入一个非正则表达式对象 regexp，则会使用 new RegExp(regexp) 隐式地将其转换为正则表达式对象。
*
* 返回正则表达式在字符串中首次匹配项的索引;否则，返回 -1。
* * */
const str = "hey JudE";
const re = /[A-Z]/g;
console.log(str.search(re)); // returns 4
console.log(str[str.search(re)])