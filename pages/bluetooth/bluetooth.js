// pages/bluetooth/bluetooth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    blueName:'mxl',
    deviceId:'',
    consoleLog:'',
    services:'',
    notifyId: '', //监听的值
    writeId: '',//用来写入的值
    macAddr:'',//mac地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initBlue();
  },
  sendInfo:function(){
    this.sendMy(this.string2buffer(this.data.inputValue));
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  initBlue: function () {
    var that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        wx.showToast({
          title: '初始化成功',
          icon: 'success',
          duration: 800
        })
        wx.onBLEConnectionStateChange(function (res) {
          // 该方法回调中可以用于处理连接意外断开等异常情况
          console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
        })
        console.log('初始化成功')
        that.findBlue();//2.0
      },
      fail: function (res) {
        wx.showToast({
          title: '请开启蓝牙',
          icon: 'fails',
          duration: 1000
        })
      }
    })
  },
  findBlue() {
    var that = this
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false,
      interval: 0,
      success: function (res) {
        wx.showLoading({
          title: '正在搜索设备',
        })
        setTimeout(function(){
          that.getBlue()//3.0
        },1000)
      }
    })
  },
  getBlue() {
    var that = this
    wx.getBluetoothDevices({
      success: function (res) {
        console.log(123,res)
        wx.hideLoading();
        for (var i = 0; i < res.devices.length; i++) {
          console.log(res.devices[i].name)
    　　　//that.data.inputValue：表示的是需要连接的蓝牙设备ID
          if (res.devices[i].name == that.data.blueName || res.devices[i].localName == that.data.blueName) {
            that.setData({
              deviceId: res.devices[i].deviceId,
              consoleLog: "设备：" + res.devices[i].deviceId,
              macAddr: res.devices[i].advertisData ? that.ab2hex(res.devices[i].advertisData):''
            })
            console.log(that.data.macAddr)
            console.log(that.data.deviceId)
            that.connetBlue(that.data.deviceId);//4.0
            return;
          }
        }
      },
      fail: function () {
        console.log("搜索蓝牙设备失败")
      }
    })
  },
  connetBlue(deviceId) {
    var that = this;
    wx.createBLEConnection({
      //与对应设备建立链接
      deviceId: deviceId,//设备id
      success: function (res) {
        wx.showToast({
          title: '连接成功',
          icon: 'fails',
          duration: 800
        })
        console.log("连接蓝牙成功!")
        wx.stopBluetoothDevicesDiscovery({
          success: function (res) {
            console.log('连接蓝牙成功之后关闭蓝牙搜索');
          }
        })
        that.getServiceId()//5.0
      },
      fail(err){
        console.log(err)
      }
    })
  },
  getServiceId() {
    var that = this
    wx.getBLEDeviceServices({
      deviceId: that.data.deviceId,
      success: function (res) {
        var model = res.services[0]
        that.setData({
          services: model.uuid
        })
        that.getCharacteId()//6.0
      }
    })
  },
  getCharacteId() {
    var that = this
    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.deviceId,
      serviceId: that.data.services,
      success: function (res) {
        for (var i = 0; i < res.characteristics.length; i++) {
          var model = res.characteristics[i]
          if (model.properties.notify == true) {
            that.setData({
              notifyId: model.uuid//监听的值
            })
            that.startNotice(model.uuid)//7.0
          }
          if (model.properties.write == true) {
            that.setData({
              writeId: model.uuid//用来写入的值
            })
            that.verify();
            setTimeout(function(){
              that.sendMy(that.string2buffer('780116'))
            },4000)
          }
        }
      }
    })
  },
  startNotice(uuid) {
    var that = this;
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: that.data.deviceId,
      serviceId: that.data.services,
      characteristicId: uuid, 
      success: function (res) {
        // 设备返回的方法
        wx.onBLECharacteristicValueChange(function (res) {
          // 此时可以拿到蓝牙设备返回来的数据是一个ArrayBuffer类型数据，所以需要通过一个方法转换成字符串
          var nonceId = that.ab2hex(res.value);
          console.log(nonceId)
    　　})
      }
   })
  },
  sendMy(buffer) {
    var that = this
    console.log(that.data.deviceId, that.data.services, that.data.writeId)
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.services,
      characteristicId: that.data.writeId,//写入的特征值
      value: buffer,
      success: function (res) {
        console.log(res)
        console.log("写入成功")
      },
      fail: function () {
        console.log('写入失败')
      },
    })
  },
  string2buffer(str) {
    let val = ""
    if (!str) return;
    let length = str.length;
    let index = 0;
    let array = []
    while (index < length) {
      array.push(str.substring(index, index + 2));
      index = index + 2;
    }
    val = array.join(",");
    // 将16进制转化为ArrayBuffer
    return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer
  },

  ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },
  codeBuffer(a,b){
    // var a = '112233445566'
    // var b = '445566112233'
    a = this.prefixInteger(parseInt(a, 16).toString(2),48).split('');
    b = this.prefixInteger(parseInt(b, 16).toString(2),48).split('');

    console.log(a,b)
    var c='';
    for(var i = 0;i<a.length;i++){
      c += a[i] & b[i]
    }
    console.log(c)
    c = this.prefixInteger(parseInt(c, 2).toString(16),12)
    console.log(c)
    return c
  },
  prefixInteger(num, length) {
    return(Array(length).join('0') + num).slice(-length);
  },
  verify(){
    var macId = this.data.deviceId.split(':').reverse().join('');
    console.log(macId);
    var macId2 = macId.slice(6) + macId.slice(0,6);
    console.log(macId2);
    var code = this.codeBuffer(macId, macId2);
    console.log('0x780x' + code + '0x16')
    console.log('78' + code + '16')
    // this.sendMy(this.string2buffer('0x780x' + code + '0x16'))
    this.sendMy(this.string2buffer('78' + code + '16'))
  },

})