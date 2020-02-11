// pages/password/password.js
const regeneratorRuntime = require('../../lib/runtime')
const md5 = require('../../utils/utils.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    remind:"请设置支付密码",
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
    isReset:true,//是否为重置密码
    resend: true,//重新发送验证码
    retime: 60,//验证码等待时间
    vrCode:'',//输入的验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isReset: options.isReset==1
    })
  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({ payFocus: true });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    this.setData({ pwdVal: e.detail.value });
  },
  resetCode: function () {//验证码倒计时
    this.setData({
      resend: false
    });
    var me = this;
    var resetTime = setInterval(function () {
      me.setData({
        retime: --me.data.retime
      });
      if (me.data.retime === 0) {
        me.setData({
          resend: true,
          retime: 60
        });
        clearInterval(resetTime)
      }
    }, 1000)
  },
  confirm:function(){
    if(this.data.isReset){
      this.resetPassword();
    }else{
      this.setPassword();
    }
  },
  sendCode:async function(){
    var that = this;
    if(this.data.resend){
      try {
        var telNo = await that.getPhoneNo();
        var vrCode = await that.getVrCode(telNo);
        that.resetCode();
        if(vrCode){
          that.setData({
            vrCode: vrCode
          });
        }else{
          wx.showToast({
            title: '短信已发送,请注意查收短信!',
            icon: 'none'
          })
        }
      } catch (err) {
        if (typeof (err) ==="string"){
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }else{
          console.log(err);
        }
      }
    }
  },
  getPhoneNo:function(){//获取用户手机号
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.questUrl + '/stage/curMemberPhoneNo', //仅为示例，并非真实的接口地址
        method: 'get',
        data: {
          token: app.globalData.token
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.result) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '发生错误')
          }
        }
      })
    })
  },
  getVrCode:function(telNo){
    var that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.questUrl + '/stage/login/verificationCode/' + telNo, //仅为示例，并非真实的接口地址
        method: 'get',
        data: {
          token: app.globalData.token
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.result) {
            resolve(res.data.data?res.data.data.substring(18, 24):'');  
          } else {
            reject(res.data.message || '发生错误')
          }
        }
      })
    })
  },
  setPassword:function(){
    var that = this;
    if (that.data.pwdVal.length != 6) {
      wx.showToast({
        title: '请输入6位数字密码',
        icon: 'none'
      })
    }else{
      wx.request({
        url: app.globalData.questUrl + '/stage/setPaycode', //仅为示例，并非真实的接口地址
        method: 'post',
        data: {
          token: app.globalData.token,
          payCode: md5.md5(that.data.pwdVal)
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.result) {
            console.log(res.data.data);
            wx.showToast({
              title: "设置成功",
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/unit-services/unit-services',
                  })
                }, 2500)
              }
            });
          } else {
            wx.showToast({
              title: res.data.message || '发生错误',
              icon: 'none'
            })
          }
        }
      })
    }
  },
  resetPassword: function () {
    var that = this;
    if (that.data.pwdVal.length != 6) {
      wx.showToast({
        title: '请输入6位数字密码',
        icon: 'none'
      })
    } else if (!that.data.vrCode){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }else {
      wx.request({
        url: app.globalData.questUrl + '/stage/reSetPaycode', //仅为示例，并非真实的接口地址
        method: 'post',
        data: {
          token: app.globalData.token,
          verificationCode: that.data.vrCode,
          newPayCode: md5.md5(that.data.pwdVal)
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.result) {
            console.log(res.data.data);
            wx.showToast({
              title: "重置成功",
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2500)
              }
            });
          } else {
            wx.showToast({
              title: res.data.message || '发生错误',
              icon: 'none'
            })
          }
        }
      })
    }
  },
  inputCode: function (e) {
    this.setData({ vrCode: e.detail.value });
  },
})