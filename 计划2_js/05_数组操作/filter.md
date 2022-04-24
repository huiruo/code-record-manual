
### JS中filter()方法的使用
```
Array.filter(function(currentValue, indedx, arr), thisValue)

var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])


callback:
用来测试数组的每个元素的函数。返回 true 表示该元素通过测试，保留该元素，false 则不保留。它接受以下三个参数：
		element
		数组中当前正在处理的元素。

		index可选
		正在处理的元素在数组中的索引。

		array可选
		调用了 filter 的数组本身。

thisArg可选
执行 callback 时，用于 this 的值。
```
