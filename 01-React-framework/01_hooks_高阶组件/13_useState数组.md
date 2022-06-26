
```javaScript
import { Button } from "antd"
import { useState } from "react"

export default function App() {

    const [list, setList] = useState([
        {
            id: 1,
            val: 'test1'
        },
        {
            id: 2,
            val: 'test2'
        },
        {
            id: 3,
            val: 'test3'
        }
    ])

    // 添加
    const onAdd = () => {
        setList([...list, {
            id: list.length + 1,
            val: 'xxxx'
        }])
    }

    // 删除
    const handClick = (item, index) => {
        // setList(list.filter(i => i.id !== list[item].id))
        // or 一般直接使用上面这种方式就可以，要是上面这种方法无效可以试试下面的方法
        let data = list
        data.splice(item, 1)
        setList([...data])
    }

    return (
        <div>
            <Button onClick={onAdd}>添加</Button>
            <Button onClick={handClick}>添加</Button>
        </div>
    )
}
```

## 特别的自定义项目
```javaScript
// 直接使用 setList
// 如果使用上面方法会产生多维数组
const arrItem = [{id: 3,val: 'test3'}]
setList(arrItem)
```