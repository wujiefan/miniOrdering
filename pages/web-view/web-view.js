// pages/web-view/web-view.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    origin: app.globalData.webViewUrl,
    link:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options)
  },
})