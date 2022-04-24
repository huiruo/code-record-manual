

```vue
          <div class="logo">
            <img :src="totalCount>0?imgSelect:imgNo" height="48px" width="48px" />
          </div>
```

```js
  data() {
    return {
      balls: createBalls(),
      listFold: this.fold,
      position: '',
      pupVisible: false,
      imgNo: require('../../assets/product/box.png'),
      imgSelect: require('../../assets/product/boxSelect.png')
    }
  },
```



#### 0.动态加载  ：class    2019.9.25

```js
        <div @click="pay" class="contentButton">
          <div :class="totalCount>0?'enough pay':'not-enough pay'">确定选择</div>
        </div>
```



#### 1.  :href    ref

```
  <div ref="detail_propertable_right" class="detail_propertable_right"> 
   <a :href="'/plastic/detail?id='+uuid+'.html'" target="_blank"> <img src="/images/frontend/supplier/propertable1.svg" width="30" height="20" /> 
   <span>物性表</span> </a> 
  </div>
  
  
  //操作
   _this.$refs.detail_propertable_right.style.display = "block";
```

#### click绑定

```js
 <el-button type="danger" @click="commitB" :disabled="this.checkList.length?false:true">确定</el-button>
   methods: {
    selecteChange: function(item, value) {
      console.log(item);
      console.log(value);
      if (value == true) {
        app.selectedId.push(item.uid);
      }
    },
    commitB() {
      alert(223);
    }
  }
```



#### 2.在html页面中使用，兼容ie9 及以下

```js
var app = new Vue({
    el: '#detailAppId',
    data: {
        showNoAppic: false,
        picUrl: "http://main.bkt.17suzao.com/",
        cur: 0,
        isRoad: false,
        detail: null,
        uuid: "",
        image_detail: null,
        image_property: null,
    },
    methods: {
        getNum: function(index) {
            this.cur = index;
        },
        requestData: function() {
            var _this = this
            $.ajax({
                type: 'GET',
                url: '/market/detail?id=' + id,
                data: {},
                header: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                success: function(res) {
                    // console.log(res)
                    var data = res.data.detail
                    var image_detail = JSON.parse(data.image_detail)
                    var image_property = JSON.parse(data.image_property)
                    var delegth = image_detail.length != 0
                    if (delegth) {
                        _this.image_detail = image_detail
                        _this.showNoAppic = true
                    }
                    if (image_property.length != 0) {
                        _this.image_property = image_property
                        if (!delegth) {
                            _this.showNoAppic = true
                        }
                    }
                    if (data.uuid) {
                        _this.uuid = data.uuid
                        _this.$refs.detail_propertable_right.style.display = "block";
                    }
                }
            })
        }
    },
    mounted: function() {
        this.requestData()
    }
})
```



#### 3. :class /:style  v-on:click  / @click       _tab切换中使用

**实战：:class**

```
<div :class="{tabactive:tabCurrent===1}" @click="tabsClick(1)" class="common">近30天</div>
<div :class="{tabactive:tabCurrent===2}" @click="tabsClick(2)" class="common">近90天</div>
<div :class="{tabactive:tabCurrent===3}" @click="tabsClick(0)" class="customize-tab common"></div>

<style>
    .tabactive {
      color: #fff;
      background: #f04a4a;
    }
</style>
```



```
   :style="{cursor:(isRoad&&homeLeft1.has_url?'pointer':'auto')}"
   
```

**:style**

```html
      <el-table :data="organizeCTable1.records" :header-cell-style="{background:'#F5F7FA',color:'#606266'}" :style="{minHeight:(organizeCTable1.records.length?'':'460px'),width: '100%;'}">
        <el-table-column label="账号" prop="account" width="220"></el-table-column>
        <el-table-column label="姓名" prop="staffName" width="220"></el-table-column>
        <el-table-column label="手机" prop="phone" width="220"></el-table-column>
        <el-table-column label="工号" prop="jobNumber" width="220"></el-table-column>
        <el-table-column label="职位" prop="position" width="220"></el-table-column>
        <el-table-column label="操作" prop="name"></el-table-column>
      </el-table>
```



**实战vue动态背景图片--------->:style使用：**

> ```vue
>     <div :style="{'backgroundImage': 'url(' + currentImg + ')',backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat'}" class="mainContent">
>     </div>
> ```
>
> 



2数组语法实现HTML Style绑定--------动态html实例**

```js
//项目实例：
<div class="selectDiv rihgt" @click="selectCilck(1)" :style="[toSelectRight]">
    <span class="iconfont">&#xe6cf;</span>
        <p :style="[toSelectedColorRight]">单独添加商品提成</p>
<p :style="[toSelectedColorRight]">单独设置商品，适用于只有员工才可销售的场景</p>
</div>
export default {
  name: 'GoodsList',
  data() {
    return {
      toSelectRight: {
        color: '#bcc1c9',
        border: ''
      },
      toSelectedColorRight: {
        color: ''
      },
    }
  }
```



#### 4.  v-for     v-if      :src   _重点

```vue
  <div class="supplier_tabcur1" style="width: 1200px;margin: 0 auto;"> 
   <div v-if="isHaveBanner" v-for="(item,key) in company_banner" :key="key" style="min-height:300px"> 
    <img :src="picUrl+item" width="80%" height="auto" /> 
   </div> 
   <div v-if="!isHaveBanner" style="height:500px;"> 
    <div style="display: inline-block;"> 
     <div> 
      <div style="margin-top:20%"> 
       <img src="/images/frontend/supplier/noData.svg" width="100%" height="300px" /> 
       <span>商家还未上传简介</span> 
      </div> 
     </div> 
    </div> 
   </div> 
  </div>
```





#### 5.内容渲染非 for   

```vue
  <div class="supplier_tabcurdiv"> 
   <div class="supplier_Tman supplier_contactitem"> 
    <span class="supplier_TmanText1">{{isRoad ? company.surname + (company.gender == 1 ? &quot;先生&quot; : &quot;女士&quot;) : &quot;&quot;}}</span> 
    <span class="supplier_TmanText2">{{isRoad ?company.job:&quot;&quot;}}<span> </span></span>
   </div> 
   <div class="supplier_contactitem"> 
    <img src="/images/frontend/supplier/if_phone.svg" /> {{isRoad?company.cellphone:&quot;&quot;}} 
   </div> 
   <div class="supplier_contactitem"> 
    <img src="/images/frontend/supplier/mail.svg" /> {{isRoad?company.contact_email:&quot;&quot;}} 
   </div> 
   <div class="supplier_contactitem"> 
    <img src="/images/frontend/supplier/if_location.svg" /> {{isRoad?company.company_full_address:&quot;&quot;}} 
   </div> 
  </div>
```

