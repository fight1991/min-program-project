var app = getApp()
Page({
  data: {
    searchModel: {},
    disabled: '',
    isOperation: 'true'
  },

  onLoad: function(options) {
    var that = this
    var isOperation = options.isOperation
    this.setData({
      isOperation: isOperation,
      searchModel: {
        logPid: options.logPid,
        nodeNo: options.nodeNo,
      }
    })
    if (options.isDetails == 'true') {
      that.data.searchModel.entryId = options.entryId
      that.setData({
        searchModel: that.data.searchModel
      })
    }
  },
  onShow: function() {

  },

  scanCode: function(e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scan(that, key)
  },
  confirm: function() {
    var that = this
    if (typeof that.data.searchModel.entryId == 'undefined' || that.data.searchModel.entryId.trim() == '' || that.data.searchModel.entryId.length != 18) {
      wx.showToast({
        icon: 'none',
        title: '请填写18位海关编码',
      })
      return
    }
    that.setData({
      disabled: 'disabled'
    })
    app.platformApi.logistics("/logistics/editeNode",
      that.data.searchModel,
      function(data) {
        if (data.code == '0000') {
          wx.showToast({
            title: '编辑成功',
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)

        } else {
          that.setData({
            disabled: ''
          })
          wx.showToast({
            title: '编辑失败',
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        }
      })
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.searchModel[id] = e.detail.value
  },
})