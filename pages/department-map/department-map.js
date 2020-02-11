// pages/department-map/department-map.js
const bmap = require('../../lib/bmap-wx.min.js');
const util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        markers: [],
        latitude: '',
        longitude: '',
        placeData: {},
        departmentList: [
            {
                id: 1,
                name: '店家1',
                distance: 1,
            },
            {
                id: 2,
                name: '店家2',
                distance: 2,
            },
            {
                id: 3,
                name: '店家3',
                distance: 3,
            },

            {
                id: 4,
                name: '店家4',
                distance: 4,
            },
            {
                id: 5,
                name: '店家5',
                distance: 5,
            },
        ]
    },
    onLoad: function () {
        var that = this;
        // 新建百度地图对象 
        var BMap = new bmap.BMapWX({
            ak: 'jLaI0rBPRvVGiGMnuixRbmphvV8GMzbr'
        });
        wx.getLocation({
            success: function(res) {
                console.log(res)
                that.setData({
                    latitude: res.latitude
                });
                that.setData({
                    longitude: res.longitude
                });
            },
        })
        BMap.search({ 
            "query": '酒店', 
            success: function(data){
                console.log(data)
            }, 
        }); 
    },
    toServices(e){
        var id = e.currentTarget.dataset.id;
        app.globalData.departmentId = id;
        wx.redirectTo({
            url: '../unit-services/unit-services',
        })
    },
})