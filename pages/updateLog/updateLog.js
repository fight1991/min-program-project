var app = getApp()
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      platform_flag: ''
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    datas: [],
    backFlag: true,
    fromDetailsToList: 'true',
    obj: {},
    show: false,
    status_flag: false
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.translater('更新日志'),
    })
    app.authorize()
    wx.removeStorageSync('fromDetailsToList')
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function () {
    this.data.fromDetailsToList = 'true'
    var fromDetailsToList = wx.getStorageSync('fromDetailsToList', 'false')
    wx.removeStorageSync('fromDetailsToList')
    if (fromDetailsToList == 'false') {
      this.setData({
        fromDetailsToList: fromDetailsToList
      })
    }
    if (this.data.backFlag && this.data.fromDetailsToList == 'true') {
      this.initData()
    }
  },
  scrollTop: function (e) {
    if (e.detail.scrollTop > 100) {//触发gotop的显示条件  
      this.setData({
        'scrollTop.goTop_show': true
      })
    } else {
      this.setData({
        'scrollTop.goTop_show': false
      })
    }
  },
  goTop: function (e) {
    var _top = this.data.scrollTop.scroll_top;
    //设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断  
    if (_top == 1) {
      _top = 0
    } else {
      _top = 1
    }
    this.setData({
      'scrollTop.scroll_top': _top
    })
  },
  loadMore: function () {
    if (!this.data.searchModel.enable) {
      this.setData({
        showflag: 1
      })
      return
    }
    this.initData()
  },
  initData: function () {
    var that = this
    if (that.data.status_flag) {
      return
    }
    that.data.status_flag = true
    wx.showLoading({
      title: '加载中...',
    })
    app.httpUtils.get('UpdateLog', this.data.searchModel, function (data) {
      if (data.Success) {
        var datas = that.data.datas
        data.Data5.rows.forEach(function (val, index) {
          if (val.UPDATE_DATE != null) {
            val.UPDATE_DATE = app.utils.dateFormatter(val.UPDATE_DATE)
          } else {
            val.UPDATE_DATE = ' '
          }
          datas.push(val)
        })
        that.data.searchModel.PageIndex += 1
        if (data.Data5.total <= datas.length) {
          that.data.searchModel.enable = false
        } else {
          that.data.searchModel.enable = true
        }
        if (datas.length == 0) {
          that.setData({
            showflag: 2
          })
        }
        else if (datas.length > 0) {
          that.setData({
            showflag: 0
          })
        }
        that.setData({
          datas: datas,
          show: true
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
      that.data.status_flag = false
    })
  },
  showDetails: function (e) {
    var key = e.currentTarget.id
    wx.navigateTo({
      url: 'details?seq_no=' + key,
    })
  }
})