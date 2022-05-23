
### AST语法树 结构
每个js引擎都有自己的AST语法解析器，比如chrome是v8引擎，node也是v8引擎
AST语法树每一层都拥有相同的结构，这样的每一层结构也被叫做 节点（Node）。

#### JS Parser解析器。
能够将JavaScript源码转化为抽象语法树(AST)的工具叫做JS Parser解析器。
JS Parser的解析过程包括两部分:
- 1.词法分析(Lexical Analysis)：将整个代码字符串分割成最小语法单元数组
```
语法单元是被解析语法当中具备实际意义的最小单元，简单的来理解就是自然语言中的词语。
```
- 2.语法分析(Syntax Analysis)：在分词基础上建立分析语法单元之间的关系

#### 词法分析(Lexical Analysis)
Javascript 代码中的语法单元主要包括以下这么几种：
- 关键字：例如 var、let、const等

- 标识符：没有被引号括起来的连续字符，可能是一个变量，也可能是 if、else 这些关键字，又或者是 true、false 这些内置常量

- 运算符： +、-、 *、/ 等

- 数字：像十六进制，十进制，八进制以及科学表达式等

- 字符串：因为对计算机而言，字符串的内容会参与计算或显示

- 空格：连续的空格，换行，缩进等

- 注释：行注释或块注释都是一个不可拆分的最小语法单元

- 其他：大括号、小括号、分号、冒号等

#### 语法分析(Syntax Analysis)
组合分词的结果，确定词语之间的关系，确定词语最终的表达含义，生成抽象语法树。
以赋值语句为例，使用esprima来解析：
```
var a = 1;
```

词法分析结果如下，可以看到，分词的结果是一个数组，每一个元素都是一个最小的语法单元：
```json
[{
		"type": "Keyword",
		"value": "var"
	},
	{
		"type": "Identifier",
		"value": "a"
	},
	{
		"type": "Punctuator",
		"value": "="
	},
	{
		"type": "Numeric",
		"value": "1"
	},
	{
		"type": "Punctuator",
		"value": ";"
	}
]
```
语法分析结果如下，把分词的结果按照相互的关系组成一个树形结构：
```json
{
	"type": "Program",
	"body": [{
		"type": "VariableDeclaration",
		"declarations": [{
			"type": "VariableDeclarator",
			"id": {
				"type": "Identifier",
				"name": "a"
			},
			"init": {
				"type": "Literal",
				"value": 1,
				"raw": "1"
			}
		}],
		"kind": "var"
	}],
	"sourceType": "script"
}
```



一个 AST 可以由单一的节点或是成百上千个节点构成。它们组合在一起可以描述用于静态分析的程序语法。
单层AST节点示例：
```javaScript
{
  type: "BinaryExpression",
  operator: ...,
  left: {...},
  right: {...}
}
 
//type是节点的类型，比如"Program"、"FunctionDeclaration"、"ExpressionStatement"等，类型
//有很多种，种节点类型会有一些附加的属性用于进一步描述该节点类型。
//节点类型种类参见：https://blog.csdn.net/weixin_30576827/article/details/94938016
```

#### 常见的AST parser
- Espree，基于esprima，用于eslint
- Acorn，号称是相对于esprima性能更优，体积更小
- Babylon，出自acorn，用于babel
- Babel-eslint，babel团队维护，用于配合使用ESLint

几个重要的包：
- babylon  将js代码转化为ast语法树
```
Babylon 是一个解析器，它可以将 JavaScript 字符串转换为对计算机来说更加友好的表现形式，称之为抽象语法树（AST）
```

- 转换 babel-traverse 
```
babel-traverse 模块允许你浏览、分析和修改抽象语法树（AST）。
```

- 生成 babel-generator 
最后，babel-generator 模块用来将转换后的抽象语法树（AST）转换为 JavaScript 字符串。