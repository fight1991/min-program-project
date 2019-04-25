var app = getApp()
Page({
  data: {
    array: ['已接单，待提交', '接单提交，待录入', '已录入，待提交', '录入提交，待审核', '已审核，待修改', '已审核，待申报', '已修改，待申报', '单一窗口申报中', '已过机', '结案'],
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      site: "",
      inner_no: "",
      bill_no: "",
      begin_date: "",
      end_date: "",
      status: ""
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    status_flag: false,
    datas: [],
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
  //初始化数据
  initData: function(flag) {
    var that = this
    var path = "Act"
    app.httpUtils.initData(that, flag, path)
  },
  //滚动加载数据
  loadMore: function() {
    var that = this
    if (!app.globalData.isAllRecord) {
      that.data.searchModel.accessName = ''
    }
    app.utils.loadMore(that)
  },
  //点击查看明细
  show: function(e) {
    if (this.data.showFinish == true) {
      var model = this.data.datas[e.currentTarget.dataset.index]
      wx.navigateTo({
        url: 'details?obj=' + JSON.stringify(model)
      })
    }
  },
  //页面每次刷新
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
  onLoad: function(option) {
    app.authorize()
    this.data.searchModel.i_e_flag = option.i_e_flag
    this.data.searchModel.inner_no = option.inner_no
    this.data.searchModel.bill_no = option.bill_no
    this.data.searchModel.begin_date = option.begin_date
    this.data.searchModel.end_date = option.end_date
    this.data.searchModel.status = option.status
    wx.removeStorageSync('load')
    wx.removeStorageSync('fromDetailsToList')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function(userInfo) {
      that.data.searchModel.site = userInfo.site
      that.setData({
        i_e_flag: option.i_e_flag,
        theme: userInfo.theme
      })
    })
    if (wx.getStorageSync('i_e_flag') == 'I') {
      this.data.searchModel["accessName"] = '进口接单查询'
    } else if (wx.getStorageSync('i_e_flag') == 'E') {
      this.data.searchModel["accessName"] = '出口接单查询'
    } else {
      this.data.searchModel["accessName"] = ''
    }
  },
  //点击查询跳转查询页面
  showSearch: function(e) {
    this.setData({
      backFlag: true
    })
    wx.navigateTo({
      url: 'search?inner_no=' + this.data.searchModel.inner_no + '&bill_no=' + this.data.searchModel.bill_no + '&begin_date=' + this.data.searchModel.begin_date + '&end_date=' + this.data.searchModel.end_date + '&status=' + this.data.searchModel.status + '&i_e_flag=' + this.data.searchModel.i_e_flag,
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