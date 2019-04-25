var app = getApp()
Page({
  data: {
    pid: '',
    obj: {}
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      pid: options.pid
    })
    that.initData()
  },
  initData() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    app.httpUtils.get('ClassifyDecision', { PID: that.data.pid, accessName:'归类决定详情查询"' }, function (data) {
      wx.hideLoading()
      if (data.Success) {
        data.Data5.BEGIN_DATE = app.utils.dateTimeFormatter4TZ(data.Data5.BEGIN_DATE).substring(0,10)
        data.Data5.RELEASE_DATE = app.utils.dateTimeFormatter4TZ(data.Data5.RELEASE_DATE).substring(0, 10)
        that.setData({
          obj: data.Data5,
        })
      }
    })
  }
})