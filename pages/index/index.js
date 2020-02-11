//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    src:'../../imgs/logo.png',
    tel:''
  },
  toCodePage:function(e){//页面跳转
    var that=this;
    if(that.data.tel!=''){
      wx.redirectTo({
        url: '../vcode/vcode?tel='+that.data.tel
      })
    }else{
      wx.showToast({
        title: '请输入手机号码',
        icon:'none'
      })
    }
  },
  changeTel:function(e){//修改电话号码
    this.setData({
      tel: e.detail.value
    })
  }/*,
  onLoad:function(){
    wx.request({
      url: app.globalData.questUrl+'/mini/login', //仅为示例，并非真实的接口地址
      method:'POST',
      data: {
        'code':app.globalData.code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if(!res.data.result){
          wx.redirectTo({
            url:"../user/user"
          })
        }
      }
    })
  }*/
})
