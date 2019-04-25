var app = getApp()
Page({
  data: {
    corp: {},
    corpNames: []
  },
  onLoad: function(options) {
    this.data.corpId = options.corpId
  },
  onShow:function(){
    this.getCorpContactWay(this.data.corpId)
    this.getCorps() 
  },
  getCorps: function() {
    var that = this
    app.platformApi.commonApi("/user/queryUserCorps", {
      corpStatusList: [],
      corpTypes: []
    }, function(data) {
      if (data.code == "0000") {
        if (data.result.length > 0) {
          var tmp = []
          data.result.forEach(function(value) {
            tmp.push(value.corpName)
          })
          that.setData({
            corps: data.result,
            corpNames: tmp
          })
        } else {
          wx.showToast({
            icon: "none",
            title: "查无数据",
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          icon: "none",
          title: data.message,
          duration: 2000
        })
      }
      console.log(data)
    })
  },
  getCorpContactWay: function(corpId) {
    var that = this
    app.platformApi.commonApi("/user/getCorpContactWay", {
      "userId": "",
      "corpId": corpId
    }, function(data) {
      if (data.code == "0000") {
        that.setData({
          corp: data.result
        })
      } else {
        wx.showToast({
          icon: "none",
          title: data.message,
          duration: 2000
        })
        that.goBack()
      }
      console.log(data)
    })
  },
  changeSite: function() {
    var that = this
    console.log(this.data.corpNames)
    wx.showActionSheet({
      itemList: this.data.corpNames,
      success: function(res) {
        console.log(that.data.corps[res.tapIndex])  
        that.getCorpContactWay(that.data.corps[res.tapIndex].corpId)
        that.data.corpId = that.data.corps[res.tapIndex].corpId
      }
    })
  },
  showDetail: function(e) {
    var pid = e.currentTarget.dataset.pid
    var corpid = e.currentTarget.dataset.corpid
    var address = e.currentTarget.dataset.address
    var addresstel = e.currentTarget.dataset.addresstel
    var belong = e.currentTarget.dataset.belong
    if (belong =="corp"){
      return
    }
    var address_key = corpid + "" + pid + "address"
    var addressTel_key = corpid + "" + pid + "addressTel"
 
    wx.setStorageSync(address_key, address)
    wx.setStorageSync(addressTel_key, addresstel)

    wx.navigateTo({
      url: 'address-edit?pid=' + pid + '&corpid=' + corpid + "&op=1"
    })
  },
  add: function() {
    wx.navigateTo({
      url: 'address-edit?corpid=' + this.data.corpId + "&op=0"
    })
  },
  goBack: function() {
    setTimeout(function() {
      wx.navigateBack({
        delta: 1,
      })
    }, 2000)
  }
})