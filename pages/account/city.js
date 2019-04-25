var app = getApp()
Page({
  data: {
    citys: [],
  },
  onLoad: function(options) {
    var that = this

    that.setData({
      country: options.country,
      province: options.province,
      code: options.code
    })
    wx.showLoading({
      title: '加载中...'
    })
    app.platformApi.dictionary("/dictionary/getAllCity", that.data.code, function(data) {
      wx.hideLoading()
      that.setData({
        citys: data.result
      })
    })
  },
  showCity(e) {
    var that = this
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 4]
    var addressModel = prevPage.data.addressModel
    addressModel.city = that.data.country+that.data.province+ e.currentTarget.dataset.namefield
    prevPage.setData({
      addressModel: addressModel
    })
    wx.navigateBack({
      delta: 3
    })
  }
})