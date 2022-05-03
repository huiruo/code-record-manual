
#### 前言
ref必须指向dom元素而不是React组件
```javaScript
// 下面就是应用到React组件的错误示例：
const A=React.forwardRef((props,ref)=><B {...props} ref={ref}/>)


// 前面提到ref必须指向dom元素，那么正确方法就应用而生：
const  A=React.forwardRef((props,ref)=>(
<div ref={ref}>
	<B {...props} />
</div>
))
```

#### 扩展
```
useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。

在大多数情况下，应当避免使用 ref 这样的命令式代码。useImperativeHandle 应当与 forwardRef 一起使用。
```

```javaScript
/*
ref：定义 current 对象的 ref createHandle：一个函数，返回值是一个对象，即这个 ref 的 current
对象 [deps]：即依赖列表，当监听的依赖发生变化，useImperativeHandle 才会重新将子组件的实例属性输出到父组件
ref 的 current 属性上，如果为空数组，则不会重新输出。
*/

useImperativeHandle(ref, createHandle, [deps])
```

#### forwardRef获取子组件的Dom
```javaScript
// 父组件：
export function TemplateModal(props: TemplateModalProps) {

  const formRef: any = useRef()

	// 调用子组件的方法
  const handleCancel = () => {
    formRef.current.resetForm()
    onClose()
    cleanModalCache()
  }

  return (
		<AddForm ref={formRef} formValues={formValues} />
	)
}
```

```javaScript
// 子组件
export function AddForm(props: AddFormPrps, ref: any) {
  const [form] = Form.useForm()

	// 暴露组件的方法
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      const values = form.getFieldsValue()
      return values
    },
    resetForm: () => {
      form.resetFields()
    }
  }))

	return (
	      <Form
        form={form}
        name='template_form'
        layout='inline'
        onFinish={onFinish}
        initialValues={{ title: '', type: 0, tags: [] }}
      >
			</Form>
  )
}

const WrappedAddForm = forwardRef(AddForm)

export default WrappedAddForm
```

#### 例子2：
```javaScript
function App() {
    const el = useRef(null)

    return (
        <div className="App">
            <Forward ref={el}/>
            <button onClick={()=>{ console.log(el.current);}}>获取子组件的Dom</button>
        </div>
    );
}

//forwardRef获取子组件的Dom
const Forward = forwardRef((props,ref)=>{undefined

    return (
        <div>
            <div ref={ref}>子组件</div>
        </div>
    )

})
```
