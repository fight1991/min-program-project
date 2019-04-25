var app = getApp()
Page({
  data: {
    searchModel: {
      enable: true,
      PageIndex: 1,
      PageSize: 10,
      DECISION_NO: "",
      CODE_TS: "",
      G_NAME: "",
      G_DESCRIPTION: "",
      accessName: '归类决定查询'
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    status_flag: false,
    datas: [],
    obj: {},
    load: 'true',
    fromDetailsToList: 'true',
    backFlag: true,
    showList: false,
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    showFinish: true
  },
  scrollTop: function(e) {
    var that = this
    app.utils.scrollTop(that, e)
  },
  goTop: function(e) {
    var that = this
    app.utils.goTop(that)
  },
  loadMore: function() {
    var that = this
    if (!app.globalData.isAllRecord) {
      that.data.searchModel.accessName = ''
    }
    app.utils.loadMore(that)
  },
  onLoad: function(options) {
    app.authorize()
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromDetailsToList')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function(userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function() {
    wx.setStorageSync('fromListToHome', 'false')
    this.data.load = 'true'
    this.data.fromDetailsToList = 'true'
    var load = wx.getStorageSync('load')
    var fromDetailsToList = wx.getStorageSync('fromDetailsToList', 'false')
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromDetailsToList')
    if (load == 'false') {
      this.setData({
        load: load
      })
    }
    if (fromDetailsToList == 'false') {
      this.setData({
        fromDetailsToList: fromDetailsToList
      })
    }
    if (this.data.backFlag && this.data.load == 'true' && this.data.fromDetailsToList == 'true') {
      this.initData()
    }
  },
  initData: function(flag) {
    var that = this
    var path = "ClassifyDecision"
    app.httpUtils.initData(that, flag, path)
  },
  showSearch: function(e) {
    this.setData({
      backFlag: true
    })
    wx.navigateTo({
      url: 'search?DECISION_NO=' + this.data.searchModel.DECISION_NO + '&CODE_TS=' + this.data.searchModel.CODE_TS + '&G_NAME=' + this.data.searchModel.G_NAME + '&G_DESCRIPTION=' + this.data.searchModel.G_DESCRIPTION,
    })
  },
  showDetails: function(e) {
    wx.navigateTo({
      url: 'details?pid=' + e.currentTarget.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})