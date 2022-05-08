
/*
* replace() 方法返回一个由替换值（replacement）替换部分或所有的模式（pattern）匹配项后的新字符串。
* 模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。如果pattern是字符串，则仅替换第一个匹配项。
* 原字符串不会改变。
* */
// 替换空格
let str = "  天气真好    ,太幸福了  ";
// \s表示空白符，+表示多个空白符
let strNew = str.replace(/\s+/g, "");
console.log(`str:${strNew},old:${str}`);


/*
*
* */
//所有的h都替换成S
let str2="HhpphH";
// i是忽略大小写，g是全局
let str2New=str2.replace(/[h]/gi,"S");
console.log(`${str2New}`); // SSppSS

// 正则表达式用对象的方式
let reg = new RegExp(/[h]/gi);
let str3 = "HhpphH";
let str3New = str3.replace(reg, "S");
console.log(`${str3New}`); // SSppSS

