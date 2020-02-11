const app = getApp()
Page({
  data: {

  },
  toUpdate:function(){//页面跳转
    if(this.data.memberName){
      wx.redirectTo({
          url:'../update/update?memberName='+this.data.memberName
      })
    }

  },
  outLog:function(){//跳转到登录页面
    wx.redirectTo({
      url: '../index/index'
    })
  },
  onLoad:function(opt){
    this.setData(opt)
  }
})
