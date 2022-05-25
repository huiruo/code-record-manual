

# 介绍
React 提供了优化UI渲染,机制就是通过使用虚拟DOM来减少昂贵的DOM变化的数量。
```
MobX 提供了优化应用状态与 React 组件同步的机制，这种机制就是使用响应式虚拟依赖状态图表，它只有在真正需要的时候才更新并且永远保持是最新的。
```
## 核心概念
### Observable state(可观察的状态)
MobX 为现有的数据结构(如对象，数组和类实例)添加了可观察的功能。 通过使用 @observable 装饰器(ES.Next)来给你的类属性添加注解就可以简单地完成这一切。
```js
import { observable } from "mobx";

class Todo {
    id = Math.random();
    @observable title = "";
    @observable finished = false;
}
```
如果你的环境不支持装饰器语法，也不必担心。 你可以点击这里查看如何进行设置。 或者你可以直接跳过设置，因为 MobX 可以通过 decorate 工具在不支持装饰器语法的情况加使用。 尽管如此，多数 MobX 用户更喜欢装饰器语法，因为它更简洁。
例如，上面一段代码的ES5版本应该是这样:
```js
import { decorate, observable } from "mobx";

class Todo {
    id = Math.random();
    title = "";
    finished = false;
}
decorate(Todo, {
    title: observable,
    finished: observable
})
```
### Computed values(计算值)
使用 MobX， 你可以定义在相关数据发生变化时自动更新的值。 通过@computed 装饰器或者利用 (extend)Observable 时调用 的getter / setter 函数来进行使用。(当然，这里也可以再次使用 decorate 来替代 @ 语法)。
```js
class TodoList {
    @observable todos = [];
    @computed get unfinishedTodoCount() {
        return this.todos.filter(todo => !todo.finished).length;
    }
}
```
### Reactions(反应)
```
Reactions 和计算值很像，但它不是产生一个新的值，而是会产生一些副作用，比如打印到控制台、网络请求、递增地更新 React 组件树以修补DOM、等等。 简而言之，reactions 在 响应式编程和命令式编程之间建立沟通的桥梁
```

# React 组件
如果你用 React 的话，可以把你的(无状态函数)组件变成响应式组件，方法是在组件上添加 observer 函数/ 装饰器. observer由 mobx-react 包提供的。
```js
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';

@observer
class TodoListView extends Component {
    render() {
        return <div>
            <ul>
                {this.props.todoList.todos.map(todo =>
                    <TodoView todo={todo} key={todo.id} />
                )}
            </ul>
            Tasks left: {this.props.todoList.unfinishedTodoCount}
        </div>
    }
}

const TodoView = observer(({todo}) =>
    <li>
        <input
            type="checkbox"
            checked={todo.finished}
            onClick={() => todo.finished = !todo.finished}
        />{todo.title}
    </li>
)

const store = new TodoList();
ReactDOM.render(<TodoListView todoList={store} />, document.getElementById('mount'));
```

```
observer 会将 React (函数)组件转换为它们需要渲染的数据的衍生。 使用 MobX 时没有所谓的智能和无脑组件。 

所有的组件都会以巧妙的方式进行渲染，而只需要一种简单无脑的方式来定义它们。MobX 会确保组件总是在需要的时重新渲染，但仅此而已。

所以上面例子中的 onClick 处理方法会强制对应的 TodoView 进行渲染，如果未完成任务的数量(unfinishedTodoCount)已经改变，它将导致 TodoListView 进行渲染。 可是，如果移除 Tasks left 这行代码(或者将它放到另一个组件中)，当点击 checkbox 的时候 TodoListView 就不再重新渲染。你可以在 JSFiddle 中自己动手来验证这点。
```