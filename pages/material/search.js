var app = getApp()
Page({
  data: {
    titles: ["返回", "代码", "名称", "品名", "重置", "搜索", "请输入"],
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
      title: app.translater('物料查询')
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
    if (typeof (options.cop_g_no) != "undefined") {
      this.data.searchModel["cop_g_no"] = options.cop_g_no
      this.data.searchModel["g_name"] = options.g_name
      this.data.searchModel["code_t_s"] = options.code_t_s
    } else {
      this.data.searchModel["cop_g_no"] = ""
      this.data.searchModel["g_name"] = ""
      this.data.searchModel["code_t_s"] = ""
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
    if (this.data.from == "home") {
      wx.setStorageSync('fromListToHome', 'false')
    } else {
      wx.setStorageSync('load', 'false')
    }
    this.setData({
      titles: [app.translater(this.data.titles[0]), app.translater(this.data.titles[1]), app.translater(this.data.titles[2]), app.translater(this.data.titles[3]), app.translater(this.data.titles[4]), app.translater(this.data.titles[5]), app.translater(this.data.titles[6])]
    })
  },
  //重置
  reset: function () {
    this.data.searchModel.code_t_s = ""
    this.data.searchModel.cop_g_no = ""
    this.data.searchModel.g_name = ""
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
    })
  },
  bindData: function (e) {
    var that = this
    app.utils.bindData(that, e)
  },
  //查询
  search: function (e) {
    wx.setStorageSync('fromListToHome', 'true')
    if (this.data.from == "home") {
      wx.redirectTo({
        url: 'material?code_t_s=' + this.data.searchModel.code_t_s + '&cop_g_no=' + this.data.searchModel.cop_g_no + '&g_name=' + this.data.searchModel.g_name,
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
  //返回
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