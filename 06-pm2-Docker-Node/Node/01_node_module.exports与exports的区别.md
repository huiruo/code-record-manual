
### Node.js模块里exports与module.exports的区别?
require能看到的只有module.exports这个对象，它是看不到exports对象的
而我们在编写模块时用到的exports对象实际上只是对module.exports的引用


总结：
import会被转化为commonjs格式或者是AMD格式，所以不要把它认为是一种新的模块引用方式。babel默认会把ES6的模块转化为commonjs规范的，你也不用费劲再把它转成AMD了。

所以如下写法是等价的：
import list from './list';//等价于var list = require('./list');

//可打包在一起的同步代码，使用import语法import list from './list';

//需要独立打包、异步加载的代码，
使用require.ensurerequire.ensure([], function(require){ var list = require('./list');});

```js
exports.name = function(x){
    console.log(x);
};
等同于
module.exports.name = function(x){
    console.log(x);
};
```
但是这样写就有了区别了：
```js
exports = function(x){
   console.log(x);
};

上面的 function是一块新的内存地址，导致exports与module.exports不存在任何关系而require方能看到的只有module.exports这个对象，看不到exports对象，所以这样写是导不出去的。

//下面的写法是可以导出去的。说句题外话，module.exports除了导出对象，函数还可以导出所有的类型，比如字符串、数值等。
module.exports = function(x){
	console.log(x);
}
```

### require/exports 和 import/export 的不同
```
require/exports 和 import/export 形式不一样require/exports 的用法只有以下三种简单的写法：
```js
//导入
const fs = require('fs')
//导出
exports.fs = fs
module.exports = fs
```

```js
而 import/export 的写法就多种多样：import fs from 'fs'
import {default as fs} from 'fs'
import * as fs from 'fs'
import {readFile} from 'fs'
import {readFile as read} from 'fs'
import fs, {readFile} from 'fs'

export default fs
export const fs
export function readFile
export {readFile, read}
export * from 'fs'
```
**不同点1：动态引入require,按需加载**

使用 import 的方式引入，即使最终没用到，module 必定会被加载。使用 require 引入，可以更实际的按需加载 module。如在开发环境时，需要加载浏览器插件库，生产环境则不需要，这时就可以只在满足开发环境的 if 语录中 require 用到的 module。
```
旧版本：
node 直接支持 require ， 没有直接支持 import 。

简言之：import 是在编译过程中执行，而common的require是同步。还有import传的是值引用，require是值拷贝。

import无论在node和浏览器上都不能直接使用吧，需要babel编译
```

**不同点2：CommonJS 模块输出的是一个值的拷贝**
一般的说法
CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用
```
我要讲一下使用上的细微差别。import是read-only的。举个例子//// a.js
module.exports = 0;
//// main.js
var a0 = require('./a.js');
import a1 from './a.js';
a0++; /// 1
a1++; ///报错，babel直接编辑不过
```
总结不同点2：
```
require：输出是值的拷贝，模块就是对象，输入时必须查找对象属性
import：输出是值的引用，ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入（这也导致了没法引用 ES6 模块本身，因为它不是对象）
```
