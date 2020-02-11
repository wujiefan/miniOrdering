// pages/wallet-balance/wallet-balance.js
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        balanceList:[],
        curPage:1,
        pagesSize:0,
        departmentId:''
    },

    onLoad: function (options) {
        console.log(options)
        this.setData({
            departmentId:options.id
        })
        this.getBalanceInfo(this.data.curPage)
    },
    scroll(e){
        if(this.data.curPage<this.data.pagesSize){
            this.getBalanceInfo(++this.data.curPage)
        }
    },
    getBalanceInfo(pageNo) { 
        app.http('get','/member/getAccountRecord',{pageNo,departmentId:this.data.departmentId})
        .then(res=>{
            this.data.pagesSize = res.data.pagesSize
            var balanceList =  this.formatData(res.data.entitiesInPage[0])
            this.setData({
                balanceList:balanceList
            })
        })
        .catch(res=>{
            wx.showToast({
                title: res.message,
                icon:'none'
            })
        })
    },
    formatData(data){
        var balanceList = this.data.balanceList
        for(var k in data){
            var flag = true;
            for(var i=0;i<balanceList.length;i++){
                if(balanceList[i].date == k){
                    balanceList[i].value = [...balanceList[i].value,...data[k]]
                    flag = false
                    break;
                }
            }
            if(flag){
                balanceList.push({
                    date:k,
                    value:data[k]
                })
            }    
        }
        return balanceList
    },
    toDetail(e){
        wx.navigateTo({
            url:"wallet-balance-detail?id="+e.currentTarget.dataset.id
        })
    }
})