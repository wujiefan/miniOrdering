const app = getApp()
Page({
  data: {
    resend:false,
    retime:59,
    qrCode:'',
    memberId:''
  },
  getPayQRCode:function(){//获取二维码
    var that=this;
    if(!this.data.resend){
        wx.request({
          url: app.globalData.questUrl+'/stage/getPayQRCode', //仅为示例，并非真实的接口地址
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
                resend: true,
                qrCode:/*app.globalData.questUrl.split('/ordering')[0]+*/res.data.data.qrcodeUrl
              });
              that.reTimeCode();
            }else{
              wx.showToast({
                title: res.data.message,
                icon:'none'
              })
            }
          }
        })
    }
  },
  reTimeCode:function(){//定时器
    var me=this;
    var resetTime=setInterval(function(){
      me.setData({
        retime: --me.data.retime
      });
      if(me.data.retime===0){
        me.setData({
          resend: false,
          retime:60
        });
        clearInterval(resetTime)
      }
    },1000)
  },
  setSocket:function(memberId){//websocket
    if(wx.showLoading){
      wx.showLoading({
        title: '加载中',
      })
    }
    var that=this;
    wx.connectSocket({
      url: app.globalData.socketUrl+'?appId=11111111_dubbo&appToken=22222222_dubbo&receiverType=4&receiver='+memberId,
      header:{
          'content-type': 'application/json'
      },
      method:"GET",
      complete:function(res){
        console.log(res.errMsg);
        if(wx.hideLoading){
          wx.hideLoading()
        }
        that.getPayQRCode();
      }
    });
    wx.onSocketClose(function(res) {
      console.log('WebSocket 已关闭！');
    })
    wx.onSocketOpen(function(res) {
      console.log(res)
      console.log('WebSocket连接已打开！');
    });
    wx.onSocketError(function(res){
      wx.showToast({
        title: 'WebSocket连接打开失败，请检查！',
        icon: 'none'
      })
    });
    wx.onSocketMessage(function(res) {//收到服务端消息
      if(res.data){
        var data=JSON.parse(res.data);
        console.log(data)
        app.globalData.totalPrice=parseFloat(data.totalPrice).toFixed(2);
        app.globalData.paymsg=data.message;
        app.globalData.result=data.result;
        wx.redirectTo({
          url: '../transaction/transaction?status='+app.globalData.result
        })
      }
    })
  },
  onLoad:function(opt){
    /*console.log('connectSocket:'+wx.canIUse('connectSocket'))
    console.log('onSocketOpen:'+wx.canIUse('onSocketOpen'))
    console.log('showLoading:'+wx.canIUse('showLoading'))*/
    if(!wx.connectSocket){
      console.log('版本过低')
    }else{
      console.log('可以使用connectSocket')
    }
    this.setData({
      memberId:opt.memberId
    })
    this.setSocket(opt.memberId);
  },
  onUnload:function(){
    wx.closeSocket();
  }
})
