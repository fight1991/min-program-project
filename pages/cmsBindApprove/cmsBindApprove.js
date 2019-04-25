var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    titles: ["待审批", "已审批"],
    titless: {},
    // tab切换  
    currentTab: 0,
    // data: {},
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      site: "",
      status: "未审核"
    },
    searchModel_ed: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      site: "",
      status: "通过"
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scrollTop1: {
      scroll_top: 0,
      goTop_show: false
    },
    fromDetailsToList: 'true',
    status_flag: false,
    status_flag_ed: false,
    datas: [],
    datas_ed: [],
    total_ed: '',
    total: ''
  },
  scrollTop: function (e) {
    var that = this
    app.utils.scrollTop(that, e)
  },
  scrollTop1: function (e) {
    var that = this
    app.utils.scrollTop1(that, e)
  },
  goTop: function (e) {
    var that = this
    app.utils.goTop(that)
  },
  goTop1: function (e) {
    var that = this
    app.utils.goTop1(that)
  },
  loadMore: function (e) {
    var that = this
    app.utils.approveLoadMore(that, e)
  },
  initData: function () {
    var that = this
    var path = 'CmsBindApprove'
    app.httpUtils.approveInitData(that, path)
  },
  initData_ed: function () {
    var that = this
    var path = 'CmsBindApprove'
    app.httpUtils.approveInitData_ed(that, path)
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
    if (this.data.fromDetailsToList == 'true') {
      this.initData()
      this.initData_ed()
    }
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: app.translater('三方账号'),
    })
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    app.authorize()
    wx.removeStorageSync('fromDetailsToList')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
      that.data.searchModel.site = userInfo.site
      that.data.searchModel_ed.site = userInfo.site
    })
  },
  show: function (e) {
    var that = this
    var seq_no = e.currentTarget.id
    wx.setStorageSync('seq_no', seq_no)
    wx.navigateTo({
      url: '../cmsBindApprove/details',
    })
  },

  bindChange: function (e) {
    var that = this
    that.setData({ currentTab: e.detail.current })
    that.data.scrollTop.scroll_top = 0
  },

  swichNav: function (e) {
    var that = this
    app.utils.approveSwichNav(that, e)
  },
  formattertime: util.dateFormatter
})  