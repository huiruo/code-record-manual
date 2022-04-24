

 var str = "中国移动:10086,中国联通:10010,中国电信:10000";
    var reg=/\d{5}/g;
    //通过正则表达式匹配这个字符串
    var array=reg.exec(str);
    while (array!=null){
      //输出匹配的内容
      console.log(array[0]);
      array=reg.exec(str);  //再次匹配
    }



            let reg = RegExp(/lang=en/);
        if (sharebyStr && sharebyStr.match(reg)) {
            // alert("带参且带lang=en")
            this.setState({
                paraEn: true
            })
        } else {
            // alert("不带参数")
        }