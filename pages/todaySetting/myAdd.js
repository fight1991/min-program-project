var app = getApp()
Page({
  data: {
    flight_id: "",
  },
  onLoad: function(options) {
    var that = this
    app.getUserInfo(function(userInfo) {
      that.setData({
        user_id: userInfo.userName
      })
    })
  },
  //获取输入框的值
  bindKeyInput: function(e) {
    this.setData({
      flightId: e.detail.value //获取输入框的值给变量iptVal
    })
  },
  //点击确定按钮 触发的事件
  btnClick: function(e) {
    if (this.data.flightId.trim().length == 0) {
      wx.showToast({
        title: '航班号不能为空',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '保存中...',
    })
    app.httpUtils.post('FlightDynamicHead', {
      user_id: this.data.user_id,
      type: '1',
      flight_id: this.data.flightId
    }, function(res) {
      wx.hideLoading()

      if (res.Success) {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
        wx.navigateBack({
          delta: 1,
        })
      } else {
        wx.showToast({
          title: res.ErrorMessage,
          icon: 'none'
        })
      }
    })
  }
})