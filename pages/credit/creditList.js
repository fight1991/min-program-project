var app = getApp()
Page({
  data: {
    item: {},
    level:3
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.CorpName,
    })
    console.log(options)
    var that = this
    that.setData({
      seqNo: options.seqNo,
      saicSysNo: options.saicSysNo,
    })
    that.initData()
  },
  onReady: function() {

  },
  onShow: function() {

  },
  initData() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    app.httpUtils.post('CreditApi', {
      type: '003',
      user_id: app.globalData.cms_user.userName,
      seqNo: that.data.seqNo,
      saicSysNo: that.data.saicSysNo,
    }, function(data) {
      wx.hideLoading()
      if (data.Success) {
        var level = 3
        switch (data.Data5.COMMERCIAL_TYPE) {
          case "AEO高级认证企业":
            level = "1"
            break
          case "AEO一般认证企业":
            level = "2"
            break 
          case "一般信用企业":
            level = "3"
            break 
          case "失信企业":
            level = "4"
            break  
          default:
            level = "3"
            break  
        } 
        that.setData({
          item: data.Data5,
          level: level
        })
      }
    })
  }
})