const app = getApp()
Page({
  data: {
    memberName:''
  },
  toUser:function(){//修改用户名按钮
    this.updateName();
  },
  changeName:function(e){
    this.setData({
      memberName: e.detail.value
    })
  },
  updateName:function(){//修改用户名
    var that=this;
    wx.request({
      url: app.globalData.questUrl+'/stage/modifyName', //仅为示例，并非真实的接口地址
      method:'post',
      data:{
        token:app.globalData.token,
        name:that.data.memberName
      },
      header: {
          'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if(res.data.result){
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        }
      }
    })
  },
  onLoad:function(opt){
    this.setData(opt)
  }
})
