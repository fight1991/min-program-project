var app = getApp()
Page({

  data: {
    urlPath: ''
  },
  onLoad: function(options) {
    var that = this
    app.getUserInfo(function(userInfo) {
      
      app.platformApi.commonApi("/user/getUserDefaultCorp", {}, function(data) {
        if (data.code == '0000') {
          that.setData({
            urlPath: userInfo.platformHost + '/excellent-company-5/index.html?prev=true&corpId=' + data.result.corpId
          })
        }
      })
    })

  },
  onReady: function() {

  },
  onShow: function() {

  },
})