// pages/unit-services/unit-services.js
const app = getApp()
var isLoad = true
Page({
    /**
     * 页面的初始数据
     */
    data: {
        memberId: '',
        middleRouter: [{
                url: 'meal-record.html',
                img: '../../imgs/icon_home_03.png',
                name: '就餐记录'
            },
            {
                url: 'wallet-balance.html?type=1',
                img: '../../imgs/icon_home_02.png',
                name: '账户明细'
            },
            {
                url: 'recharge-record.html',
                img: '../../imgs/icon_home_01.png',
                name: '充值记录'
            },
        ],
        bottomRouter: [{
                id: 1,
                url: '',
                img: '../../imgs/icon_home_10.png',
                name: '充值',
                showFlag: true
            },
            {
                id: 2,
                url: '/pages/web-view/web-view?link=building.html',
                img: '../../imgs/icon_home_04.png',
                name: '订单申诉',
                showFlag: true
            },
            {
                id: 3,
                url: '/pages/web-view/web-view?link=building.html',
                img: '../../imgs/icon_home_05.png',
                name: '食堂菜单',
                showFlag: true
            },
            {
                id: 4,
                url: '/pages/web-view/web-view?link=building.html',
                img: '../../imgs/icon_home_06.png',
                name: '购物商城',
                showFlag: true
            },
            {
                id: 5,
                url: '/pages/web-view/web-view?link=building.html',
                img: '../../imgs/icon_home_07.png',
                name: '订餐'
            },
            {
                url: '/pages/system-setting/system-setting',
                img: '../../imgs/icon_home_08.png',
                name: '个人中心',
                showFlag: true
            },
            {
                id: 6,
                url: '/pages/web-view/web-view?link=building.html',
                img: '../../imgs/icon_home_09.png',
                name: '健康分析',
                showFlag: true
            },
            // {
            //   id: 7,
            //   url: '/pages/bluetooth/bluetooth',
            //   img: '../../imgs/icon_home_09.png',
            //   name: '蓝牙',
            //   showFlag: true
            // },
        ],
        remainingMoney: 0,
        departmentName: '',
        userName: '',
        qrcodeUrl: '',
        resetTime: null, //定时器
        retime: 60, //刷新间隔,
        userInfo: null,
        lockReconnect: false,
        limit: 0,
    },
    getRemainingCredit: function() { //获取会员就餐卡余额
        var that = this;
        app.http('get','/stage/remainingMoney',{memberId:this.data.memberId})
        .then(res=>{
            that.setData({
                remainingMoney: res.data
            })
        })
        .catch(res=>{
            wx.showToast({
                title: res.message || '发生错误',
                icon: 'none'
            })
        })
    },
    getProfile: function() { //获得用户信息
        var that = this;
        app.http('get','/stage/memberInfo',{departmentId:app.globalData.departmentId})
        .then(res=>{
            console.log(res.data);
            var rechageUrl = `bottomRouter[0].url`
            that.setData({
                departmentName: res.data.departmentName,
                userName: res.data.memberName,
                'bottomRouter[0].showFlag': res.data.isFundHolding,
                memberId: res.data.memberId,
                [rechageUrl]: this.rechargeUrl(res.data.memberId)
            });
            this.getQrCode();
            this.getRemainingCredit()
            that.setSocket();
            isLoad = false;
        })
        .catch(res=>{
            wx.showToast({
                title: res.message || '发生错误',
                icon: 'none'
            })
        })
    },
    getQrCode: function() {
        var that = this;
        app.http('get','/stage/getPayQRCode',{memberId:this.data.memberId})
        .then(res=>{
            that.setData({
                qrcodeUrl: res.data.qrcodeUrl
            });
            if (that.data.resetTime) {
                clearInterval(that.data.resetTime);
                that.setData({
                    retime: 60
                });
            }
            that.reTimeCode();
        })
        .catch(res=>{
            wx.showToast({
                title: res.message || '发生错误',
                icon: 'none'
            })
        })
    },
    reTimeCode: function() { //定时器
        var me = this;
        this.data.resetTime = setInterval(function() {
            me.setData({
                retime: --me.data.retime
            });
            if (me.data.retime === 0) {
                me.data.retime = 60;
                me.getQrCode();
            }
        }, 1000)
    },
    scanCode: function() {
        // 允许从相机和相册扫码
        wx.scanCode({
            success(res) {
                console.log(res)
                if (res.errMsg === 'scanCode:ok') {
                    var targetUrl = res.result.split('targetUrl=')[1];
                    if (targetUrl) {
                        var code = decodeURIComponent(targetUrl).split('?')[1].split('=')[1];
                        wx.navigateTo({
                            url: "/pages/scan-pay/scan-pay?code=" + code
                        })
                    } else {
                        wx.showToast({
                            title: '二维码不正确',
                            icon: 'none'
                        })
                    }
                } else {
                    wx.showToast({
                        title: '网络异常',
                        icon: 'none'
                    })
                }
            }
        })
    },
    toSetting: function() {
        wx.navigateTo({
            url: '/pages/system-setting/system-setting',
        })
    },
    onLoad: function() {
        this.getProfile();
        
        if (!wx.connectSocket) {
            console.log('版本过低')
        } else {
            console.log('可以使用connectSocket')
        }

    },
    onShow: function() {
        if(!isLoad){
            this.getRemainingCredit();
        }
    },
    linkSocket: function() {
        var that = this;
        wx.connectSocket({
            url: app.globalData.socketUrl + '?appId=11111111_dubbo&appToken=22222222_dubbo&receiverType=4&receiver=' + that.data.memberId,
            header: {
                'content-type': 'application/json'
            },
            method: "GET",
            complete: function(res) {
                console.log(res.errMsg);
                if (wx.hideLoading) {
                    wx.hideLoading()
                }
            }
        });
    },
    reconnect() {
        if (this.data.lockReconnect) return;
        this.data.lockReconnect = true;
        if (this.data.limit < 12) {
            this.linkSocket();
            this.data.lockReconnect = false;
            this.setData({
                limit: this.data.limit + 1
            })
        }
    },
    setSocket: function() { //websocket
        if (wx.showLoading) {
            wx.showLoading({
                title: '加载中',
            })
        }
        var that = this;
        this.linkSocket();
        wx.onSocketClose(function(res) {
            console.log('WebSocket 已关闭！');
            that.reconnect();
        })
        wx.onSocketOpen(function(res) {
            console.log('WebSocket连接已打开！');
            that.setData({
                limit: 0
            })
        });
        wx.onSocketError(function(res) {
            wx.showToast({
                title: 'WebSocket连接打开失败，请检查！',
                icon: 'none'
            })
        });
        wx.onSocketMessage(function(res) { //收到服务端消息
            if (res.data) {
                var data = JSON.parse(res.data);
                console.log(data)
                app.globalData.totalPrice = parseFloat(data.totalPrice).toFixed(2);
                app.globalData.paymsg = data.message;
                app.globalData.result = data.result;
                // this.getProfile();
                wx.navigateTo({
                    url: '../transaction/transaction?status=' + app.globalData.result
                })

            }
        })
    },
    onUnload: function() {
        wx.closeSocket();
    },
    rechargeUrl: function(memberId) {
        // return '/pages/wechat-recharge/'+(app.globalData.departmentId?'wechat-recharge':('department-select?memberId='+this.memberId))
        return '/pages/wechat-recharge/department-select?memberId=' + memberId
    }
})