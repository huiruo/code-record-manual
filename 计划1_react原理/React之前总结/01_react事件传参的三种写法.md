> # 写法一
>
> <Button onClick={this.delFolder.bind(this,"abc")}></Button>
>
> 定义delFolder方法
>
> *delFolder = (name,e)=>{*
>
> *alert(name)*
>
> *}*
>
> 用bind绑定，调用是作为第二个参数传递，不用显示传递事件对象，定义方法时，事件对象作为最后一个参数传入
>
> # 写法二
>
> <Button onClick={this.delFolder("abc")}></Button>
>
> 定义delFolder方法
>
> delFolder = (name)=>{
>
> return (e)=>{
>
> ​    console.log(e);
>
> ​    console.log(key);
>
> }
>
> }
>
> 返回一个函数，事件对象在返回的函数中
>
> # 第三种写法
>
> <Button onClick={（e）=>this.delFolder("abc",e)}></Button>
>
> delFolder = (name,e)=>{
>
> }
>
> 事件对象作为第二个参数传递
>
> 作者：正在刷新log
>
> 链接：https://www.jianshu.com/p/c1d1e9c9c47b
>
> 来源：简书
>
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。