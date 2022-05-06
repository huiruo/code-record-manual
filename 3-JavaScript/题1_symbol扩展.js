/*
用处1：symbol的值肯定是唯一的，可以用来解决命名冲突问题
*/
let test1 = Symbol("ack");
console.log("test1:", test1); // Symbol(test1)
console.log(typeof test1); // Symbol;

//看下面的比较
let test2 = Symbol("ack"); // false

console.log(test1 === test2); //false 表示两个变量不一样


/*
用处2：Symbol可以当作对象的属性名
1.Symbol值作为对象的属性名时，不能使用点运算符
2.如果要访问Symbol属性对应的值，需要使用中括号[]
* */
const key3 = Symbol('key3')
const testObj = {
    key1:"val1",
    key2:'val2',
    [key3]:"val3"
}

console.log('testObj:',testObj)
console.log('testObj_key2:',testObj[key3])

// symbol属性不能被for...in获取
for(let loopVal in testObj){
    console.log('loopVal:',loopVal)
}

console.log('Object.keys:',Object.keys(testObj)) // [ 'key1', 'key2' ]
console.log('stringify:',JSON.stringify(testObj)) // {"key1":"val1","key2":"val2"}
