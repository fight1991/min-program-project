var app = getApp()
Page({
  data: {
    searchModel: {
      seq_no: "",
      accessName: '客户详情查询'
    },
    obj: {},
  },
  onLoad: function (options) {
    this.data.searchModel["seq_no"] = options.seq_no
    wx.setNavigationBarTitle({
      title: options.customer_id
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
    app.httpUtils.get('Customer', that.data.searchModel, function (data) {
      if (data.Success) {
        that.setData({
          obj: data.Data5,
        })
      }
    })
  },
})