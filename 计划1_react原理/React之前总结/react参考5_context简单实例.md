

创建一个全局context

```jsx
import React from 'react'
const GlobalContext = React.createContext();
export default GlobalContext;
```

子组件

```jsx
import React, {Component} from 'react'
import GlobalContext from './globalContext' // 导入全局context

export default class Child extends Component {
    render() {
        return (
            <GlobalContext.Consumer>
                {context => {
                    console.log(context)
                    return (
                        <div>
                            <h4>{context.name}</h4>
                        </div>
                    )
                }}
            </GlobalContext.Consumer>
        )
    }
}
```



app.js

```jsx
import Child from './Component/Child'
import GlobalContext from './globalContext'

render() {
    return (
        <div className="App">
          <GlobalContext.Provider
              value = {{
                name: 'aaa',
              }}>
                <Child /> // 被传递的子组件，可多个
          </GlobalContext.Provider>
    )
}
```

