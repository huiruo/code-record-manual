### babel 原理
JavaScript 的编译器，任何一个编译器工作流程大致都可以分为如下三步：

- Parser 解析源文件

- Transfrom 转换

- Generator 生成新文件

```
code ---->Parser (通过@babel/parser)  ===== AST --------->Transfrom (通过@bable/traverse) =========AST ---------> Generator (通过@babel/generator)  =====得到最后的code
```

因为 Babel 使用是acorn:https://github.com/acornjs/acorn
这个引擎来做解析，这个库会先将源码转化为抽象语法树 (AST)，再对 AST 作转换，最后将转化后的 AST 输出，便得到了被 Babel 编译后的文件。
那 Babel 是如何知道该怎么转化的呢？答案是通过插件，Babel 为每一个新的语法提供了一个插件，在 Babel 的配置中配置了哪些插件，就会把插件对应的语法给转化掉。插件被命名为 @babel/plugin-xxx 的格式。

### 创建项目
```
添加package.json文件： 
npm init -y

官方安装
npm install --save-dev @babel/core @babel/cli @babel/preset-env

Babel 原生的 @babel/cli 来编译文件，实际使用中，更多的是
结合 webpack、rollup 这样第三方的工具来使用的。
```

### 转换
npm install --save @babel/traverse

### 增加 babel 命令来编译 src 目录下的文件到 dist 目录：
```json
  "scripts": {
    "babel": "babel src --out-dir dist",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

### 增加 Babel 配置文件
在工程的根目录添加 babel.config.js 文件，增加 Babel 编译的配置，没有配置是不进行编译的
```javaScript
/*
例中 debug 配置是为了打印出 Babel 工作时的日志，可以方便的看来，Babel 转化了哪些语法。

presets 主要是配置用来编译的预置，plugins 主要是配置完成编译的插件
*/
const presets = [
  [
    '@babel/env',
    {
      debug: true
    }
  ]
]
const plugins = []
 
module.exports = { presets, plugins }
```

### babel 组成
### （1）@babel/preset-env
```
@babel/preset-* 是转换插件的集合，最常用的就是 @babel/preset-env，它包含了 大部分 ES6 的语法，具体包括哪些插件，可以在 Babel 的日志中看到。
如果源码中使用了不在 @babel/preset-env 中的语法，会报错，手动在 plugins 中增加即可。
```
例如 ES6 明确规定，Class 内部只有静态方法，没有静态属性。但现在有一个提案提供了类的静态属性，写法是在实例属性的前面，加上 static 关键字。
```javaScript
// src/index.js
const add = (a, b) => a + b
 
class Person {
  static a = 'a';
  static b;
  name = 'morrain';
  age = 18
}
```
编译时就会报如下错误：
根据报错的提示，添加 @babel/plugin-proposal-class-properties 即可。
npm install --save-dev @babel/plugin-proposal-class-properties
然后配置：
```javaScript
// babel.config.js
const presets = [
  [
    '@babel/env',
    {
      debug: true
    }
  ]
]
const plugins = ['@babel/plugin-proposal-class-properties']
 
module.exports = { presets, plugins }
```

#### @babel/preset-env 中还有一个非常重要的参数 targets
最早的时候我们就提过，Babel 转译是按需的，对于环境支持的语法可以不做转换的。
就是通过配置 targets 属性，让 Babel 知道目标环境，从而只转译环境不支持的语法。
如果没有配置会默认转译所有 ES6 的语法。

没有配置targets
```javaScript
// src/index.js
const add = (a, b) => a + b
 
// dist/index.js
"use strict";
 
var add = function add(a, b) {
  return a + b;
};
```

按如下配置** targets**
```javaScript
// babel.config.js
const presets = [
  [
    '@babel/env',
    {
      debug: true,
      targets: {
        chrome: '58'
      }
    }
  ]
]
const plugins = ['@babel/plugin-proposal-class-properties']
 
module.exports = { presets, plugins }
```

可以看到 const 和箭头函数都没有被转译，因为这个版本的 chrome 已经支持了这些特性。可以根据需求灵活的配置目标环境。
```javaScript
// src/index.js
const add = (a, b) => a + b
 
// dist/index.js  配置targets  chrome 58
"use strict";
 
const add = (a, b) => a + b;
```

### 2.@babel/polyfill
polyfill 直译是垫片的意思，又是 Babel 里一个非常重要的概念。先看下面几行代码：
```javaScript
// src/index.js
const add = (a, b) => a + b
 
const arr = [1, 2]
const hasThreee = arr.includes(3)
new Promise()
```
Array.prototype.includes 和 Promise 竟然没有被转译！
```javaScript
// dist/index.js
"use strict";
 
var add = function add(a, b) {
  return a + b;
};
 
var arr = [1, 2];
var hasThreee = arr.includes(3);
new Promise();
```

Babel 把 ES6 的标准分为 syntax 和 built-in 两种类型。syntax 就是语法，像 const、=> 这些默认被 Babel 转译的就是 syntax 的类型。

而对于那些可以通过改写覆盖的语法就认为是 built-in，像 includes 和 Promise 这些都属于 built-in。

而 Babel 默认只转译 syntax 类型的，对于 built-in 类型的就需要通过 @babel/polyfill 来完成转译。

@babel/polyfill 实现的原理也非常简单，就是覆盖那些 ES6 新增的 built-in。示意如下：


由于 Babel 在 7.4.0 版本中宣布废弃 @babel/polyfill ，而是通过 core-js 替代，所以本文直接使用 core-js 来讲解 polyfill 的用法。
core-js 是 babel-polyfill 的底层依赖，通过各种奇技淫巧，用 ES3 实现了大部分的 ES2017 原生标准库，同时还要严格遵循规范。

第一步：安装 core-js
```
// 注意 core-js 要使用 --save 方式安装，因为它是需要被注入到源码中的，在执行代码前提供执行环境，用来实现 built-in 的注入
npm install --save core-js
```

第二步：配置 useBuiltIns

在 @babel/preset-env 中通过 useBuiltIns 参数来控制 built-in 的注入。它可以设置为 'entry'、'usage' 和 false 。默认值为 false，不注入垫片。

设置为 'entry' 时，只需要在整个项目的入口处，导入 core-js 即可。
```javaScript
// src/index.js
import 'core-js'
 
const add = (a, b) => a + b
 
const arr = [1, 2]
const hasThreee = arr.includes(3)
new Promise()
 
// dist/index.js
"use strict";
 
require("core-js/modules/es7.array.includes");
require("core-js/modules/es6.promise");
//
// ……  这里还有很多
//
require("regenerator-runtime/runtime");
var add = function add(a, b) {
  return a + b;
};
var arr = [1, 2];
var hasThreee = arr.includes(3);
new Promise();
```

设置为 'usage' 时，就不用在项目的入口处，导入 core-js了，Babel 会在编译源码的过程中根据 built-in 的使用情况来选择注入相应的实现。
```javaScript
// src/index.js
import 'core-js'
 
const add = (a, b) => a + b
 
const arr = [1, 2]
const hasThreee = arr.includes(3)
new Promise()
 
// dist/index.js
"use strict";
 
require("core-js/modules/es7.array.includes");
require("core-js/modules/es6.promise");
//
// ……  这里还有很多
//
require("regenerator-runtime/runtime");
var add = function add(a, b) {
  return a + b;
};
var arr = [1, 2];
var hasThreee = arr.includes(3);
new Promise();
```

配置 corejs 的版本

当 useBuiltIns 设置为 'usage' 或者 'entry' 时，还需要设置 @babel/preset-env 的 corejs 参数，用来指定注入 built-in 的实现时，使用 corejs 的版本。否则 Babel 日志输出会有一个警告。
最终的 Babel 配置如下：
```javaScript
// babel.config.js
const presets = [
  [
    '@babel/env',
    {
      debug: true,
      useBuiltIns: 'usage',
      corejs: 3,
      targets: {}
    }
  ]
]
const plugins = ['@babel/plugin-proposal-class-properties']
 
module.exports = { presets, plugins }
```

### （3）@babel/plugin-transform-runtime
在编译的过程中，对于 built-in 类型的语法通过 require("core-js/modules/xxxx") polyfill 的方式来兼容，对于 syntax 类型的语法在转译的过程会在当前模块中注入类似 _classCallCheck 和 _defineProperty 的 helper 函数来实现兼容。对于一个模块而言，可能还好，但对于项目中肯定是很多模块，每个模块模块都注入这些 helper 函数，势必会造成代码量变得很大。

而 @babel/plugin-transform-runtime 就是为了复用这些 helper 函数，缩小代码体积而生的。当然除此之外，它还能为编译后的代码提供一个沙箱环境，避免全局污染。
```
①安装
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime

其中 @babel/plugin-transform-runtime 是编译时使用的，安装为开发依赖，而 @babel/runtime 其实就是 helper 函数的集合，需要被引入到编译后代码中，所以安装为生产依赖

②修改 Babel plugins 配置，增加@babel/plugin-transform-runtime
```

```javaScript
// babel.config.js
const presets = [
  [
    '@babel/env',
    {
      debug: true,
      useBuiltIns: 'usage',
      corejs: 3,
      targets: {}
    }
  ]
]
const plugins = [
  '@babel/plugin-proposal-class-properties',
  [
    '@babel/plugin-transform-runtime'
  ]
]
 
module.exports = { presets, plugins }
```