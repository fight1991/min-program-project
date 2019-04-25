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
      date: currDate.getFullYear(),
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
    if (typeof (options.entry_id) != "undefined") {
      this.data.searchModel["begin_date"] = options.begin_date
      this.data.searchModel["end_date"] = options.end_date
      this.data.searchModel["company"] = options.company
      this.data.searchModel["i_e_flag"] = options.i_e_flag
    } else {
      this.data.searchModel["begin_date"] = ""
      this.data.searchModel["end_date"] = ""
      this.data.searchModel["company"] = ""
      this.data.searchModel["i_e_flag"] = ""
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
      console.log('****************************')
      console.log(this.data.searchModel)
      console.log('****************************')
      wx.redirectTo({
        url: 'decTimeLine?begin_date=' + this.data.searchModel.begin_date+ '&end_date=' + this.data.searchModel.end_date + '&company=' + this.data.searchModel.company + '&i_e_flag=' + this.data.searchModel.i_e_flag,
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
  bindChangeFlag: function (e) {
    var selectItemFlag = e.detail.value
    console.log(this.data.arrayFlag[selectItemFlag])
    this.setData({
      i_e_flag: this.data.arrayFlag[selectItemFlag]
    })
    if (this.data.i_e_flag == "进口") {
      this.data.searchModel.i_e_flag = "I"
    } else if (this.data.i_e_flag == "出口") {
      this.data.searchModel.i_e_flag = "E"
    }
  },
})