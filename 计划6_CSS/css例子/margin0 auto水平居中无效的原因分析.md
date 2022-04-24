> CSS中设置margin0 auto; 水平居中无效的原因分析



margin:0 auto;的意思就是：上下边界为0，左右根据宽度自适应，其实就是[水平居中]的意思，在这里说两个典型的错误引起的不能居中的问题：

**没有设置宽度**

```html
<div style="margin:0 auto;"></div>
```



**实战**

```html
<div style="display:inline-block;vertical-align:top;background:grey;width: 40%;">
                    <div style="width:100px;background:yellow;margin: 0 auto;">
                        <ul>
                            <li>商务合作</li>
                            <li><a href="<?= $this->url->get('page/privacyPolicy') ?>" title="隐私政策">隐私政策</a></li>
                            <li>站长统计</li>
                        </ul>
                    </div>
</div>
```

