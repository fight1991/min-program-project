var app = getApp()
Page({
  data: {
    titles: ["返回","查询", "供应商代码", "供应商名称", "简称", "是否关联方", "联系人", "电话号码", "所属国", "地区", "传真", "公司地址", "邮政编码", "备注", "付款方式", "关闭"],
    titless: {},
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      site: "",
      customer_id: "",
      customer_name: "",
      accessName: '供应商查询'
    },
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    seq_no: "",
    datas: [],
    obj: {},
    status_flag: false,
    backFlag: true,
    load: 'true',
    showModalStatus: false,
    showList: false,
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    showFinish: true
  },
  scrollTop: function (e) {
    var that = this
    app.utils.scrollTop(that, e)
  },
  goTop: function (e) {
    var that = this
    app.utils.goTop(that)
  },
  loadMore: function () {
    var that = this
    if (!app.globalData.isAllRecord) {
      that.data.searchModel.accessName = ''
    }
    app.utils.loadMore(that)
  },
  initData: function (flag) {
    var that = this
    var path = "Supplier"
    app.httpUtils.initData(that, flag, path)
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
      title: app.translater('供应商')
    })
    app.authorize()
    wx.removeStorageSync('load')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.data.searchModel.site = userInfo.site
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function () {
    wx.setStorageSync('fromListToHome', 'false')
    this.data.load = 'true'
    var load = wx.getStorageSync('load')
    wx.removeStorageSync('load')
    if (load == 'false') {
      this.setData({
        load: load
      })
    }
    if (this.data.backFlag && this.data.load == 'true') {
      this.initData()
    }
    this.setData({
      titles: [app.translater(this.data.titles[0]), app.translater(this.data.titles[1]), app.translater(this.data.titles[2]), app.translater(this.data.titles[3]), app.translater(this.data.titles[4]), app.translater(this.data.titles[5]), app.translater(this.data.titles[6]), app.translater(this.data.titles[7]), app.translater(this.data.titles[8]), app.translater(this.data.titles[9]), app.translater(this.data.titles[10]), app.translater(this.data.titles[11]), app.translater(this.data.titles[12]), app.translater(this.data.titles[13]), app.translater(this.data.titles[14])]
    })
  },
  showSearch: function (e) {
    this.setData({
      backFlag: true
    })
    wx.navigateTo({
      url: 'search?customer_id=' + this.data.searchModel.customer_id + '&customer_name=' + this.data.searchModel.customer_name,
    })
  },
  showDetails: function (e) {
    wx.navigateTo({
      url: 'details?seq_no=' + e.currentTarget.id + '&customer_id=' + e.currentTarget.dataset.customer_id,
    })
  },
  touchStart: function (e) {
    this.setData({
      touchStart: e.touches[0].clientY
    })
  },
  touchMove: function (e) {
    var that = this
    app.utils.touchMove(that, e)
  },
  touchEnd: function (e) {
    var that = this
    app.utils.touchEnd(that)
  }
})