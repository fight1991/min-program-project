var app = getApp()
Page({
  data: {
    titles: ["查询", "返回", "名称", "申报要素", "法定单位", "第二单位", "最惠国进口税率", "普通进口税率", "暂定进口税率", "消费税率", "出口税率", "出口退税率", "协定税率", "增值税率", "监管条件", "检验检疫类别", "备注", "关闭"],
    titless: {},
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      condition: "",
      accessName: "税则查询"
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    datas: [],
    backFlag: true,
    load: 'true',
    obj: {},
    status_flag: false,
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
    if (!app.globalData.isAllRecord) {
      that.data.searchModel.accessName = ''
    }
    app.utils.loadMore(that)
  },
  initData: function (flag) {
    var that = this
    var path = "CodeTs"
    app.httpUtils.initData(that, flag, path)
  },
  onLoad: function (options) {
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    wx.setNavigationBarTitle({
      title: app.translater('税则')
    })
    app.authorize()
    wx.removeStorageSync('load')
    var that = this
    app.utils.getSystemInfo(that)
    if (typeof (options.code_ts) != "undefined") {
      this.data.searchModel["code_ts"] = options.code_ts
      this.data.searchModel["g_name"] = options.g_name
    }
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
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
    this.setData({
      titles: [app.translater(this.data.titles[0]), app.translater(this.data.titles[1]), app.translater(this.data.titles[2]), app.translater(this.data.titles[3]), app.translater(this.data.titles[4]), app.translater(this.data.titles[5]), app.translater(this.data.titles[6]), app.translater(this.data.titles[7]), app.translater(this.data.titles[8]), app.translater(this.data.titles[9]), app.translater(this.data.titles[10]), app.translater(this.data.titles[11]), app.translater(this.data.titles[12]), app.translater(this.data.titles[13]), app.translater(this.data.titles[14]), app.translater(this.data.titles[15]), app.translater(this.data.titles[16]), app.translater(this.data.titles[17])]
    })
  },
  showSearch: function (e) {
    this.setData({
      backFlag: true
    })
    wx.navigateTo({
      url: 'search?code_ts=' + this.data.searchModel.code_ts + '&g_name=' + this.data.searchModel.g_name,
    })
  },
  showDetails: function (e) {
    wx.navigateTo({
      url: 'details?CODE_TS=' + e.currentTarget.id,
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
})