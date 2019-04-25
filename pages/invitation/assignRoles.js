var app = getApp()
Page({
  data: {
    isShow: true,
    obj: {},
    msg_users: [],
    isShow: false,
    roleVo: {}
  },
  onLoad: function(options) {
    if (wx.getStorageSync("invitation")) {
      var invitation = JSON.parse(wx.getStorageSync("invitation"))
      this.setData({
        logPid: invitation.logPid,
        roleList: invitation.roleList
      })
      wx.removeStorageSync("invitation")
    }
  },
  onShow: function() {
    this.getRoleNodes()
    console.log(this.data.msg_users)
  },
  getRoleNodes: function() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    app.platformApi.logistics("/logistics/getTrackingNodeInfo", {
      logPid: this.data.logPid,
      roleList: this.data.roleList
    }, function(data) {
      wx.hideLoading()
      if (data.code == '0000') {
        that.setData({
          roleLists: data.result.roleList,
          roles: data.result.roleTypeVOList,
          unboundNodeRate: data.result.unboundNodeRate
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  del: function(e) {
    var that = this
    that.myDialog = that.selectComponent("#myDialog")
    that.myDialog.showDialog()
    that.data.roleVo = {
      logPid: that.data.logPid,
      roleType: e.currentTarget.dataset.roletype,
      roleUserId: e.currentTarget.dataset.roleuserid
    }
  },
  addforward: function(e) {
    this.data.trackingNo = e.currentTarget.dataset.trackingno
    var roleVo = {
      logPid: this.data.logPid,
      roleType: e.currentTarget.dataset.type,
      trackingNo: e.currentTarget.dataset.trackingno,
      roleUserId: ""
    }
    wx.setStorageSync("roleVo", JSON.stringify(roleVo))
    wx.navigateTo({
      url: 'chooseNode?roleTypeStr=' + e.currentTarget.dataset.roletypestr
    })
  },
  showDetail: function(e) {
    var roleVo = {
      logPid: this.data.logPid,
      roleType: e.currentTarget.dataset.type,
      roleUserId: e.currentTarget.dataset.roleuserid
    }
    console.log(roleVo)
    wx.setStorageSync("roleVo", JSON.stringify(roleVo))
    wx.navigateTo({
      url: 'chooseNode?roleTypeStr=' + e.currentTarget.dataset.roletypestr + '&i=' + e.currentTarget.dataset.i
    })
  },
  confirm: function() {
    var that = this
    app.platformApi.logistics("/logistics/complete", {
      logPid: this.data.logPid,
      roleList: this.data.roleList
    }, function(data) {
      if (data.code == '0000') {
        that.setData({
          roles: data.result
        })
        if (wx.getStorageSync('isFromInvitation') == 'true') {
          wx.setStorageSync('invitation', JSON.stringify({
            logPid: that.data.logPid,
            roleList: that.data.roleLists
          }))
          wx.removeStorageSync('isFromInvitation')
          wx.removeStorageSync('dataFromInvitation')
          wx.redirectTo({
            url: '/pages/logisticsTracking/details',
          })
        } else {
          wx.navigateBack({
            delta: 1,
          })
        }
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  confirmEvent: function() {
    var that = this
    wx.showLoading({
      title: '删除中...',
    })
    app.platformApi.logistics("/logistics/delRole", that.data.roleVo, function(data) {
      that.myDialog.hideDialog();
      wx.hideLoading()
      if (data.code == '0000') {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        that.getRoleNodes()
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  cancelEvent: function() {
    var that = this
    this.myDialog.hideDialog();
  }
})