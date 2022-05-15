
/*
静态方法:上面这些方法的作用，大部分与 Object 对象的同名方法的作用都是相同的，而且它与 Proxy 对象的方法是一 一对应的。
Reflect.apply(target, thisArg, args)
Reflect.construct(target, args)
Reflect.get(target, name, receiver)
    Reflect.get 方法查找并返回 target 对象的 name 属性，如果没有该属性，则返回 undefined。

Reflect.set(target, name, value, receiver)
    Reflect.set 方法设置 target 对象的 name 属性等于 value。

Reflect.defineProperty(target, name, desc)
Reflect.deleteProperty(target, name)
Reflect.has(target, name)
    'foo' in myObject // true
    // 新写法
    Reflect.has(myObject, 'foo') // true

Reflect.ownKeys(target)
Reflect.isExtensible(target)
Reflect.preventExtensions(target)
Reflect.getOwnPropertyDescriptor(target, name)
Reflect.getPrototypeOf(target)
Reflect.setPrototypeOf(target, prototype)
* */

// 应用1：让 Object 操作都变成函数行为。某些 Object 操作是命令式，比如 name in obj 和 delete obj[name]，而 Reflect.has(obj, name)
// 和 Reflect.deleteProperty(obj, name) 让它们变成了函数行为。
let obj1 = {name:1,test:2}
Reflect.deleteProperty(obj1,'name')
console.log('test1',obj1)

// 应用2：修改某些 Object 方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc) 在无法定义属性时，
// 会抛出一个错误，定义成功时返回修改后的对象。而 Reflect.defineProperty(obj, name, desc) 在定义属性成功时返回 true ，失败时返回 false
/*
/ 老写法
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
* */

// 应用3：Reflect 对象的方法与 Proxy 对象的方法一 一对应，只要是 Proxy 对象的方法，就能在 Reflect对象上找到对应的方法。
// 这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为
// 总可以在 Reflect 上获取默认行为。
const loggedObj = new Proxy(obj1, {
    get(target, name) {
        console.log('get', target, name);
        return Reflect.get(target, name);
    },
    deleteProperty(target, name) {
        console.log('delete' + name);
        return Reflect.deleteProperty(target, name);
    },
    has(target, name) {
        console.log('has' + name);
        return Reflect.has(target, name);
    }
});

// 应用4.Reflect.construct(target, args)
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// new 的写法
let p1 = new Person('webchang', 18);

// Reflect.construct 的写法，两种写法最终效果一样
let p2 = Reflect.construct(Person, ['webchang', 18]);

// 应用5.Reflect.getPrototypeOf(obj)
// Reflect.getPrototypeOf 方法用于读取对象的 __proto__ 属性，对应 Object.getPrototypeOf(obj)。
let p = new Person();

console.log(Object.getPrototypeOf(p) === Person.prototype); // true
console.log(Reflect.getPrototypeOf(p) === Person.prototype);// true



// 应用6.Reflect.setPrototypeOf(obj, newProto)
// Reflect.setPrototypeOf 方法用于设置目标对象的原型（prototype），对应 Object.setPrototypeOf(obj, newProto) 方法。
// 它返回一个布尔值，表示是否设置成功。
let obj = {
    name: 'test'
}

// 旧写法，设置成功会返回修改后的对象
console.log(Object.setPrototypeOf(obj, Array.prototype));

// 新写法，设置成功会返回 true
console.log(Reflect.setPrototypeOf(obj, Array.prototype));
