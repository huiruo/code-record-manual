## 箭头函数表达式的语法比函数表达式更简洁，并且没有自己的 this，arguments，super 或 new.target 等，也不能用作构造函数。

## 1.普通函数中的 this：this 对象是在运行时基于函数的执行环境绑定的

- 浏览器环境下 this 的值指向 window 对象
- 在事件中，this 指向触发这个事件的对象
- 作为某个对象方法调用时，this 指向该对象。
- 如果 apply、call 或 bind 方法用于调用、创建一个函数，函数内的 this 就是作为参数传入这些方法的对象。

```javascript
function normal() {
  console.log(this); // => { name: 'Object' }
}
var obj = {
  name: "Object",
};
normal.call(obj);
```

- 普通函数被用作构造函数，用 new 关键字构造实例时，this 指向新建的实例。
  在调用函数时使用 new 关键字，this 指向 new 出来的实例对象.(函数内的 this 是一个全新的对象)
  创建一个新的空的对象
  把这个对象链接到原型对象上
  这个对象被绑定为 this
  如果这个函数不返回任何东西，那么就会默认 return this

```javascript
function Normal() {
  console.log(this); // => Normal {}
}
var normal = new Normal();
```

## 2.箭头函数中的 this

没有自己的 this，内部 this 值以为与外部非箭头函数的 this。

```javascript
/*
 * 由于箭头函数的this由外部非箭头函数的this决定，因此，若需要将一个函数作为回调函数去执行，
 * 并且不希望函数中的this发生改变，这时用箭头函数最适合不过。如果是普通函数，则需要用bind()进行this绑定。
 * */
class Contruct {
  constructor(name) {
    this.consName = name;
  }
  arrowLog = () => {
    console.log(this.consName);
  };
  normalLog() {
    console.log(this.consName);
  }
}
const construct = new Contruct("arrow");
setTimeout(construct.arrowLog, 1000); // 1s后 => 'arrow'
setTimeout(construct.normalLog, 1000); // 1s后 => 'undefined'
setTimeout(construct.normalLog.bind(construct), 1000); // 1s后 => 'arrow'
```

## 3.为什么箭头函数不能用作构造函数？

箭头函数本身是存在原型链的，它也有自己的构造函数，但原型链到箭头函数这一环就断了，因为它没有 prototype 属性，没办法连接它的实例的原型链，所以箭头函数就无法作为构造函数。
