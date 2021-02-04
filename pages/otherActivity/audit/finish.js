Page({
  data: {

  },
  onLoad: function(options) {
    var that =this
    that.setData({
      activityModel: JSON.parse(options.activityModel)
    })
    wx.setNavigationBarTitle({
      title: that.data.activityModel.name,
    })
  }, 
  finish: function() {
    wx.reLaunch({
      url: '/pages/accountBind/accountBind'
    })
  }
})