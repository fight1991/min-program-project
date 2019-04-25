var app = getApp()
Page({
  data: {
    searchModel: {
      seq_no: "",
    },
    obj: {}
  },
  onLoad: function (options) {
    var obj = JSON.parse(options.obj);
    this.setData({
      obj: obj,
    })
  },
  onReady: function () {

  },
  onShow: function () {
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