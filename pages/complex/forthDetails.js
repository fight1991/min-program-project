var app = getApp()
Page({
  data: {
    searchModel: {
      id: "",
      accessName: '统计商品目录注释查询'
    },
    datas: [],
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
  onShow: function() {
    var that = this
    app.httpUtils.get('Complex', that.data.searchModel, function(data) {
      if (data.Success) {
        that.setData({
          datas: data.Data5.THRCONTENT_INF.split('\n'),
        })
      }
    })
  },
  onLoad: function(options) {
    this.data.searchModel.id = options.id
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