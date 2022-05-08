
/*
* 执行一个检索，用来查看正则表达式与指定的字符串是否匹配。返回 true 或 false
* */

const text = "000-00-0000";
const pattern = /\d{3}-\d{2}-\d{4}/;
if (pattern.test(text)){
    console.log("The pattern was matched.");
}
