var app = getApp()
Page({

  data: {
    urlPath: ''
  },
  onLoad: function(options) {
    var that = this
    app.getUserInfo(function(userInfo) {
      that.setData({
        urlPath: userInfo.platformHost + '/h5-active-bgy/index.html?prev=true&userId=' + userInfo.userName
      })
    })
  },
  onReady: function() {

  },
  onShow: function() {

  },
})