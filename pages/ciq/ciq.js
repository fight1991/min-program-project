var app = getApp()
Page({
  data: {
    titles: ["查询", "监管条件", "类别"],
    titless: {},
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      condition: "",
      accessName: '法检目录查询'
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
    var path = "Ciq"
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
      title: app.translater('法检目录')
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
      titles: [app.translater(this.data.titles[0]), app.translater(this.data.titles[1]), app.translater(this.data.titles[2])]
    })
  },
  showSearch: function(e) {
    this.setData({
      backFlag: true
    })
    wx.navigateTo({
      url: 'search?code_t_s=' + this.data.searchModel.code_t_s + '&g_name=' + this.data.searchModel.g_name,
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