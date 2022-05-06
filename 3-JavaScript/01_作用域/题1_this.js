/*
函数中的this值：

1.函数作为构造函数，并用new来创建实例时，this为创建的实例，且构造函数中的原型链中的this也是创建的实例
2.函数作为对象的属性，并且以对象的属性进行调用时,this为该对象
3.函数作为对象的属性，但是调用时是将其赋值给一个变量，然后再执行，那么就是作为普通函数，this值为window对象
4.函数作为普通函数（即不作为构造函数），然后在全局环境下进行调用时，this指的时window
5.使用apply,call进行作用域变换时，this指的为传入的参数。
* */
var length = 10;

function fn(){
    console.log(this.length)
}

var obj = {
    length: 5,
    callApi:function (fn){
        console.log('test1: ',this.length) // test:  5 这里匿名函数作为对象的属性被调用，所以this为obj
        console.log('test2: ',arguments[0])

        fn()  // 这里等于fn()作为普通函数被调用，所以this为window,所以为10

        // /这里arguments为类数组，它的属性名为下标，可以理解为是一个以数字
        // 为属性名的对象，那么arguments[0]中的this就指向arguments,而arguments本身具有length属性，表示参数的个数
        arguments[0]()
    }
}

obj.callApi(fn,3)

function fnTest(){
    // 如果在浏览器中指向浏览器中 this
    console.log('fnTest this:',this)
}

fnTest()