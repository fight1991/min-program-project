// pages/accountBind/accountBind.js
import WxValidate from '../../utils/WxValidate'
const app = getApp()
Page({
  data: {
    currentUser: {},
  },
  nextstep: function () {
    var that = this
    wx.showLoading({
    })
    app.httpUtils.get('User', { userName: that.data.currentUser.userId, sms_type: "003" }, function (data) {
      if (data.Data5.Success) {
        wx.navigateTo({
          url: 'resetpw?mobile=' + data.Data5.ErrorMessage + '&username=' + that.data.currentUser.userId,
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: data.Data5.ErrorMessage
        })
      }
      wx.hideLoading()
    })
  },
  bindData: function (e) {
    var id = e.currentTarget.id
    this.data.currentUser[id] = e.detail.value
  },
})