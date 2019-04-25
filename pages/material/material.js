
var app = getApp()
Page({
  data: {
    titles: ["查询"],
    searchModel: {
      enable: true,
      PageSize: 10,
      PageIndex: 1,
      site: "",
      code_t_s: "",
      cop_g_no: "",
      g_name: ""
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    status_flag: false,
    backFlag: true,
    load: 'true',
    fromDetailsToList: 'true',
    datas: [],
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
  showSearch: function (e) {
    this.setData({
      backFlag: true
    })
    wx.navigateTo({
      url: 'search?cop_g_no=' + this.data.searchModel.cop_g_no + '&g_name=' + this.data.searchModel.g_name + '&code_t_s=' + this.data.searchModel.code_t_s,
    })
  },
  initData: function (flag) {
    var that = this
    var path = "CopMaterial"
    app.httpUtils.initData(that, flag, path)
  },
  loadMore: function () {
    var that = this
    app.utils.loadMore(that)
  },
  show: function (e) {
    if (this.data.showFinish == true) {
      var id = e.currentTarget.id
      var cop_g_no = e.currentTarget.dataset.cop_g_no
      wx.navigateTo({
        url: 'details?ID=' + id + '&cop_g_no=' + cop_g_no
      })
    }
  },
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
    if (this.data.backFlag && this.data.load == 'true' && this.data.fromDetailsToList == 'true') {
      this.initData()
    }
    this.setData({ titles: [app.translater(this.data.titles[0])] })
  },
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: app.translater('企业物料')
    })
    app.authorize()
    this.data.searchModel.code_t_s = option.code_t_s
    this.data.searchModel.cop_g_no = option.cop_g_no
    this.data.searchModel.g_name = option.g_name
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromDetailsToList')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.data.searchModel.site = userInfo.site
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
  }
})