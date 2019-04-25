var app = getApp()
Page({
  data: {
    titles: ["查询", "返回", "商品名称","名称", "申报要素", "法定单位", "第二单位", "最惠国进口税率", "普通进口税率", "暂定进口税率", "消费税率", "出口税率", "出口退税率", "协定税率", "增值税率", "监管条件", "检验检疫类别", "备注", "关闭"],
    titless: {},
    searchModel: {
      CODE_TS: "",
    },
    hiddenModal:true,
    obj: {},
  },
  onLoad: function (options) {
    this.setData({
      searchModel: {
        CODE_TS: options.CODE_TS,
        accessName: "税则详情查询"
      }
    })
    wx.setNavigationBarTitle({
      title: options.CODE_TS
    })
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    var that=this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })
  },
  onShow: function () {
    var that = this
    console.log(that.data.searchModel)
    app.httpUtils.get('CodeTs', that.data.searchModel, function (data) {
      if (data.Success) {
        that.setData({
          obj: data.Data5,
        })
      }
    })
  },
  showRate: function (e) {
    var code_t = e.currentTarget.dataset.codets
    var that = this
    var path = "Fat"
    that.data.searchModel.CODE_T = code_t
    wx.showLoading({
      title: '加载中...',
    })
    app.httpUtils.get(path, that.data.searchModel, function (data) {
      if (data.Success) {
        that.setData({
          datas: data.Data5
           
        })
        that.listenerButton()
      }
      wx.hideLoading()
    })
   

  },
  showModel: function () {

  },
  listenerConfirm: function () {
    this.setData({
      hiddenModal: true
    })
  },

  listenerCancel: function () {
    this.setData({
      hiddenModal: true
    })
  },
  listenerButton: function () {
    this.setData({
      hiddenModal: !this.data.hiddenModal
    })
  },
})