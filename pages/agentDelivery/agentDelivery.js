var app = getApp()
Page({
  data: {
    titles: ['查询'],
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      site: "",
      delivery_name: "",
      flag: "",
      accessName: '提送货查询'
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    seq_no: "",
    datas: [],
    obj: {},
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
    var path = "Agent"
    app.httpUtils.initData(that, flag, path)
  },
  onLoad: function(option) {
    app.authorize()
    wx.removeStorageSync('load')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function(userInfo) {
      that.data.searchModel.site = userInfo.site
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function() {
    wx.setStorageSync('fromListToHome', 'false')
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
  showSearch: function(e) {
    this.setData({
      backFlag: true
    })
    wx.navigateTo({
      url: 'search?delivery_name=' + this.data.searchModel.delivery_name + '&flag=' + this.data.searchModel.flag,
    })
  },
  showDetails: function(e) {
    wx.navigateTo({
      url: 'details?seq_no=' + e.currentTarget.id
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