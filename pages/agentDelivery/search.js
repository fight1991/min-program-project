var app = getApp()
Page({
  data: {
    array: ['提货', '送货'],
    datas: [],
    style: "back"
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.translater('供应商查询'),
    })
    app.authorize()
    this.data.searchModel = app.searchModel
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
    })
    var that = this
    app.getUserInfo(function (userInfo) {
      that.data.searchModel.site = userInfo.site
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function () {
    wx.setStorageSync('load', 'false')
  },
  bindData: function (e) {
    var that = this
    app.utils.bindData(that, e)
  },
  search: function (e) {
    if (typeof (this.data.searchModel.flag) == "undefined"){
      this.data.searchModel.flag='' 
    }
    this.data.searchModel.accessName='提送货查询'
    app.utils.search(this.data.searchModel)
  },
  reset: function () {
    this.data.searchModel.delivert_name = ""
    this.data.searchModel.flag = ""
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
    })
  },
  bindChange: function (e) {
    var selectItem = e.detail.value
    console.log(this.data.array[selectItem])
    this.data.searchModel.flag = this.data.array[selectItem]
    this.setData({
      flag: this.data.array[selectItem]
    })
  },
  backTo: function () {
    app.utils.backTo()
  },
  touchBegin: function () {
    var that = this
    app.utils.touchBegin(that)
  },
  touchOver: function () {
    var that = this
    app.utils.touchOver(that)
  }
})