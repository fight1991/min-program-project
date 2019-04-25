var app = getApp()
var WxParse = require('../../content/libs/wxParse/wxParse.js')
Page({
  data: {
    obj: {},
    show: false,
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.translater('更新日志'),
    })
    app.authorize()
    console.log(options)
    var that = this
    app.httpUtils.get('UpdateLog', { seq_no: options.seq_no }, function (data) {
      if (data.Success) {
        var item = data.Data5
        WxParse.wxParse('article_content', 'html', item.UPDATE_NOTE, that, 5)
        that.setData({
          obj: item,
          show: true,
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
    })
  },
  onShow: function () {
    wx.setStorageSync('fromDetailsToList', 'false')
  }
})