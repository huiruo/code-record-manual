
/*
* #### 作用域
函数作用域是在函数声明的时候就已经确定了，而函数执行上下文是在函数调用时创建的。
假如一个函数被调用多次，那么它就会创建多个函数执行上下文，但是函数作用域显然不会跟着函数被调用的次数而发生什么变化。

JavaScript虽然是解释执行，但也不是按部就班逐句解释执行的，在真正解释执行之前，JavaScript解释器会预解析代码，将变量、函数声明部分提前解释。
* */
console.log('testA:',testA); //undefined
var testA=3;
console.log('testA2:',testA); //3
try {
    console.log(testB); //Uncaught ReferenceError: b is not defined
}catch (e){
    console.log('e',e)
}

/*
* #### 什么是作用域链
在JS引擎中，通过标识符查找标识符的值，会从当前作用域向上查找，直到作用域找到第一个匹配的标识符位置。就是JS的作用域链。
* */
var testB = 1;
function fn1 () {
    var testB = 2;
    function fn2 () {
        var testB = 3;
        console.log('log1:',testB);
    }
    fn2 ();
}
fn1();
// log1: 3
// console.log(a) 语句中，JS在查找 a变量标识符的值的时候，会从 fn2 内部向外部函数查找变量声明，它发现fn2内部就已经有了a变量，那么它就不会继续查找了。那么最终结果也就会打印3了。

/*
* #### 3.函数作用域
* 每个函数都有自己的执行环境，当执行流进入一个函数的时候，函数的环境会被推入一个函数栈中，而在函数执行完毕后执行环境出栈并被销毁，保存在其中的所有变量和函数定义随之销毁，
* 控制权返回到之前的执行环境中，全局的执行环境在应用程序退出（浏览器关闭）才会被销毁。

嵌套函数作用域：在外层函数中，嵌套一个内层函数，那么这个内层函数可以向上访问到外层函数中的变量。
* */
function outerFn () {
    var thing = '吃早餐';
    function innerFn () {
        console.log('函数作用域:',thing);
    }
    innerFn();
}
outerFn();  // 吃早餐

/*
* #### 3-2.既然内层函数可以访问到外层函数的变量，那如果把内层函数return出来会怎样？
* */

function outerFn2 () {
    var thing = '吃早餐';
    function innerFn2 () {
        console.log('函数作用域2：',thing);
        return thing
    }

    return innerFn2();
}

var foo = outerFn2();
console.log(outerFn2());  // 吃早餐
console.log(foo);  // 吃早餐
// 前面提到，函数执行完后，函数作用域的变量就会被垃圾回收。而这段代码看出当返回了一个访问了外部函数变量的内部函数，最后外部函数的变量得以保存。
// 这种当变量存在的函数已经执行结束，但扔可以再次被访问到的方式就是“闭包”。