// pages/system-setting/system-setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    settingList:[{
      id:1,
      name:"重置密码",
      bindtap:'resetPassword'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  resetPassword:function(){
    wx.navigateTo({
      url: '/pages/password/password?isReset=1',
    })
  },
  switchUser:function(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
})