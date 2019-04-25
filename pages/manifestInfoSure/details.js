var app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {
    var that = this
    var obj = JSON.parse(options.obj);
    that.setData({
      obj: obj,
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function () {
    wx.setStorageSync('fromDetailsToList', 'false')
  },
})