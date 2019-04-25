var app = getApp()
Page({
  data: {
    animationMenu: {},
    animationData: {},
    // tab切换  
    currentTab: 0,
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 100,
      begin_date: "",
      end_date: "",
      user_id: "",
      type: ""
    },
    datas4tab3: [],
    datas4tab4: [],
  },
  onLoad: function (e) {
    var that = this
    app.authorize()
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme,
        currentUser: userInfo
      })
    })
    that.data.searchModel.user_id = e.user_id
    that.data.searchModel.begin_date = e.begin_date
    that.data.searchModel.end_date = e.end_date
    that.data.searchModel.site = this.data.currentUser.site
    wx.showLoading({
      title: '加载中...',
    })
    that.initData4Tab1(function (data) {
      wx.showLoading({
        title: '加载中',
      })
      if (data.Success) {
        wx.hideLoading()
      }
    })
    that.initData4Tab2()

  },
  onShow: function () {
  },
  bindChange: function (e) {
    var that = this
    that.setData({ currentTab: e.detail.current })
  },
  swichNav: function (e) {
    var that = this
    if (this.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  initData4Tab1: function (callback) {
    var that = this
    that.data.searchModel["type"] = "search4left"
    app.httpUtils.get('Workload', this.data.searchModel, function (data) {
      if (data.Success) {
        var datas = that.data.datas4tab3
        data.Data5.rows.forEach(function (val, index) {
          datas.push(val)
        })
        that.data.searchModel.PageIndex += 1
        if (data.Data5.total <= datas.length) {
          that.data.searchModel.enable = false
        } else {
          that.data.searchModel.enable = true
        }
        setTimeout(function () {
          that.setData({
            datas4tab3: datas
          })

        }, 1000)
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
      callback(data)
    })
  },
  initData4Tab2: function () {
    var that = this
    that.data.searchModel["type"] = "search4right"
    app.httpUtils.get('Workload', this.data.searchModel, function (data) {
      if (data.Success) {
        var datas = that.data.datas4tab4
        data.Data5.rows.forEach(function (val, index) {
          datas.push(val)
        })
        that.data.searchModel.PageIndex += 1
        if (data.Data5.total <= datas.length) {
          that.data.searchModel.enable = false
        } else {
          that.data.searchModel.enable = true
        }
        setTimeout(function () {
          that.setData({
            datas4tab4: datas
          })
        }, 1000)
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
    })
  },
  hide: function () {
    this.setData(
      {
        showModalStatus: false
      }
    )
  },
  loadMore: function () {
    var that = this
    app.utils.loadMore(that)
  },
})  