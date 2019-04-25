var app = getApp()
Page({
  data: {
    countrys: [],
  },
  onLoad: function(options) {
    var that = this
    that.setData({
      type: options.type,
      name: options.name
    })
    wx.showLoading({
      title: '加载中...'
    })
    app.platformApi.dictionary("/dictionary/getAllCountry", null, function(data) {
      var countrys=[]
      countrys.push(data.result[0])
      wx.hideLoading()
      if (options.type=='2'){
        that.setData({
          countrys: countrys
        })
      }else{
        that.setData({
          countrys: data.result
        })
      }

    })
  },
  onReady: function() {

  },
  onShow: function() {

  },
  showProvince(e) {
    var that = this
    app.platformApi.dictionary("/dictionary/getAllProvince", e.currentTarget.dataset.codefield, function(data) {
      wx.hideLoading()
      if (data.result.length > 0) {
        wx.navigateTo({
          url: 'province?country=' + e.currentTarget.dataset.namefield + '&code=' + e.currentTarget.dataset.codefield,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      } else {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]
        var addressModel = prevPage.data.addressModel
        addressModel.city = e.currentTarget.dataset.namefield
        prevPage.setData({
          addressModel: addressModel
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})