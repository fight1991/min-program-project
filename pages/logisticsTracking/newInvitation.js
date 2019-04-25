var app = getApp()
Page({

  data: {
    LogisticsAdviceList: [],
    msgPid: '',
    isShow: false
  },
  onShow: function() {
    this.init()
  },
  init: function() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    app.platformApi.logistics("/logistics/queryLogisticsAdviceList", null, function(data) {
      if (data.code == '0000') {
        that.setData({
          LogisticsAdviceList: data.result.logisticsAdviceList
        })
        wx.hideLoading()
      }
    })
  },
  showDetails: function(e) {
    var roles = e.currentTarget.dataset.roles
    var status = e.currentTarget.dataset.status
    if (status == '4') {
      wx.setStorageSync("invitation", JSON.stringify({
        logPid: e.currentTarget.id,
        roleList: e.currentTarget.dataset.roles,
      }))
      wx.navigateTo({
        url: '/pages/logisticsTracking/details?logPid=' + e.currentTarget.id
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitation/invitation?sence=notice&logPid=' + e.currentTarget.id + '&roleList=' + roles.join(',') + '&status=' + status
      })
    }
  },
  deleteInvitation: function(e) {
    var that = this
    that.data.msgPid = e.currentTarget.dataset.msgpid
    that.myDialog = that.selectComponent("#myDialog")
    that.myDialog.showDialog()
  },
  cancelEvent: function() {
    var that = this
    this.myDialog.hideDialog();
  },
  confirmEvent: function(msgPid) {
    var that = this
    this.myDialog.hideDialog();
    that.setData({
      isShow: false
    })
    wx.showLoading({
      title: '删除中...',
    })
    app.platformApi.logistics("/logistics/delMsg", {
      msgPid: that.data.msgPid
    }, function(data) {
      wx.hideLoading()
      if (data.code == '0000') {
        wx.showToast({
          title: '删除成功',
        })
        setTimeout(function() {
          that.onShow()
        }, 1000)
      } else {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
      }
    })
  }
})