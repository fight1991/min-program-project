var app = getApp()
Page({
  data: {
    no: ''
  },
  onLoad: function(options) {
    var that = this
    app.getUserInfo(function(userInfo) {
      that.setData({
        userInfo: userInfo,
        no: options.no,
        index: options.index
      })
    })
  },

  onReady: function() {

  },
  onShow: function() {

  },
  bindData: function(e) {
    var that = this
    that.setData({
      no: e.detail.value
    })
  },
  identify: function() {
    this.joinPicture()
  },
  joinPicture: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage("album");
          } else if (res.tapIndex == 1) {
            that.chooseWxImage("camera");
          }
        }
      }
    })
  },
  chooseWxImage: function(type, list) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: function(res) {
        wx.navigateTo({
          url: 'tailor?imageSrc=' + res.tempFilePaths[0] +'&isFromIdentify=' +true,
        })
      },
    })
  },
  confirm: function() {
    var that = this
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 3]
    var index = that.data.index
    var datas = prevPage.data.datas
    datas[index] = that.data.no.trim()
    prevPage.setData({
      datas: datas,
    })
    wx.navigateBack({
      delta: 2,
    })
  }
})