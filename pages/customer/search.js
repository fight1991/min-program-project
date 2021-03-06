var app = getApp()
Page({
  data: {
    titles: ["返回", "代码", "名称", "重置", "搜索", "请输入"],
    titless: {},
    datas: [],
    style: "back"
  },
  onLoad: function (options) {
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    wx.setNavigationBarTitle({
      title: app.translater('客户查询'),
    })
    app.authorize()
    this.data.searchModel = app.searchModel
    this.data.searchModel.accessName='客户查询'
    if (typeof (options.customer_id) != "undefined") {
      this.data.searchModel["customer_id"] = options.customer_id
      this.data.searchModel["customer_name"] = options.customer_name
    }
    //显示上一次查询数据
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
    })
    var that = this
    app.getUserInfo(function (userInfo) {
      that.data.searchModel.site = userInfo.site
      var bg1 = userInfo.theme + "/newsearch.png"
      that.setData({
        theme: userInfo.theme,
        bg: bg1
      })
    })
  },
  onShow: function () {
    wx.setStorageSync('load', 'false')
    this.setData({ titles: [app.translater(this.data.titles[0]), app.translater(this.data.titles[1]), app.translater(this.data.titles[2]), app.translater(this.data.titles[3]), app.translater(this.data.titles[4]), app.translater(this.data.titles[5])] })
  },
  bindData: function (e) {
    var that = this
    app.utils.bindData(that, e)
  },
  search: function (e) {
    app.utils.search(this.data.searchModel)
  },
  reset: function () {
    this.data.searchModel.customer_id = ""
    this.data.searchModel.customer_name = ""
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
  }
})