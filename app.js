//app.js
const exceptUrl=[
  '/auth/login/wechat_mini'
]
App({
  onLaunch: function () {

  },
  http: function (method, url, data) {
    var that = this
    return new Promise(function (resolve, reject) {
      let header = {
        'content-type': 'application/json',
      };
      if(exceptUrl.indexOf(url) === -1){
        header.Authorization= wx.getStorageSync('token')
      }
      wx.request({
        url: that.globalData.questUrl + url,
        method: method,
        data: data,
        header: header,
        success(res) {
          wx.hideNavigationBarLoading();
          if (res.header.Authorization) {
            that.globalData.token = res.header.Authorization;
            wx.setStorageSync('token', res.header.Authorization);
          }
          if(res.statusCode == 200){
            if (res.data.result) {
              resolve(res.data);
            } else {
              reject(res.data.message);
            }
          }else if(res.statusCode == 401 && exceptUrl.indexOf(url)>-1 ){
            resolve(res.data);
          }else{
            reject(res.data);
          }
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  globalData: {
    userInfo: null,
    code: null,
    totalPrice: null,
    paymsg: '',
    result: '',
    questUrl:'https://dubbo.51dingdian.com/web',
    // questUrl: 'http://192.168.100.143:9040/web',
    socketUrl: 'wss://dubbo.51dingdian.com/MessageCenter/myHandler',
    webViewUrl: 'https://dubbo.51dingdian.com/web/wxweb/',
    token: null,
    departmentId: 2,
    appId: null,
    beBindOpenid:'',
  }
})