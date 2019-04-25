var app = getApp()
Page({
  data: {
    searchModel: {
      type: "SearchHighWaySure",
      batch_number: "",
      conveyance_no: "",
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
  //初始化数据
  initData: function (flag) {
    var that = this
    var path = "ManifestInfo"
    app.httpUtils.initData4ccba(that, flag, path)
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
    this.data.searchModel.conveyance_no = option.conveyance_no
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromDetailsToList')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    var datas = wx.getStorageSync('datass')
    that.setData({
      datas: datas
    })
  },
  //点击查询跳转查询页面
  showSearch: function (e) {
    this.setData({
      backFlag: true
    })
    wx.navigateTo({
      url: 'search?batch_number=' + this.data.searchModel.batch_number + '&voyage_no=' + this.data.searchModel.voyage_no
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