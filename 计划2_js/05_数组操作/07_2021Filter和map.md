

# filter
```
filter函数可以看成是一个过滤函数，返回符合条件的元素的数组

let arr1 = [1,2,3];
let arr2 = arr1.filter((value,key,arr) => {
    console.log(value)    // 1，2，3
    console.log(key)      // 0，1，2
    console.log(arr)      // [1,2,3]
    return value >= 3 ? false : true;     
})
console.log(arr1); // [ 1, 2, 3 ]
console.log(arr2); // [ 1, 2 ]
```

# map
```
在forEach中return语句是没有任何效果的，而map则可以改变当前循环的值，返回一个新的被改变过值之后的数组（map需return），一般用来处理需要修改某一个数组的值。

let arr1 = [1,2,3];
let arr2 = arr1.map((value,key,arr) => {
    console.log(value)    // 1，2，3
    console.log(key)      // 0，1，2
    console.log(arr)      //[1,2,3] [1,2,3] [1,2,3]
    return value * value;
})
console.log(arr1); // [ 1, 2, 3 ]
console.log(arr2); // [ 1, 4, 9 ]
```

# 实战:react map中过滤某些数据
```
                  <ul style={{ listStyle: 'none' }}>
                    {searchUser.map((item) => {
                      if(selectUser.filter((value) => value.id === item.id).length) return null
                      return (
                        <li
                          key={item.id}
                          bgBlue30--hover
                          cursorPointer
                          h-32
                          pt-5
                          pb-5
                          style={{ lineHeight: '22px' }}
                          onClick={() => handleUserSelect(item)}
                        >
                          <span pl-10>{item.nickname}</span>
                        </li>
                      )
                    })}
                  </ul>
```


47 111 56 140 fill


git filter-branch --tree-filter 'rm -rf File 01_技术卷1和源码/Java核心技术卷一基础知识第10版.rar' HEAD
git filter-branch --tree-filter 'rm -rf File 01_技术卷1和源码/Java核心技术卷一基础知识第10版.pdf' HEAD

git filter-branch --force --index-filter "git rm --cached --ignore-unmatch 01_技术卷1和源码/Java核心技术卷一基础知识第10版.rar"  --prune-empty --tag-name-filter cat -- --all
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch 01_技术卷1和源码/Java核心技术卷一基础知识第10版.pdf"  --prune-empty --tag-name-filter cat -- --all
git commit --amend -CHEAD

git rm --cached 01_技术卷1和源码/Java核心技术卷一基础知识第10版.rar
git rm --cached 01_技术卷1和源码/Java核心技术卷一基础知识第10版.pdf