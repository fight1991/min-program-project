var app = getApp()
Page({
  data: {
    arrayFlag: ['进口', '出口'],
    datas: [],
    style: "back"
  },
  onLoad: function (options) {
    var currDate = new Date()
    this.setData({
      date1: app.utils.formatDateFirstDay(currDate),
      date2: app.utils.formatDate(currDate)
    })
    app.authorize()
    //控制页面跳转来源,并控制返回按钮的显示 
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
    this.data.searchModel = app.searchModel
    if (typeof (options.user_id) != "undefined") {
      this.data.searchModel["begin_date"] = options.begin_date
      this.data.searchModel["end_date"] = options.end_date
      this.data.searchModel["user_id"] = options.user_id
    } else {
      this.data.searchModel["begin_date"] = ""
      this.data.searchModel["end_date"] = ""
      this.data.searchModel["user_id"] = ""
    }
    //显示上一次查询数据
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel,
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
    var selectItem = e.detail.value
    this.data.searchModel.status = selectItem
    this.setData({
      type: this.data.array[selectItem]
    })
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
        url: 'workload?begin_date=' + this.data.date1 + '&end_date=' + this.data.date2 + '&user_id=' + this.data.searchModel.user_id
      })
    } else {
      app.utils.search(this.data.searchModel)
    }
  },
  //二维码扫描功能
  scanCode: function (e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scan(that, key)
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
  bindDateChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.searchModel.begin_date = e.detail.value
    this.setData({
      date1: e.detail.value
    })
  },
  bindDateChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.searchModel.end_date = e.detail.value
    this.setData({
      date2: e.detail.value
    })
  },
})