// pages/scan-pay/scan-pay.js
const app = getApp()
const md5 = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    departmentName:'xioazhun',
    logoUrl:'/imgs/xzlogo.png',
    canteenType: '',//食堂/商户
    canteenId: '',//食堂/商户ID
    activePayType:'3',
    money: '',
    serialNumber:'',//生成的订单号
    payType:[
      { id: '3', value: '余额支付', checked: true},
      { id: '1', value: '微信支付'},
    ],
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that= this;
    wx.request({
      url: app.globalData.questUrl + '/stage/diningIdNameLogoUrlForMiniapp', //仅为示例，并非真实的接口地址
      method: 'get',
      data: {
        code: decodeURIComponent(decodeURIComponent(options.code)),
        token: app.globalData.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.result) {
          console.log(res.data.data);
          that.setData({ 
            departmentName: res.data.data.name,
            logoUrl: res.data.data.logoUrl,
            canteenType: res.data.data.type,
            canteenId: res.data.data.id
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  changeMoney: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  inputClear: function () {
    this.setData({
      money: ''
    })
  },
  radioChange(e){
    this.setData({
      activePayType: e.detail.value
    })
  },
  next:function(){
    var that = this;
    if (/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      .test(that.data.money)) {
      if (Number(that.data.money) <= 100000) {
        if (this.data.activePayType == 3){
          wx.request({
            url: app.globalData.questUrl + '/stage/ordering/richScangOrder', //仅为示例，并非真实的接口地址
            method: 'post',
            data: {
              token: app.globalData.token,
              id: that.data.canteenId,
              type: that.data.canteenType,
              paymentMode: that.data.activePayType,
              money: that.data.money
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              if (res.data.result) {
                console.log(res.data.data)
                that.setData({ serialNumber: res.data.data });
                that.showInputLayer();
              } else {
                wx.showToast({
                  title: res.data.message || '发生错误',
                  icon: 'none'
                })
              }
            }
          })
        } else if (this.data.activePayType == 1){
          wx.request({
            url: app.globalData.questUrl + '/stage/ordering/richScanhPayByWechat', //仅为示例，并非真实的接口地址
            method: 'post',
            data: {
              token: app.globalData.token,
              id: that.data.canteenId,
              type: that.data.canteenType,
              paymentMode: that.data.activePayType,
              money: that.data.money
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              if (res.data.result) {
                console.log(res.data.data)
                var data = res.data.data;
                delete data.appId;
                console.log(data)
                wx.requestPayment({
                  ...data,
                  'success': function (res) {
                    if (res.errMsg == 'requestPayment:ok') {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.message || '发生错误',
                  icon: 'none'
                })
              }
            }
          })
        }
      } else {
        wx.showToast({
          title: '支付金额超过上限',
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
  /**
   * 显示支付密码输入层
   */
  showInputLayer: function () {
    this.setData({ showPayPwdInput: true, payFocus: true });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function () {

    var val = this.data.pwdVal;

    this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' }, function () {
      // wx.showToast({
      //   title: val,
      // })
    });

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
    var that = this;
    this.setData({ pwdVal: e.detail.value });
    if (e.detail.value.length >= 6) {
      wx.request({
        url: app.globalData.questUrl + '/stage/ordering/richScanPayByRemainingMone/'+that.data.serialNumber, //仅为示例，并非真实的接口地址
        method: 'post',
        data: {
          token: app.globalData.token,
          password: md5.md5(that.data.pwdVal)
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.result) {
            wx.showToast({
              title: "支付成功",
              icon: 'none',
              duration:2000,
              success:function(){
                setTimeout(function(){
                  wx.navigateBack({
                    delta: 1
                  })
                },2500)
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
      this.hidePayLayer();
    }
  }
})