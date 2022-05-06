



### 01.

该方法允许精确添加或修改对象的属性。

> 通过赋值操作添加的普通属性是可枚举的，能够在属性枚举期间呈现出来（[`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 或 [`Object.keys`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)[ ](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys)方法）， 这些属性的值可以被改变，也可以被[删除](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)。这个方法允许修改默认的额外选项（或配置）。默认情况下，使用 `Object.defineProperty()` 添加的属性值是不可修改的。



## 属性描述符

对象里目前存在的属性描述符有两种主要形式：**数据描述符**和**存取描述符**。

> **数据描述符**是一个具有值的属性，该值可能是可写的，也可能不是可写的。
>
> **存取描述符**是由getter-setter函数对描述的属性。描述符必须是这两种形式之一；不能同时是两者。
>
> 注意：
>
> **如果一个描述符不具有value,writable,get 和 set 任意一个关键字，那么它将被认为是一个数据描述符。如果一个描述符同时有(value或writable)和(get或set)关键字，将会产生一个异常。**
>
> 
>
> **数据描述符和存取描述符均具有**以下可选键值(默认值是在使用Object.defineProperty()定义属性的情况下)：
>
> - `configurable`
>
> 当且仅当该属性的 configurable 为 true 时，该属性`描述符`才能够被改变，同时该属性也能从对应的对象上被删除。**默认为 false**。
>
> - `enumerable`
>
> 当且仅当该属性的`enumerable`为`true`时，该属性才能够出现在对象的枚举属性中。**默认为 false**。
>
> ```js
> 数据描述符同时具有以下可选键值：
> 
> value
> 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
> writable
> 当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。
> 存取描述符同时具有以下可选键值：
> ```
>
> 
>
> ```js
> 存取描述符同时具有以下可选键值：
> 
> get
> 一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入this对象（由于继承关系，这里的this并不一定是定义该属性的对象）。
> 默认为 undefined。
> set
> 一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。
> 默认为 undefined。
> ```
>
> 



### 3.注意

记住，这些选项不一定是自身属性，如果是继承来的也要考虑。为了确认保留这些默认值，你可能要在这之前冻结 [`Object.prototype`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)，明确指定所有的选项，或者通过 [`Object.create(null)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)将[`__proto__`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/__proto__)属性指向[`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)。

```js
// 使用 __proto__
var obj = {};
var descriptor = Object.create(null); // 没有继承的属性
// 默认没有 enumerable，没有 configurable，没有 writable
descriptor.value = 'static';
Object.defineProperty(obj, 'key', descriptor);

// 显式
Object.defineProperty(obj, "key", {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "static"
});

// 循环使用同一对象
function withValue(value) {
  var d = withValue.d || (
    withValue.d = {
      enumerable: false,
      writable: false,
      configurable: false,
      value: null
    }
  );
  d.value = value;
  return d;
}
// ... 并且 ...
Object.defineProperty(obj, "key", withValue("static"));

// 如果 freeze 可用, 防止代码添加或删除对象原型的属性
// （value, get, set, enumerable, writable, configurable）
(Object.freeze||Object)(Object.prototype);
```



### 重点01.创建属性

> 如果对象中不存在指定的属性，`Object.defineProperty()`就创建这个属性。当描述符中省略某些字段时，这些字段将使用它们的默认值。
>
> 拥有布尔值的字段的默认值都是`false`。`value`，`get`和`set`字段的默认值为`undefined`。
>
> 一个没有`get/set/value/writable`定义的属性被称为“通用的”，并被“键入”为一个数据描述符。

```js
var o = {}; // 创建一个新对象

// 在对象中添加一个属性与数据描述符的示例
Object.defineProperty(o, "a", {
  value : 37,
  writable : true,
  enumerable : true,
  configurable : true
});

// 对象o拥有了属性a，值为37

// 在对象中添加一个属性与存取描述符的示例
var bValue;
Object.defineProperty(o, "b", {
  get : function(){
    return bValue;
  },
  set : function(newValue){
    bValue = newValue;
  },
  enumerable : true,
  configurable : true
});

o.b = 38;
// 对象o拥有了属性b，值为38

// o.b的值现在总是与bValue相同，除非重新定义o.b

// 数据描述符和存取描述符不能混合使用
Object.defineProperty(o, "conflict", {
  value: 0x9f91102, 
  get: function() { 
    return 0xdeadbeef; 
  } 
});
// throws a TypeError: value appears only in data descriptors, get appears only in accessor descriptors
```



### 02.[修改属性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Modifying_a_property)

> 如果属性已经存在，`Object.defineProperty()`将尝试根据描述符中的值以及对象当前的配置来修改这个属性。如果旧描述符将其`configurable` 属性设置为`false`，则该属性被认为是“不可配置的”，并且没有属性可以被改变（除了单向改变 writable 为 false）。当属性不可配置时，不能在数据和访问器属性类型之间切换。
>
> 当试图改变不可配置属性（除了`value`和`writable` 属性之外）的值时会抛出[`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError)，除非当前值和新值相同。

- #### Writable 属性

  当`writable`属性设置为`false`时，该属性被称为“不可写”。它不能被重新分配。

  ```js
  var o = {}; // Creates a new object
  
  Object.defineProperty(o, 'a', {
    value: 37,
    writable: false
  });
  
  console.log(o.a); // logs 37
  o.a = 25; // No error thrown
  // (it would throw in strict mode,
  // even if the value had been the same)
  console.log(o.a); // logs 37. The assignment didn't work.
  
  // strict mode
  (function() {
    'use strict';
    var o = {};
    Object.defineProperty(o, 'b', {
      value: 2,
      writable: false
    });
    o.b = 3; // throws TypeError: "b" is read-only
    return o.b; // returns 2 without the line above
  }());
  /*
  如示例所示，试图写入非可写属性不会改变它，也不会引发错误。
  */
  ```

  

- #### Enumerable 特性

   `enumerable`定义了对象的属性是否可以在 [`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 循环和 [`Object.keys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) 中被枚举

  ```js
  var o = {};
  Object.defineProperty(o, "a", { value : 1, enumerable:true });
  Object.defineProperty(o, "b", { value : 2, enumerable:false });
  Object.defineProperty(o, "c", { value : 3 }); // enumerable defaults to false
  o.d = 4; // 如果使用直接赋值的方式创建对象的属性，则这个属性的enumerable为true
  
  for (var i in o) {    
    console.log(i);  
  }
  // 打印 'a' 和 'd' (in undefined order)
  
  Object.keys(o); // ["a", "d"]
  
  o.propertyIsEnumerable('a'); // true
  o.propertyIsEnumerable('b'); // false
  o.propertyIsEnumerable('c'); // false
  ```

  

  - #### Configurable 特性

  `configurable`特性表示对象的属性是否可以被删除，以及除`value`和`writable`特性外的其他特性是否可以被修改。

```js
var o = {};
Object.defineProperty(o, "a", { get : function(){return 1;}, 
                                configurable : false } );

// throws a TypeError
Object.defineProperty(o, "a", {configurable : true}); 
// throws a TypeError
Object.defineProperty(o, "a", {enumerable : true}); 
// throws a TypeError (set was undefined previously) 
Object.defineProperty(o, "a", {set : function(){}}); 
// throws a TypeError (even though the new get does exactly the same thing) 
Object.defineProperty(o, "a", {get : function(){return 1;}});
// throws a TypeError
Object.defineProperty(o, "a", {value : 12});

console.log(o.a); // logs 1
delete o.a; // Nothing happens
console.log(o.a); // logs 1

/*
如果o.a的configurable属性为true，则不会抛出任何错误，并且该属性将在最后被删除。
*/
```

