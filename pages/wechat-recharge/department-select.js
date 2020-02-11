// pages/wechat-recharge/department-select.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        departmentList: [
            // {
            //     id: 1,
            //     name: '店家1',
            //     price: 1,
            // },
            // {
            //     id: 2,
            //     name: '店家2',
            //     price: 2,
            // },
            // {
            //     id: 3,
            //     name: '店家3',
            //     price: 3,
            // },

            // {
            //     id: 4,
            //     name: '店家4',
            //     price: 4,
            // },

            // {
            //     id: 5,
            //     name: '店家5',
            //     price: 5,
            // },
        ],
        memberId:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            memberId:options.memberId
        })
        this.getMemberInfoList()
    },
    getRandomColor: function() {
        var r, g, b;
        r = Math.floor(Math.random() * 150 + 20);
        g = Math.floor(Math.random() * 150 + 20);
        b = Math.floor(Math.random() * 150 + 20);
        return 'rgba(' + r + ',' + g + ',' + b + ',1)';
    },
    toRecharge:function(e){
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: './wechat-recharge?id='+id,
        })
    },
    toBalance: function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../wallet-balance/wallet-balance?id=' + id,
        })
    },
    getMemberInfoList(){
        app.http('get','/member/memberInfoList',{memberId:this.data.memberId})
        .then(res=>{
            res.data.forEach(v=>{
                v.bgCol = this.getRandomColor()
            })
            this.setData({
                departmentList:res.data
            })
        })
        .catch(res=>{
            wx.showToast({
                title: res.message,
                icon: 'none'
            })
        })
    }
})