const app = getApp()
Page({
  data: {
    userInfo: false,
    memberInfo:null,
    remainingCredit:null
  },
  toPay:function(){//跳转支付页面
    wx.navigateTo({
        url:'../pay/pay?memberId='+this.data.memberInfo.memberId
    })
  },
  toPatDetail:function(){//跳转订单列表
    if(this.data.memberInfo){
      wx.navigateTo({
          url:'../balance/balance?remainingCredit='+this.data.remainingCredit
      })
    }

  },
  toInfo:function(){//跳转用户信息页面
    if(this.data.memberInfo){
      var memberInfo=this.data.memberInfo;
      wx.navigateTo({
          url:'../info/info?memberName='+memberInfo.memberName+'&departmentName='+memberInfo.departmentName+'&telNo='+memberInfo.telNo
      })
    }

  },
  getMemberInfo:function(){//获取会员信息
    var that=this;
    wx.request({
      url: app.globalData.questUrl+'/stage/memberInfo', //仅为示例，并非真实的接口地址
      method:'get',
      data:{
        token:app.globalData.token
      },
      header: {
          'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if(res.data.result){
          that.setData({
            memberInfo:res.data.data
          })
        }else{
          wx.showToast({
            title: res.data.message||'发生错误',
            icon:'none'
          })
        }
      }
    })
  },
  getRemainingCredit:function(){//获取会员就餐卡余额
    var that=this;
    wx.request({
      url: app.globalData.questUrl+'/stage/remainingCredit', //仅为示例，并非真实的接口地址
      method:'get',
      data:{
        token:app.globalData.token
      },
      header: {
          'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if(res.data.result){
          that.setData({
            remainingCredit:res.data.data
          })
        }else{
          wx.showToast({
            title: res.data.message||'发生错误',
            icon:'none'
          })
        }
      }
    })
  },
  onShow:function(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }else{
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: app.globalData.userInfo
          })
        }
      })
    }
    this.getMemberInfo();
    this.getRemainingCredit();
  }
})
