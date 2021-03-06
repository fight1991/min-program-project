var app = getApp()
Page({
  data: {
    searchModel: {
      batch_number: "",
      bill_no: "",
      accessName: '公路舱单查询'
    },
    datas: [],
    style: "back",
    disabled: ''
  },
  onLoad: function(options) {
    app.authorize()
    //控制页面跳转来源,并控制返回按钮的显示 
    if (options.from == "home") {
      this.setData({
        from: options.from,
        showBackTo: false
      })
    } else {
      this.setData({
        showBackTo: true
      })
    }
    if (options.isFromLogisticsTracking == 'true') {
      options['bill_no'] = options.billNo
    }
    this.data.searchModel["batch_number"] = typeof options.batch_number == "undefined" ? "" : options.batch_number
    this.data.searchModel["bill_no"] = typeof options.bill_no == "undefined" ? "" : options.bill_no
    //显示上一次查询数据
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
    })
    var that = this
    app.getUserInfo(function(userInfo) {
      that.data.searchModel.site = userInfo.site
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function() {
    wx.setStorageSync('fromDetailsToList', 'false')
    if (this.data.from == "home") {
      wx.setStorageSync('fromListToHome', 'false')
    } else {
      wx.setStorageSync('load', 'false')
    }
  },
  bindData: function(e) {
    var that = this
    app.utils.bindData(that, e)
  },
  search: function(e) {
    var that = this
    this.data.searchModel.type = "SearchHighWay"
    var batch_number = this.data.searchModel.batch_number
    var bill_no = this.data.searchModel.bill_no
    that.setData({
      disabled: 'disabled'
    })
    if ((typeof batch_number == "undefined" || batch_number == "") && (typeof bill_no == "undefined" || bill_no == "")) {
      wx.showToast({
        icon: 'none',
        title: '请输入最少一个条件',
      })
      that.setData({
        disabled: ''
      })
    } else {
      wx.showLoading({
        title: '查询中',
      })
      this.initData(function(data) {
        wx.hideLoading()
        if (data.Data5.data.length == 0) {
          wx.showToast({
            icon: 'none',
            title: '查无数据',
          })
        } else {
          wx.setStorageSync('datas', data.Data5.data)
          wx.navigateTo({
            url: 'manifestInfo'
          })
        }
        that.setData({
          disabled: ''
        })
      })
    }

  },
  initData: function(callback) {
    var that = this
    var url = "ManifestInfoForLand"
    // app.httpUtils.initData4ccba(that, callback, path)
    app.httpUtils.get(url, that.data.searchModel, callback)
  },
  //二维码扫描功能
  scanCode: function(e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scan(that, key)
  },
  reset: function() {
    this.data.searchModel.batch_number = ""
    this.data.searchModel.bill_no = ""
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel,
      type: ""
    })
  },
  backTo: function() {
    app.utils.backTo()
  },
  touchBegin: function() {
    var that = this
    app.utils.touchBegin(that)
  },
  touchOver: function() {
    var that = this
    app.utils.touchOver(that)
  }
})