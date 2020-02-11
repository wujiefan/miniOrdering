// pages/wechat-recharge/wechat-recharge.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    departmentId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      departmentId:options.id
    })
  },
  changeMoney:function(e){
    this.setData({
      money: e.detail.value
    })
  },
  next:function(){
    var that = this;
    if (/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      .test(this.data.money)) {
      if (Number(this.data.money) <= 100000) {
        app.http('post','/stage/shopping/remainingSumPrePay',{price: this.data.money,departmentId:this.data.departmentId})
        .then(res=>{
          var data = res.data;
          delete data.appId;
          wx.requestPayment({
            ...data,
            'success': function (res) { 
              if (res.errMsg == 'requestPayment:ok'){
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          }) 
        })
        .catch(res=>{
            wx.showToast({
                title: res.message,
                icon: 'none'
            })
        })
      } else {
        wx.showToast({
          title: '充值金额超过上限',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none'
      })
    }
  },
  inputClear:function(){
    this.setData({
      money: ''
    })
  },
  toRecord:function(){
    wx.navigateTo({
      url: '/pages/web-view/web-view?link=recharge-record.html'
    })
  }
})