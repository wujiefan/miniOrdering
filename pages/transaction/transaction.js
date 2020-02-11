const app = getApp()
Page({
  data: {
    transaction: true,
    message:'',
    totalPrice:''
  },
  toUser:function(){//页面跳转
    /*if(wx.reLaunch){
      wx.reLaunch({
        url: '../user/user'
      })
    }else{
      wx.navigateBack({
        delta: 1
      })
    }*/
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad:function(opt){
    this.setData({
        transaction:opt.status==='true',
        message:app.globalData.paymsg,
        totalPrice:'￥'+app.globalData.totalPrice
    })
  }
})
