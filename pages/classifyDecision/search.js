var app = getApp()
Page({
  onLoad: function (options) {
    this.data.searchModel = app.searchModel
    if (typeof (options.DECISION_NO) != "undefined") {
      this.data.searchModel["DECISION_NO"] = options.DECISION_NO
      this.data.searchModel["CODE_TS"] = options.CODE_TS
      this.data.searchModel["G_NAME"] = options.G_NAME
      this.data.searchModel["G_DESCRIPTION"] = options.G_DESCRIPTION
      this.data.searchModel["accessName"] ='归类决定查询'
    }
    if (options.from == "home") {
      this.setData({
        i_e_flag: options.i_e_flag,
        from: options.from,
        showBackTo: false
      })
    } else {
      this.setData({
        showBackTo: true
      })
    }
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel,
    })
  },
  bindData: function (e) {
    var that = this
    app.utils.bindData(that, e)
  },
  search: function (e) {
    app.utils.search(this.data.searchModel)
  },
  //二维码扫描功能
  scanCode: function (e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scan(that, key)
  },
})