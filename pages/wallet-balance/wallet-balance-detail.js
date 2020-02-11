// pages/wallet-balance/wallet-balance-detail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        recordDetail:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getBalanceDetail(options.id)
    },
    getBalanceDetail(id){
        app.http('get','/member/getAccountRecordDetail',{id})
        .then(res=>{
            this.setData({
                ...res.data
            })
        })
        .catch(res=>{
            wx.showToast({
                title: res.message,
                icon:'none'
            })
        })
    }
})