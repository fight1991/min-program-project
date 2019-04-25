var app = getApp()
Page({
  data: {
    titles: ["返回","台账编号", "统一编号", "重置", "搜索", "请输入", "请选择"],
    titless: {},
    datas: [],
    style: "back",
    searchModel:{},
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.translater('查询')
    })
    app.authorize()
    if (options.from == "home") {
      this.setData({
        from: options.from,
        showBackTo: false
      })
    } else {
      this.setData({
        showBackTo: true
      })
    }
    this.data.searchModel["seq_no"] = options.seq_no
    this.data.searchModel["inner_no"] = options.inner_no
    var searchModel = this.data.searchModel
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    console.log(this.data.titless)
    this.setData({
      searchModel: searchModel,
      titless: tmp
    })

    var that = this
    app.getUserInfo(function (userInfo) {
      that.data.searchModel.site = userInfo.site
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  bindData: function (e) {
    var that = this
    app.utils.bindData(that, e)
  },
  bindChange: function (e) {
    var selectItem = e.currentTarget.id
    if (selectItem == "picker1") {
      this.data.searchModel.start_date = e.detail.value
      this.setData({
        type1: e.detail.value
      })
    } else if (selectItem == "picker2") {
      this.data.searchModel.end_date = e.detail.value
      this.setData({
        type2: e.detail.value
      })
    }
  },
  onShow: function () {
    if (this.data.from == "home") {
      wx.setStorageSync('fromListToHome', 'false')
    } else {
      wx.setStorageSync('load', 'false')
    }
  },
  search: function (e) {
    wx.setStorageSync('fromListToHome', 'true')
    if (this.data.from == "home") {
      wx.redirectTo({
        url: 'customsClearingStatus?searchModel=' + JSON.stringify(this.data.searchModel)
      })
    } else {
      app.utils.search(this.data.searchModel)
    }
  },
  scanCode: function (e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scan(that, key)
  },
  reset: function () {
    this.data.searchModel.entryId = ""
    this.data.searchModel.billNo = ""
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel,
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