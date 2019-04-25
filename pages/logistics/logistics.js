var app = getApp()
Page({
  data: {
    array: ['已接单，待提交', '接单提交，待录入', '已录入，待提交', '录入提交，待审核', '已审核，待修改', '已审核，待申报', '已修改，待申报', '单一窗口申报中', '已过机', '结案'],
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      inner_no: "",
      entry_id: "",
      bill_no: "",
      begin_date: "",
      end_date: "",
      site: "",
      status: ""
    },
    hidden: 'hidden',
    visible: 'visible',
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    datas: [],
    status_flag: false,
    obj: {},
    load: 'true',
    fromDetailsToList: 'true',
    backFlag: true,
    showList: false,
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    showFinish: true
  },
  scrollTop: function(e) {
    var that = this
    app.utils.scrollTop(that, e)
  },
  goTop: function(e) {
    var that = this
    app.utils.goTop(that)
  },
  initData: function(flag) {
    var that = this
    var path = "Logistics"
    app.httpUtils.initData(that, flag, path)
  },
  loadMore: function() {
    var that = this
    if (!app.globalData.isAllRecord) {
      that.data.searchModel.accessName = ''
    }
    app.utils.loadMore(that)
  },
  showSearch: function(e) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      backFlag: false
    })
    wx.navigateTo({
      url: 'search?inner_no=' + this.data.searchModel.inner_no + '&entry_id=' + this.data.searchModel.entry_id + '&bill_no=' + this.data.searchModel.bill_no + '&begin_date=' + this.data.searchModel.begin_date + '&end_date=' + this.data.searchModel.end_date +
        '&status=' + this.data.searchModel.status + '&i_e_flag=' + this.data.searchModel.i_e_flag,
    })
  },
  show: function(e) {
    if (this.data.showFinish == true) {
      var model = this.data.datas[e.currentTarget.dataset.index]
      wx.navigateTo({
        url: 'details?obj=' + JSON.stringify(model)
      })
    }
  },
  onShow: function() {
    wx.setStorageSync('fromListToHome', 'false')
    this.data.load = 'true'
    this.data.fromDetailsToList = 'true'
    var load = wx.getStorageSync('load')
    var fromDetailsToList = wx.getStorageSync('fromDetailsToList', 'false')
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromDetailsToList')
    if (load == 'false') {
      this.setData({
        load: load
      })
    }
    if (fromDetailsToList == 'false') {
      this.setData({
        fromDetailsToList: fromDetailsToList
      })
    }
    if (this.data.backFlag && this.data.load == 'true' && this.data.fromDetailsToList == 'true') {
      this.initData()
    }
  },
  onLoad: function(options) {
    app.authorize()
    this.data.searchModel.i_e_flag = wx.getStorageSync('i_e_flag')
    this.data.searchModel.inner_no = options.inner_no
    this.data.searchModel.entry_id = options.entry_id
    this.data.searchModel.bill_no = options.bill_no
    this.data.searchModel.begin_date = options.begin_date
    this.data.searchModel.end_date = options.end_date
    this.data.searchModel.status = options.status
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromDetailsToList')
    var that = this
    app.utils.getSystemInfo(that)
    if (typeof(options.entryId) != "undefined") {
      this.data.searchModel["entry_id"] = options.entry_id
      this.data.searchModel["bill_no"] = options.bill_no
    }
    if (wx.getStorageSync('i_e_flag') == 'I') {
      this.data.searchModel["accessName"] = '进口物流跟踪查询'
    } else if (wx.getStorageSync('i_e_flag') == 'E') {
      this.data.searchModel["accessName"] = '出口物流跟踪查询'
    } else {
      this.data.searchModel["accessName"] = ''
    }
    app.getUserInfo(function(userInfo) {
      that.data.searchModel.site = userInfo.site
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  touchStart: function(e) {
    this.setData({
      touchStart: e.touches[0].clientY
    })
  },
  touchMove: function(e) {
    var that = this
    app.utils.touchMove(that, e)
  },
  touchEnd: function(e) {
    var that = this
    app.utils.touchEnd(that)
  }
})