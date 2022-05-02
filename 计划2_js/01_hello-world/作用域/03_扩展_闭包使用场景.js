/*
* 1.模仿块级作用域
所谓块级作用域就是指在循环中定义的变量，一旦循环结束，变量也随之销毁，它的作用范围只在这一小块。而在JavaScript中没有这样的块级作用域，
由于JavaScript不会告诉你变量是否已经被声明，所以容易造成命名冲突，如果在全局环境定义的变量，就会污染全局环境，
因此可以利用闭包的特性来模仿块级作用域。
*
* 这个例子闭包就是那个匿名函数，这个闭包可以当函数testFn内部的活动变量，又能保证自己内部的变量在自执行后直接销毁。
* 这种写法经常用在全局环境中，可以避免添加太多全局变量和全局函数，特别是多人合作开发的时候可以减少因此产生的命名冲突等，避免污染全局环境。
* */

function testFn(num) {
    (function(){
        for(var i = 0; i < num.length; i++){
            num++
        }
    }).call() //声明一个函数立即调用以后，浏览器刷新页面会报错，可以用一个小括号把整段函数包起来。
    console.log(i)//undefined
}

/*
* 储存变量
* 闭包的另一个特点是可以保存外部函数的变量，内部函数保留了对外部函数的活动变量的引用，所以变量不会被释放。
* */
function testFn2(){
    var a = 1
    return function(){
            return a
        }
}
var d = testFn2()
console.log('例子2：',d())


/*
* #### 3.封装私有变量
* 我们可以把函数当作一个范围，函数内部的变量就是私有变量，在外部无法引用，但是我们可以通过闭包的特点来访问私有变量。
* */

var person = function(){
    //变量作用域为函数内部，外部无法访问
    var name = "default";
    return {
        getName : function(){
            return name;
        },
        setName : function(newName){
            name = newName;
        }
    }
}();
console.log('封装私有变量:',person.name);//直接访问，结果为undefined
console.log('封装私有变量:',person.getName()); // default
person.setName("abruzzi");
console.log('封装私有变量:',person.getName()); // abruzzi

/*
* #### 闭包可以让一个变量长期驻扎在内存中，避免全局变量的污染
* */
var res = (function() {
    var count = 29;
    return function add() {
        // return count++;
        console.log(count);
        count++;
    }
})();
console.log(res());
console.log(res());