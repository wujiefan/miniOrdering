var formatTime=require('../../utils/util.js').formatTime;
const app = getApp()
Page({
  data: {
    logs: []
  },
  getDetail:function(opt){//获取订单详情
    var that=this;
    wx.request({
      url: app.globalData.questUrl+'/stage/ordering/diningOrder/detail/'+opt.orderId, //仅为示例，并非真实的接口地址
      method:'get',
      data:{
        token:app.globalData.token,
        sourceDevice:opt.sourceDevice==='false'?false:true
      },
      header: {
          'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if(res.data.result){
            res.data.data.orderTime=formatTime(new Date(res.data.data.orderTime));
            res.data.data.payTime=formatTime(new Date(res.data.data.payTime));
            that.setData(res.data.data);
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
    this.getDetail(opt)
  }
})
