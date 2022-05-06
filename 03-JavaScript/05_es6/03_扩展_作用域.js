
/*
* Object.call(this,obj1,obj2,obj3) //参数都列出来
* Object.apply(this,arguments) //传递给函数的是参数数组
* */

function FnA(){
    this.flag = 'A';
    this.tip = function(){
        console.log('log1',this.flag);
    };
}

function FnB(){
    this.flag = 'B';
}

const objA = new FnA();
const objB = new FnB();

objA.tip.apply(objB); //or use: a.tip.call(b);
objA.tip();

const newFun= objA.tip.bind(objB) //产生一个新的函数
newFun()
console.log('a',objA)
//1.无论是a.tip.call(b);和a.tip.apply(b);运行的结果都是弹出B。
//2.从结果中可以看出call和apply都可以让B对象调用A对象的tip方法，并且修改了this的当前作用对象。



/*
* 扩展2：Function.prototype.bind()
* bind() 最简单的用法是创建一个函数
* */
this.x = 9;    // 在浏览器中，this 指向全局的 "window" 对象
const testModule = {
    x: 81,
    getX: function() {
        console.log('this.x',this.x)
        return this.x;
    }
};
testModule.getX(); // 81
const retrieveX = testModule.getX;
console.log('扩展2-1:',testModule.getX())
console.log('扩展2-2:',retrieveX()) //  undefined
// 创建一个新函数，把 'this' 绑定到 module 对象
const boundGetX = retrieveX.bind(testModule);
console.log('扩展2:',boundGetX()); // 81