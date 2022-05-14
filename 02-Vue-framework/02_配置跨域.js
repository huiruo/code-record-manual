//配置
proxyTable: {
  '/api':{
    target:'http://192.168.191.1:8184', ////go接口 接口的域名必须能访问,否则
    // target:'http://127.0.0.1:8000', //
    // secure: false,  // 如果是https接口，需要配置这个参数
    changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
    pathRewrite:{
      '^/api': ''   // axios接口   url:"/api/org/gongsi/findAllJiaFang", 浏览器接口： http://192.168.191.1:8184/org/gongsi/findAllJiaFang
    }
  }
},
//请求
mounted(){ //模板渲染完毕执行
    var aid=this.$route.params;
    console.log("id:",aid.aid)
    this.$http.get('/list/api_detail/detail?key=' +aid.aid).then(function (response) {
      // this.list=response.body
      console.log(response)
      this.result=response.data;
      console.log(this.data)
    },function (err) {
      console.log(err)
    })
},
