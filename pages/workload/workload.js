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
      type: "",
      accessName: '工作量统计查询'

    },
    datas4tab1: [],
    datas4tab2: [],
  },
  onLoad: function (e) {
    // wx.setNavigationBarTitle({
    //   title: e.inner_no,
    // })
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
    that.initData4Tab1()
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
  initData4Tab1: function () {
    var that = this
    that.data.searchModel["type"] = "search4tab1"
    app.httpUtils.get('Workload', this.data.searchModel, function (data) {
      if (data.Success) {
        var datas = that.data.datas4tab1
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
            datas4tab1: datas
          })
          wx.hideLoading()
        }, 1000)
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
    })
  },
  initData4Tab2: function () {
    var that = this
    that.data.searchModel["type"] = "search4tab2"
    app.httpUtils.get('Workload', this.data.searchModel, function (data) {
      if (data.Success) {
        var datas = that.data.datas4tab2
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
            datas4tab2: datas
          })
          wx.hideLoading()
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
  initAnimation: function (rotate) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animation.rotateZ(rotate).step();
    this.setData({
      animationMenu: animation
    })
  },
  show_details1: function (e) {
    wx.navigateTo({
      url: 'details?begin_date=' + this.data.searchModel.begin_date + '&end_date=' + this.data.searchModel.end_date + '&user_id=' + this.data.searchModel.user_id + '&user_id=' + e.currentTarget.id + '&site=' + this.data.searchModel.site, 
    })
  },
  show_details2: function (e) {
    wx.navigateTo({
      url: 'workloadList?begin_date=' + this.data.searchModel.begin_date + '&end_date=' + this.data.searchModel.end_date + '&user_id=' + this.data.searchModel.user_id + '&user_id=' + e.currentTarget.id + '&site=' + this.data.searchModel.site,
    })
  },
})  