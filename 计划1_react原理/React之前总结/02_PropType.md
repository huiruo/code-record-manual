

## 验证
```
对于外部传入组件内部的prop值,无论有没有传入,为了程序的健壮性,,需要判断prop值是否存在,我们往往需要设置一个初始默认值,如果不存在,就给一个默认初始值,当然你利用传入的prop进行“||”或字符进行处理也是可以的
在React中,可以配置defaultProps进行默认prop值的设置:

组件.defaultProps = {
 prop属性名称: 默认值
}
```

```
import React, { Fragment, Component } from "react";
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class PropTest extends Component {

render(){
return (
  <Fragment>
   <div>{ this.props.propContent }</div>
  </Fragment>
);
}
}

PropTest.defaultProps = {
propContent: "我是propTest组件的内容"
}

const container = document.getElementById('root');
ReactDOM.render(<PropTest />, container);
```
