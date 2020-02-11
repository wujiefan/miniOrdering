const app = getApp()

Page({
  data: {
    telNumber:'',
    resend:true,
    retime:60,
    code:''
  },
  toUser:function(){//跳转用户首页
    var that=this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.questUrl+'/auth/login/mobile_code', //仅为示例，并非真实的接口地址
      method:'POST',
      data: {
        mobile:that.data.telNumber,
        mobileCode:that.data.code,
        clientId:7,
        beBindOpenid:app.globalData.beBindOpenid
      },
      header: {
          'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        wx.hideNavigationBarLoading();
        if(res.data.result){
          if(res.data.data){
            wx.reLaunch({
              url: "../unit-services/unit-services"
            })
          }else{
            wx.reLaunch({
              url: '/pages/password/password?isReset=0',
            })
          }
        }else{
          if(res.data.message == '未找到对应的用户'){
            app.http('get','/userInfo/weChatMemberAutoRegister',{
              departmentId:app.globalData.departmentId,
              phone:that.data.telNumber
            })
            .then(res=>{
              app.globalData.beBindOpenid = res.data
              app.http('post','/auth/login/mobile_code',{
                mobile:that.data.telNumber,
                mobileCode:that.data.code,
                clientId:7,
                beBindOpenid:app.globalData.beBindOpenid
              })
              .then(res=>{
                wx.redirectTo({
                  url:"../unit-services/unit-services"
                })
              })
              .catch(res=>{
                wx.showToast({
                    title: res.message || '网络异常',
                    icon: 'none'
                })
              })
            })
            .catch(res=>{
                wx.showToast({
                    title: res.message || '网络异常',
                    icon: 'none'
                })
            })
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel:false,
              success: function(res) {
                if (res.confirm) {
                  // wx.redirectTo({
                  //   url:"../index/index"
                  // })
                }
              }
            })
          }
          
        }
      }
    })

  },
  onLoad:function(option){
    this.setData({
      telNumber: option.tel
    });
    this.getVcode(option.tel);
  },
  resetCode:function(){//验证码倒计时
    this.setData({
      resend: false
    });
    var me=this;
    var resetTime=setInterval(function(){
      me.setData({
        retime: --me.data.retime
      });
      if(me.data.retime===0){
        me.setData({
          resend: true,
          retime:60
        });
        clearInterval(resetTime)
      }
    },1000)
  },
  getVcode:function(tel){//获取验证码
    var that=this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.questUrl+'/auth/login/mobile_code/?mobile='+ that.data.telNumber,
      method:'get',
      success: function(res) {
        wx.hideNavigationBarLoading()
        if(res.data.result){
          that.resetCode();
          if (res.data.data){
            var code = res.data.data;
            that.setData({
              code: code
            });
          }else{
            wx.showToast({
              title: '短信已发送,请注意查收短信!',
              icon: 'none'
            })
          }
        }else{
          wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel:false,
              success: function(res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url:"../index/index"
                  })
                }
              }
          })
        }
      }
    })
  },
  reGetCode:function(){
    this.getVcode(this.data.telNumber)
  },
  inputCode: function (e) {
    this.setData({ code: e.detail.value });
  },
})