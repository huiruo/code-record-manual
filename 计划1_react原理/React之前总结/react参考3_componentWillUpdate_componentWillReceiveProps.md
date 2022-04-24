



componentWillReceiveProps 这个一般是根据 props 决定要不要做什么事情，
比如可以在这里面调用 setState 触发渲染_byge言语

componentWillReceiveProps 和componentWillUpdate 

**子组件调用componentWillUpdate 修改父组件的数据**

父组件：

```
    //接收到新的props或者state但没有render时调用:用于筛选过滤
    componentWillUpdate(nextProps, nextState) {
        if (nextState.type !== this.state.type || nextState.key !== this.state.key || nextState.currency !== this.state.currency ||
            nextState.order !== this.state.order || nextState.pid !== this.state.pid) {
            noMore = false;
            this.props.setState([], true);  //2019.5.10：先清空数据再过滤
            let { type, page, size, key, currency, order, pid } = nextState;
            this.setState({
                data: []
            })
            this.getGoodList(type, page, size, key, currency, order, pid);
        }
    }



    //子组件调用修改当前组建state
    setSet(obj) {
        this.setState(obj);
    }    
```

子组件：

```
    //选择币种
    selectCurrency(e) {
        let currency = {'1' : 'RMB', '2' : 'RMB', '3' : 'USD', '4' : 'HKD', '5' : 'NTD', '6' : 'EUR', '7' : 'JPY'};
        let currency2 = {'1' : '人民币', '2' : '人民币', '3' : '美元', '4' : '港币', '5' : '台币', '6' : '欧元', '7' : '日元','': '全部'};
        let id = e.target.getAttribute('data-index')
        subTab3 = currency2[id];
        this.setState({
            curCurrency: id,
            isCover: false
        })
        this.props.setSet({
            currency: id,
            page: 1,
            tabShow: true
        })
    }
```

