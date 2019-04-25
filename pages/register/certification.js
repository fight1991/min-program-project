Page({
  data: {
    tempFilePaths:[]
  },
  uploadlicense:function(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
      },
    })
  }
})