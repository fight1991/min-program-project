var app = getApp()
Page({
  data: {
    searchModel: {
      entry_id: ""
    },
    decStatus:{},
    taxStatus: [],
    isShow: false,
    disabled: '',
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  search: function (e) {
    var that = this
    that.setData({
      disabled: 'disabled'
    })
    var that = this
    var entry_id = that.data.searchModel.entry_id
    if (typeof entry_id == "undefined" || entry_id == "" || entry_id.length != 18) {
      wx.showToast({
        icon: 'none',
        title: '报关单号格式不正确',
      })
      that.setData({
        disabled: ''
      })
    } else {
      var that = this
      var path = "ConnectState"
      wx.showLoading({
        title: '加载中',
      })
      app.httpUtils.get(path, {
        entry_id: that.data.searchModel.entry_id,
        accessName: '通关联网状态查询'
      }, function (data) {
        wx.hideLoading()
        if (data.Data5.isOk) {
          that.setData({
            decStatus: data.Data5.data.decStatus,
            taxStatus: data.Data5.data.taxStatus,
            isShow: true,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '查无数据',
          })
          that.setData({
            isShow: false,
          })
        }
        that.setData({
          disabled: ''
        })
      })
    }

  },
  scanCode: function (e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scanCode(function (data) {
      that.data.searchModel[key] = data.replace(/\*/g, "")
      var searchModel = that.data.searchModel
      that.setData({
        searchModel: searchModel
      })
      that.search()
    })
  },
  bindData: function (e) {
    console.log('**********************')
    console.log(e)
    console.log('**********************')
    var that = this
    app.utils.bindData(that, e)
  },
})