var app = getApp()
Page({
  data: {
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      id: '',
      op: '03',
      condition: ""
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    datas: [],
    obj: {},
    status_flag: false,
    backFlag: true,
    load: 'true',
    showModalStatus: false,
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
  loadMore: function () {
    var that = this
    app.utils.loadMore(that)
  },
  initData: function (flag) {
    var that = this
    var path = "Complex"
    app.httpUtils.initData(that, flag, path)
  },
  onShow: function () {
    this.data.load = 'true'
    var load = wx.getStorageSync('load')
    wx.removeStorageSync('load')
    if (load == 'false') {
      this.setData({
        load: load
      })
    }
    if (this.data.backFlag && this.data.load == 'true') {
      this.initData()
    }
  },
  onLoad: function (options) {
    this.data.searchModel.id = options.id
    app.authorize()
    wx.removeStorageSync('load')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
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
  },
  search: function () {
    this.data.datas = []
    this.data.searchModel.PageIndex = 1,
      this.initData()
  },
  bindData: function (e) {
    var that = this
    app.utils.bindData(that, e)
  },
  showSecondary: function (e) {
    wx.navigateTo({
      url: 'forthDetails?id=' + e.currentTarget.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})