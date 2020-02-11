const app = getApp();
Date.prototype.pattern = function(fmt) {//时间戳转换日期
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
Page({
  data: {
    length:6,
    remainingCredit:'',
    entities:[],
    pageNo:1
  },
  toDetail:function(e){//页面跳转
    var index=e.currentTarget.dataset.index;
    var orderId=this.data.entities[index].orderId;
    var sourceDevice=this.data.entities[index].sourceDevice;
    wx.navigateTo({
      url: '../pay-detail/pay-detail?orderId='+orderId+'&sourceDevice='+sourceDevice
    })
  },
  onReachBottom:function(){//划到底层
    this.remainingCreditDetail();
  },
  remainingCreditDetail:function(){//获取订单列表
    var that=this;
    wx.request({
      url: app.globalData.questUrl+'/stage/remainingCreditDetail', //仅为示例，并非真实的接口地址
      method:'get',
      data:{
        pageNo:this.data.pageNo,
        token:app.globalData.token
      },
      header: {
          'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if(res.data.result){
          var entitiesInPage=res.data.data.entitiesInPage;
          if(entitiesInPage.length>0){
            for (let i = 0; i < entitiesInPage.length; ++i) {
              entitiesInPage[i].time=new Date(entitiesInPage[i].time).pattern('yyyy-MM-dd HH:mm')
              entitiesInPage[i].totalPrices=entitiesInPage[i].totalPrices.toFixed(2)
            }
            that.setData({
              entities:that.data.entities.concat(entitiesInPage),
              pageNo:res.data.data.pageNo+1
            })
          }
        }else{
          wx.showToast({
            title: res.data.message||'发生错误',
            icon:'none'
          })
        }
      }
    })
  },
  onLoad:function(opt){
    this.remainingCreditDetail();
    this.setData({
      remainingCredit:opt.remainingCredit||'0.00'
    })
  }
})
