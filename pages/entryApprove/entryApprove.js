var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    array: ['已接单，待提交', '接单提交，待录入', '已录入，待提交', '录入提交，待审核', '已审核，待修改', '已审核，待申报', '已修改，待申报', '单一窗口申报中', '已过机', '结案'],
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      i_e_flag: "",
      site: "",
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    fromDetailsToList: 'true',
    status_flag: false,
    datas: [],
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
    var path = 'EntryApprove'
    app.httpUtils.approveInitData(that, path)
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
    }
  },
  onLoad: function (option) {
    app.authorize()
    wx.removeStorageSync('fromDetailsToList')
    var that = this
    wx.setStorageSync('i_e_flag', option.i_e_flag)
    that.data.searchModel.i_e_flag = option.i_e_flag
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
      that.data.searchModel.site = userInfo.site
    })
  },
  show: function (e) {
    var model = this.data.datas[e.currentTarget.dataset.index]
    wx.setStorageSync('obj', model)
    wx.navigateTo({
      url: '../entryApprove/details',
    })
  },
})  