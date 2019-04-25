var app = getApp()
Page({
  data: {},
  onLoad: function(options) {
    this.data.userId = options.userId
    this.getCorpContactWay(options.userId, options.corpId)

    this.setData({
      corpName: options.corpName
    })
  },
  getCorpContactWay: function(userId, corpId) {
    var that = this
    app.platformApi.commonApi("/user/getCorpContactWay", {
      "userId": userId,
      "corpId": corpId
    }, function(data) {
      if (data.code == "0000") {
        if (data.result) {
          that.setData({
            corp: data.result
          })
        } else {
          wx.showToast({
            icon: "none",
            title: "查无数据",
            duration: 2000
          })
          that.goBack()
        }
      } else {
        wx.showToast({
          icon: "none",
          title: data.message,
          duration: 2000
        })
        that.goBack()
      }
      console.log(data)
    })
  },
  goBack: function() {
    setTimeout(function() {
      wx.navigateBack()
    }, 2000)
  }
})