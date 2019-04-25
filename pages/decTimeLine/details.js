var app = getApp()
Page({
  data: {
    obj: {},
  },
  onLoad: function (e) {
    app.authorize()
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    var obj = wx.getStorageSync('details');
    obj.TIME_0 = app.utils.dateFormatter(obj.TIME_0)
    obj.TIME_1 = app.utils.dateFormatter(obj.TIME_1)
    obj.TIME_2 = app.utils.dateFormatter(obj.TIME_2)
    obj.TIME_3 = app.utils.dateFormatter(obj.TIME_3)
    obj.TIME_4 = app.utils.dateFormatter(obj.TIME_4)
    obj.TIME_5 = app.utils.dateFormatter(obj.TIME_5)
    obj.TIME_6 = app.utils.dateFormatter(obj.TIME_6)
    obj.TIME_7 = app.utils.dateFormatter(obj.TIME_7)
    obj.TIME_8 = app.utils.dateFormatter(obj.TIME_8)
    obj.TIME_9 = app.utils.dateFormatter(obj.TIME_9)
    that.setData({
      obj: obj,
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo
      })
    })
  },
  onShow: function () {
    wx.setStorageSync('fromDetailsToList', 'false')
  },
  swichNav: function (e) {
    var that = this
    if (this.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  hide: function () {
    this.setData(
      {
        showModalStatus: false
      }
    )
  },
})  