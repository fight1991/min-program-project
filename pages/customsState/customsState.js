var app = getApp()
Page({
  data: {
    isSearch: false,
    isData: false,
    searchNone: true,
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      site: "",
      entry_id: ""
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    seq_no: "",
    datas: [],
    load: 'true',
    status_flag: false,
    backFlag: true,
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
  onLoad: function (option) {
    app.authorize()
    wx.removeStorageSync('load')
    var that = this
    that.data.searchModel.entry_id = option.entry_id
    that.data.isSearch = option.isSearch
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    that.setData({
      obj: JSON.parse(option.obj)
    })
  },
  onShow: function () {
    this.data.fromDetailsToList = 'true'
    var fromDetailsToList = wx.getStorageSync('fromDetailsToList', 'false')
    wx.setStorageSync('fromListToHome', 'false')
    this.data.load = 'true'
    var load = wx.getStorageSync('load')
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromDetailsToList')
    if (fromDetailsToList == 'false') {
      this.setData({
        fromDetailsToList: fromDetailsToList
      })
    }
    if (load == 'false') {
      this.setData({
        load: load
      })
    }
  },
  showSearch: function (e) {
    this.setData({
      backFlag: true
    })
    wx.navigateTo({
      url: 'search?entry_id=' + this.data.searchModel.entry_id,
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