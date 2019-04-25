var app = getApp()
Page({
  data: {
    provinces: [],
  },
  onLoad: function(options) {
    var that = this

    that.setData({
      country: options.country,
      code: options.code
    })
    wx.showLoading({
      title: '加载中...'
    })
    app.platformApi.dictionary("/dictionary/getAllProvince", that.data.code, function(data) {
      wx.hideLoading()
      that.setData({
        provinces: data.result
      })
    })
  },
  onReady: function() {

  },
  onShow: function() {

  },
  showCity(e) {
    var that = this
    app.platformApi.dictionary("/dictionary/getAllCity", e.currentTarget.dataset.codefield, function (data) {
      wx.hideLoading()
      if (data.result.length > 0) {
        wx.navigateTo({
          url: 'city?country='+that.data.country+'&province=' + e.currentTarget.dataset.namefield + '&code=' + e.currentTarget.dataset.codefield,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 3]
        var addressModel = prevPage.data.addressModel
        addressModel.city = that.data.country+ e.currentTarget.dataset.namefield
        prevPage.setData({
          addressModel: addressModel
        })
        wx.navigateBack({
          delta: 2
        })
      }
    })
  }
})