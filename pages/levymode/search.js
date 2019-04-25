var app = getApp()
Page({
  data: {
    datas: [],
    style: "back"
  },
  onLoad: function (options) {
    app.authorize()
    this.data.searchModel = app.searchModel
    if (typeof (options.duty_mode) != "undefined") {
      this.data.searchModel["duty_mode"] = options.duty_mode
      this.data.searchModel["duty_spec"] = options.duty_spec
    }
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
    })
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function () {
    wx.setStorageSync('load', 'false')
  },
  bindData: function (e) {
    var that = this
    app.utils.bindData(that, e)
  },
  search: function (e) {
    app.utils.search(this.data.searchModel)
  },
  backTo: function () {
    app.utils.backTo()
  },
  touchBegin: function () {
    var that = this
    app.utils.touchBegin(that)
  },
  touchOver: function () {
    var that = this
    app.utils.touchOver(that)
  },
  scanCode: function (e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scan(that, key)
  }
})