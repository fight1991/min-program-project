var app = getApp()
Page({
  data: {
    searchModel: {
      inner_no: "",
      seq_no: "",
      site: ""
    },
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
  onLoad: function (options) {
    var that = this
    that.setData({
      searchModel: JSON.parse(options.searchModel)
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    app.utils.getSystemInfo(that)
  },
  onReady: function () {

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
  },
  initData: function (flag) {
    var that = this
    var path = 'SW'
    app.httpUtils.get(path, that.data.searchModel, function (data) {
      if (data.Success) {
        if (data.Data5 == null) {
          that.setData({
            showflag: 2,
            searchNone: true
          })
        }
        else if (data.Data5!=null) {
          that.setData({
            showflag: 0
          })
        }
        wx.hideLoading()
        if (flag == true) {
          //设置延迟
          setTimeout(function () {
            that.setData({
              //加载成功
              showTitle: "3"
            })
          }, 500)
          setTimeout(function () {
            that.setData({
              margin_top: 0,
              showTitle: "0",
              //判断当前刷新是否完成
              showFinish: true,
              scroll: true
            })
          }, 900)
        }
        that.setData({
          datas: data.Data5,
          showList: true
        })
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
      that.data.status_flag = false
    })
  }
})