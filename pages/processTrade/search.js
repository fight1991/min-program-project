var app = getApp()
Page({
  data: {
    titles: ["返回", "代码", "编号", "重置", "搜索", "请输入"],
    titless: {},
    datas: [],
    style: "back"
  },
  onLoad: function (options) {
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      console.log(value)
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    app.authorize()
    this.data.searchModel = app.searchModel
    this.data.searchModel.ems_type = "E"
    if (typeof (options.ems_no) != "undefined") {
      this.data.searchModel["trade_code"] = options.trade_code
      this.data.searchModel["ems_no"] = options.ems_no
    }
    //显示上一次查询数据
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
    app.utils.search(this.data.searchModel)
  },
  // 重置
  reset: function () {
    this.data.searchModel.trade_code = ""
    this.data.searchModel.ems_no = ""
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
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
  },
  scanCode: function (e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scan(that, key)
  }
})