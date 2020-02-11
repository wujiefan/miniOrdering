//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    src:'../../imgs/logo.png'
  },
  onLoad:function(options){
    console.log(options)
    if(options.scene){
      var scene=decodeURIComponent(options.scene);
      app.globalData.departmentId=scene.split("&")[0];
    }
    app.globalData.appId = wx.getAccountInfoSync().miniProgram.appId;
    // 登录
    wx.login({
      success: res => {
        app.globalData.code=res.code;
        wx.showNavigationBarLoading();
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.http('post','/auth/login/wechat_mini',{
          'code':res.code,
          'clientId':7,
        }).then(res=>{
          if(res.data.token){
            wx.redirectTo({
              url:"../unit-services/unit-services"
            })
          }else{
            app.globalData.beBindOpenid = res.data.openid
            wx.redirectTo({
              url:"../index/index"
            })
          }
        }).catch(res=>{
          console.log(res)
          wx.showToast({
            title: res.message,
            icon:'none'
          })
        })
      },
      fail:function(err){
        console.log(err)
      }
    });
  }
})
