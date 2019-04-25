Page({
  data: {

  },
  toExcellent: function() {
    wx.redirectTo({
      url: 'excellentForBusiness',
    })
  },
  toIgnore: function() {
    wx.navigateBack({
      delta: 1,
    })
  }
})