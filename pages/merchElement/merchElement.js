var app = getApp()
Page({
  data: {
    titles: ["查询", "返回", "是否可空", "序号"],
    titless: {},
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 15,
      condition: "",
      accessName: '申报要素查询'
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
  showSearch: function(e) {
    this.setData({
      backFlag: true
    })
    wx.navigateTo({
      url: 'search?code_ts=' + this.data.searchModel.code_ts
    })
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
  initData: function(flag) {
    var that = this
    var path = "MerchElement"
    app.httpUtils.initData(that, flag, path)
  },
  onLoad: function(options) {
    var tmp = {};
    this.data.titles.forEach(function(value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    wx.setNavigationBarTitle({
      title: app.translater('规范申报要素')
    })
    app.authorize()
    wx.removeStorageSync('load')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function(userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function() {
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
    this.setData({
      titles: [app.translater(this.data.titles[0]), app.translater(this.data.titles[1]), app.translater(this.data.titles[2]), app.translater(this.data.titles[3])]
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
  },
  search: function() {
    this.data.datas = []
    this.data.searchModel.PageIndex = 1,
      this.initData()
  },
  bindData: function(e) {
    var that = this
    app.utils.bindData(that, e)
  },
})