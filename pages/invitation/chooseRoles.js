var app = getApp()
Page({

  data: {
    roles: [],
    showModal: false,
    reqData: {}
  },
  onLoad: function(options) {
    var that = this
    that.setData({
      roleTypeStr: options.roleTypeStr,
      logPid: options.logPid
    })
    that.getRoles()
  },
  onReady: function() {

  },
  onShow: function() {

  },
  getRoles: function() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    app.platformApi.logistics("/logistics/getOtherRole", {
      "logPid": that.data.logPid,
      "roleList": []
    }, function(data) {
      wx.hideLoading()
      var roles = []
      if (data.code == '0000') {
        data.result.otherRole.forEach(function(val, index) {
          if (that.data.roleTypeStr == val.roleTypeStr) {
            val['checked'] = true
          } else {
            val['checked'] = false
          }
        })
        that.setData({
          roles: data.result.otherRole
        })
      }
    })
  },
  addRole: function() {
    var that = this
    this.setData({
      showModal: true
    })
  },
  addNewRole: function() {
    var that = this
    wx.showLoading({
      title: '添加中...',
    })
    that.setData({
      showModal: false
    })
    app.platformApi.logistics("/logistics/addOtherRole", {
      "logPid": that.data.logPid,
      "otherType": that.data.reqData.otherType
    }, function(data) {
      wx.hideLoading()
      var roles = []
      if (data.code == '0000') {
        wx.showToast({
          title: '添加成功',
        })
        that.getRoles()
      } else {
        wx.showToast({
          icon: 'none',
          title: '添加失败',
        })
      }
    })
  },
  hideModal: function() {
    this.setData({
      showModal: false
    })
  },
  inputChange: function(e) {
    var that = this
    that.data.reqData['otherType'] = e.detail.value
  },
  radioChange(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]
    var roleVo = prevPage.data.roleVo
    roleVo.roleTypeStr = e.detail.value.split('~')[0]
    roleVo.roleType = e.detail.value.split('~')[1]
    prevPage.setData({
      roleVo: roleVo,
    })
    wx.navigateBack({
      delta: 1
    })
  }
})