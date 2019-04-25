var app = getApp()
var WxParse = require('../../content/libs/wxParse/wxParse.js')
Page({
  data: {
    obj: {},
    show: false
  },
  onLoad: function (options) {
    var category = options.category
    if (category == "PolicyLaw") {
      category = app.translater("政策法规")
    } else if (category == "Information") {
      category = app.translater("通知公告")
    } else if (category == "IndustryNews") {
      category = app.translater("动态信息")
    }
    app.authorize()
    var that = this
    wx.setNavigationBarTitle({ title: category })
    wx.showLoading({
      title:'加载中...'
    })
    app.httpUtils.get('Information', { id: options.id }, function (data) {
      if (data.Success) {
        var item = data.Data5
        if (item.EditTime != null) {
          item.EditTime = app.utils.dateTimeFormatter(item.EditTime)
        } else {
          item.EditTime = ' '
        }
        WxParse.wxParse('article_content', 'html', item.Content, that, 5)
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
      wx.hideLoading()
    })
  },
  onShow: function () {
    wx.setStorageSync('fromDetailsToList', 'false')
  },
  wxParseTagATap: function (e) {
    var url = "https://51baoguan.cn/APi/File/?actionName=" + encodeURI(e.currentTarget.dataset.src)
    console.log(url)
    if (url == 'https://51baoguan.cn/APi/File/?actionName=http://') {
      return
    }
    var last = url.substring(url.lastIndexOf('.'))
    if (last != ".html" && last != ".htm") {
      app.httpUtils.preview(url, url.substring(url.lastIndexOf('.')))
    }
  }
})