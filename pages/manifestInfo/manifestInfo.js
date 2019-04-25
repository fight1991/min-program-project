var app = getApp()
Page({
  data: {
    searchModel: {
      type: "SearchHighWay",
      batch_number: "",
      bill_no: "",
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
  scrollTop: function (e) {
    var that = this
    app.utils.scrollTop(that, e)
  },
  goTop: function (e) {
    var that = this
    app.utils.goTop(that)
  },
  //滚动加载数据
  loadMore: function () {
    var that = this
    app.utils.loadMore(that)
  },
  //点击查看明细
  showDetails: function (e) {
    if (this.data.showFinish == true) {
      var model = this.data.datas[e.currentTarget.dataset.index]
      wx.navigateTo({
        url: 'details?obj=' + JSON.stringify(model)
      })
    }
  },
  //页面每次刷新
  onShow: function () {
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
  },
  onLoad: function (option) {
    app.authorize()
    this.data.searchModel.batch_number = option.batch_number
    this.data.searchModel.bill_no = option.bill_no
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromDetailsToList')
    var datas = wx.getStorageSync('datas')
    var that = this
    that.setData({
      datas: datas
    })
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  //点击查询跳转查询页面
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