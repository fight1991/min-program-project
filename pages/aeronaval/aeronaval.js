var app = getApp()
Page({
  data: {
    isSearch: false,
    isData: false,
    searchNone: true,
    searchModel: {
      type: 'Search'
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
    that.data.isSearch = option.isSearch
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    var obj = wx.getStorageSync('datasss')
    var that = this
    that.setData({
      obj: obj
    })

  },
  onShow: function () {
    wx.setStorageSync('fromListToHome', 'false')
    this.data.load = 'true'
    var load = wx.getStorageSync('load')
    wx.removeStorageSync('load')
    if (load == 'false') {
      this.setData({
        load: load
      })
    }
    if (this.data.isSearch) {
      var that = this
      var path = "ManifestInfo"
      wx.showLoading({
        title: '加载中',
      })
      app.httpUtils.get(path, that.data.searchModel, function (data) {
        wx.hideLoading()
        if (data.Data5.isOk) {
          that.setData({
            obj: data.Data5.data,
          })
          if (data.Data5.data.CUSTOM_MASTER == "") {
            that.setData({
              searchNone: true
            })
          } else {
            that.setData({
              searchNone: false
            })
          }
        } else {
          that.setData({
            searchNone: true
          })
        }

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