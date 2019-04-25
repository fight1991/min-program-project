var app = getApp()
Page({
  data: {
    titles: ["查询"],
    titless: {},
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      site: "",
      trade_code: "",
      ems_no: "",
      ems_type: "E"
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    datas: [],
    status_flag: false,
    backFlag: true,
    load: 'true',
    showList: false,
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    showFinish: true,
    //从按钮页面回到表头展示页面判断是否查询标识
    fromButtonToHead: 'true'
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
    var path = "CusHead"
    app.httpUtils.initData(that, flag, path)
  },
  onLoad: function (options) {
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titles: [app.translater(this.data.titles[0])],
      titless: tmp
    })
    app.authorize()
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromButtonToHead')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.data.searchModel.site = userInfo.site
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function () {
    wx.setStorageSync('fromListToHome', 'false')
    this.data.load = 'true'
    var load = wx.getStorageSync('load')
    var fromButtonToHead = wx.getStorageSync('fromButtonToHead')
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromButtonToHead')
    if (load == 'false') {
      this.setData({
        load: load
      })
    }
    if (fromButtonToHead == 'false') {
      this.setData({
        fromButtonToHead: fromButtonToHead
      })
    }
    if (this.data.backFlag && this.data.load == 'true' && this.data.fromButtonToHead == 'true') {
      this.initData()
    }
  },
  showSearch: function (e) {
    this.setData({
      backFlag: true
    })
    wx.navigateTo({
      url: 'search?trade_code=' + this.data.searchModel.trade_code + "&ems_no=" + this.data.searchModel.ems_no,
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
  showButton: function (e) {
    var that = this
    app.utils.showButton(that, e)
  }
})