var app = getApp()
Page({
  data: {
    hiddenmodalput: true,
    hiddenmodalput1: true,
    hiddenmodalput2: true,
    mobile: ''
  },
  onShow: function () {
    this.setData({
      hiddenmodalput: true,
      hiddenmodalput1: true,
      hiddenmodalput2: true,
    });
  },
  signIn: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  signUp: function () {
    wx.reLaunch({
      url: 'signUp',
    })
  },
  bindData: function (e) {
    this.data.mobile = e.detail.value
  },
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  confirm: function () {
    var that = this
    if (that.data.mobile.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '内容不能为空',
      })
    } else if (!(/^1[3456789]\d{9}$/.test(that.data.mobile))) {
      wx.showToast({
        icon: 'none',
        title: '手机格式不正确',
      })
    } else {
      that.onShow()
      app.httpUtils.get('Sign', { mobile: that.data.mobile }, function (data) {
        if (data.Data5 != null) {
          that.setData({
            hiddenmodalput: true,
            hiddenmodalput1: false,
            hiddenmodalput2: true
          })
        } else {
          that.setData({
            hiddenmodalput: true,
            hiddenmodalput1: true,
            hiddenmodalput2: false
          })
        }
      })
    }
  },
  cancel4hint: function () {
    this.setData({
      hiddenmodalput1: true
    });
  },
  confirm4hint: function () {
    this.setData({
      hiddenmodalput1: !this.data.hiddenmodalput1
    });
  },
})