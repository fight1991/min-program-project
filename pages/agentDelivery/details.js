var app = getApp()
Page({
  data: {
    searchModel: {
      seq_no: "",
      accessName: '提送货详情查询'
    },
    obj: {},
  },
  onLoad: function (options) {
    this.data.searchModel["seq_no"] = options.seq_no
    wx.setNavigationBarTitle({
      title: options.agent_code,
    })
    var that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {
    var that = this
    app.httpUtils.get('Agent', that.data.searchModel, function (data) {
      if (data.Success) {
        that.setData({
          obj: data.Data5,
        })
      }
    })
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
})