var app = getApp()
Page({
  data: {
    array: ['已接单，待提交', '接单提交，待录入', '已录入，待提交', '录入提交，待审核', '已审核，待修改', '已审核，待申报', '已修改，待申报', '单一窗口申报中', '已过机', '结案'],
    datas: [],
    style: "back"
  },
  onLoad: function(options) {
    wx.setStorageSync('i_e_flag', options.i_e_flag)
    var currDate = new Date()
    this.setData({
      date1: app.utils.formatDateFirstDay(currDate),
      date2: app.utils.formatDate(currDate)
    })
    wx.setStorageSync('i_e_flag', options.i_e_flag)
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
    if (typeof(options.entry_id) != "undefined") {
      this.data.searchModel["entry_id"] = options.entry_id
      this.data.searchModel["bill_no"] = options.bill_no
      this.data.searchModel["inner_no"] = options.inner_no
      this.data.searchModel["begin_date"] = options.begin_date
      this.data.searchModel["end_date"] = options.end_date
      this.data.searchModel["status"] = options.status
      this.data.searchModel["i_e_flag"] = options.i_e_flag
    } else {
      this.data.searchModel["entry_id"] = ""
      this.data.searchModel["bill_no"] = ""
      this.data.searchModel["inner_no"] = ""
      this.data.searchModel["begin_date"] = ""
      this.data.searchModel["end_date"] = ""
      this.data.searchModel["status"] = ""
      this.data.searchModel["i_e_flag"] = options.i_e_flag
    }
    if (wx.getStorageSync('i_e_flag') == 'I') {
      this.data.searchModel["accessName"] = '进口报关单查询'
    } else if (wx.getStorageSync('i_e_flag') == 'E') {
      this.data.searchModel["accessName"] = '出口报关单查询'
    } else {
      this.data.searchModel["accessName"] = ''
    }
    //显示上一次查询数据
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel,
    })
    var that = this
    app.getUserInfo(function(userInfo) {
      that.data.searchModel.site = userInfo.site
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  bindData: function(e) {
    var that = this
    app.utils.bindData(that, e)
  },
  bindChange: function(e) {
    var selectItem = e.detail.value
    this.data.searchModel.status = selectItem
    this.setData({
      type: this.data.array[selectItem]
    })
  },
  onShow: function() {
    if (this.data.from == "home") {
      wx.setStorageSync('fromListToHome', 'false')
    } else {
      wx.setStorageSync('load', 'false')
    }
  },
  search: function(e) {
    wx.setStorageSync('fromListToHome', 'true')
    if (this.data.from == "home") {
      wx.redirectTo({
        url: 'entry?entry_id=' + this.data.searchModel.entry_id + '&bill_no=' + this.data.searchModel.bill_no + '&inner_no=' + this.data.searchModel.inner_no + '&begin_date=' + this.data.date1 + '&end_date=' + this.data.date2 +
          '&status=' + this.data.searchModel.status,
      })
    } else {
      app.utils.search(this.data.searchModel)
    }
  },
  //二维码扫描功能
  scanCode: function(e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scan(that, key)
  },
  reset: function() {
    this.data.searchModel.seq_no = ""
    this.data.searchModel.entryId = ""
    this.data.searchModel.billNo = ""
    this.data.searchModel.begin_date = ""
    this.data.searchModel.end_date = ""
    this.data.type1 = ""
    this.data.type2 = ""
    var searchModel = this.data.searchModel
    this.setData({
      date1: [],
      date2: [],
      searchModel: searchModel,
      type: ""
    })
  },
  backTo: function() {
    app.utils.backTo()
  },
  touchBegin: function() {
    var that = this
    app.utils.touchBegin(that)
  },
  touchOver: function() {
    var that = this
    app.utils.touchOver(that)
  },
  bindDateChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.searchModel.begin_date = e.detail.value
    this.setData({
      date1: e.detail.value
    })
  },
  bindDateChange2: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.searchModel.end_date = e.detail.value
    this.setData({
      date2: e.detail.value
    })
  },
})