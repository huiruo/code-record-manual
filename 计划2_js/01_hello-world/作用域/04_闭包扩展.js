/*
* 知识点扩展
* */
console.log("分割线：知识点扩展2----->")
setTimeout(function() {
    console.log("==a",a);
}, 0);

var a = 10;

console.log("===b",b);
console.log("=====fn_AA",fn_AA);

var b = 20;

function fn_AA() {
    setTimeout(function() {
        console.log('setTImeout 10ms.');
    }, 10);
}

fn_AA.toString = function() {
    return 30;
}

console.log("====fn_AA",fn_AA);

setTimeout(function() {
    console.log('setTimeout 20ms.');
}, 20);

fn_AA();
/*打印：
===b undefined

=====fn_AA ƒ fn_AA() {
    setTimeout(function() {
        console.log('setTImeout 10ms.');
    }, 10);
}
====fn_AA ƒ 30

==a 10
setTImeout 10ms.
*/