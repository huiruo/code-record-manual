
/* 什么情况是false
undefined false
null false
布尔值 true是true，false是false
数 +0、-0和NaN都是false，其他都是true
字符串 如果字符串是空的（长度是0）就是false，其他都是true（长度大于等于1）
对象 true
*/

/*
2.使用==时，不同类型的值也可以被看作相等。

我们用下面的表格给大家分析一下不同类型的值用相等运算符比较后的结果。

类型（x）   类型（y） 结果
null    undefined   true
undefined null      true
数       字符串       x == toNumber(y)
字符串     数         toNumber(x) == y
布尔值     任何类型    toNumber(x) == y
任何类型    布尔值     x == toNumber(y)
字符串或数   对象        x == toPrimitive(y)
对象      字符串或数        toPrimitive(x) == y

如果x和y的类型相同，JavaScript会用equals方法比较这两个值或对象。
没有列在这个表格中的其他情况都会返回false。
*/

/*
toNumber返回值如下：
```
值类型    结果
undefined NaN
null      +0
布尔值    如果是true，返回1；如果是false，返回+0
数       数对应的值
*/

console.log('packt' == true);  // false

function testTruthy(val) {
  return val ? console.log('truthy') : console.log('falsy');
}

testTruthy(true); // true
testTruthy(false); // false
testTruthy(new Boolean(false)); // true (object is always true)

testTruthy(''); // false
testTruthy('a'); // true
testTruthy('Packt'); // true
testTruthy(new String('')); // true (object is always true)

testTruthy(1); // true
testTruthy(-1); // true
testTruthy(NaN); // false
testTruthy(new Number(NaN)); // true (object is always true)

testTruthy({}); // true (object is always true)

const obj = { name: 'John' };
testTruthy(obj); // true
testTruthy(obj.name); // true
testTruthy(obj.age); // false (property is undefined)


