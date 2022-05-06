


## react简单入门-react-router6.0及以上路由传参，以及接受参数
https://blog.csdn.net/m0_46694056/article/details/121795999


方法一：
类似：/home/123、/home/123/zhangsan
先看demoo：

```js
  <Route path=":homeId/:name">
  </Route>

  const params = useParams()
  console.log('params:',params)


  Invoice组件：
  navigate("/home/123")
```

方法二：
类似：/home?id=123&name=zhangsan&age=18
或
http://localhost:3001/#/moments?page=2


```js
  const [searchParams,setSearchParams] = useSearchParams()

  const onShowSizeChange = (page:number)=>{
    setSearchParams({page:page.toString()})
  }

  // 判断是否存在
  const hasPage= searchParams.has('page')
  console.log('hasPage',hasPage)

  searchParams.get(“id”); // 获取该查询参数对象的首个为”id“的值

  searchParams.getAll(“id”); // 获取该查询参数对象的所有的“id”的值，返回一个数组，如：[“123”,“456”]

  searchParams.delete(“age”); // 删除查询参数对象的一组参数，如果age有多组，也是全都删除，但并不会删除地址栏

  searchParams.append(“age”, 18); // 向查询参数对象后增加一组参数，该函数的两个参数分别为：（新增的字段，新增的字段的值）,可重复追加

  searchParams.forEach(); // 遍历该查询参数对象所有的参数组

  searchParams.entries(); // 返回一个 该查询参数对象所有的参数组 的迭代器，每个参数组为一个数组,如：[“id”,“123”]

  searchParams.keys(); // 返回一个迭代器，装着该查询参数对象里面所有参数组的所有key

  searchParams.set(“id”, 789); // 设置该查询参数对象的具体字段的值，该函数两个参数分别为：（要修改的字段，要修改的字段期望的值），如果有重复的，将都会删除，合成一个

  searchParams.toString(); // 直接把查询参数对象转为查询字符串，如：id=123&name=zhangsan&id=456

  searchParams.values(); // 返回一个迭代器，装着该查询参数对象里面所有参数组的所有value
```
