var app = getApp()
Page({
  data: {
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      category: ""
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    datas: [],
    backFlag: true,
    fromDetailsToList: 'true',
    obj: {},
    showList: false,
    status_flag: false,
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    showFinish: true
  },
  onLoad: function (options) {
    app.authorize()
    wx.removeStorageSync('fromDetailsToList')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    var category = options.category
    this.data.searchModel.category = category
    if (category == "PolicyLaw") {
      category = app.translater("政策法规")
    } else if (category == "Information") {
      category = app.translater("通知公告")
    } else if (category == "IndustryNews") {
      category = app.translater("动态信息")
    }
    wx.setNavigationBarTitle({ title: category })
    this.setData({
      category: category
    })
  },
  onShow: function () {
    this.data.fromDetailsToList = 'true'
    var fromDetailsToList = wx.getStorageSync('fromDetailsToList', 'false')
    wx.removeStorageSync('fromDetailsToList')
    if (fromDetailsToList == 'false') {
      this.setData({
        fromDetailsToList: fromDetailsToList
      })
    }
    if (this.data.backFlag && this.data.fromDetailsToList == 'true') {
      this.initData()
    }
  },
  scrollTop: function (e) {
    var that = this
    app.utils.scrollTop(that, e)
  },
  goTop: function (e) {
    var that = this
    app.utils.goTop(that)
  },
  loadMore: function () {
    var that = this
    app.utils.loadMore(that)
  },
  initData: function (flag) {
    var that = this
    var path = "Information"
    app.httpUtils.initData(that, flag, path)
  },
  showDetails: function (e) {
    var key = e.currentTarget.id
    wx.navigateTo({
      url: 'details?id=' + key + '&category=' + this.data.searchModel.category,
    })
  },
  touchStart: function (e) {
    this.setData({
      touchStart: e.touches[0].clientY
    })
  },
  touchMove: function (e) {
    var that = this
    app.utils.touchMove(that, e)
  },
  touchEnd: function (e) {
    var that = this
    app.utils.touchEnd(that)
  }
})