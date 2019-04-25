Page({
  data: {
    code1: '<',
    code2: '>'
  },
  onLoad: function(options) {
    var that = this
    var index = options.index
    that.setData({
      index: index
    })
    if (index == 0) {
      wx.setNavigationBarTitle({
        title: '第一期'
      })
    } else if (index == 1) {
      wx.setNavigationBarTitle({
        title: '第二期'
      })
    } else if (index == 2) {
      wx.setNavigationBarTitle({
        title: '第三期'
      })
    }
  },
  onReady: function() {

  },
  onShow: function() {

  },
})