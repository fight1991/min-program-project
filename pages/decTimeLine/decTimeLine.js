var app = getApp()
Page({
  data: {
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      begin_date: "",
      end_date: "",
      company: "",
      i_e_flag: "",
      site: "",
      accessName: '操作时效查询'
    },
    hidden: 'hidden',
    visible: 'visible',
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    datas: [],
    status_flag: false,
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
  initData: function(flag) {
    var that = this
    var path = "DecTimeLine"
    app.httpUtils.initData(that, flag, path)
  },
  loadMore: function() {
    var that = this
    if (!app.globalData.isAllRecord) {
      that.data.searchModel.accessName = ''
    }
    app.utils.loadMore(that)
  },
  showSearch: function(e) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      backFlag: false
    })
    wx.navigateTo({
      url: 'search?company=' + this.data.searchModel.company + '&begin_date=' + this.data.searchModel.begin_date + '&end_date=' + this.data.searchModel.end_date + '&i_e_flag=' + this.data.searchModel.i_e_flag,
    })
  },
  show: function(e) {
    var model = this.data.datas[e.currentTarget.dataset.index]
    wx.removeStorageSync('details')
    wx.setStorageSync('details', model)
    wx.navigateTo({
      url: 'details'
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
  onLoad: function(options) {
    app.authorize()
    this.data.searchModel.i_e_flag = options.i_e_flag
    this.data.searchModel.company = options.company
    this.data.searchModel.begin_date = options.begin_date
    this.data.searchModel.end_date = options.end_date
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromDetailsToList')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function(userInfo) {
      that.data.searchModel.site = userInfo.site
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  touchStart: function(e) {
    this.setData({
      touchStart: e.touches[0].clientY
    })
  },
  touchMove: function(e) {
    var that = this
    app.utils.touchMove(that, e)
  },
  touchEnd: function(e) {
    var that = this
    app.utils.touchEnd(that)
  }
})