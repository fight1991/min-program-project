var wxCharts = require('../../content/libs/charts/wxcharts-min.js')
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    titles: ["加载中...", "进口报关单票数", "出口报关单票数", "月份选择", "进口总数量", "进口总金额", "出口总数量", "出口总金额", "进出口总金额"],
    titless: {},
    searchModel: {
      PageIndex: 1,
      month: new Date().getMonth(),
      site: "",
    },
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    month: new Date().getMonth(),
    chart: {},
    data: {},
    show: false,
    index: new Date().getMonth(),
    indexs: new Date().getMonth()+1,
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    showFinish: true
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.translater('月度报表'),
    })
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    app.authorize()
    var that = this;
    app.utils.getSystemInfo(that)
    wx.showLoading({
      title: app.translater('加载中...'),
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo,
        theme: userInfo.theme
      })
    })
    that.data.searchModel.site = this.data.currentUser.site
    this.initData()
  },
  onShow: function () {
    wx.setStorageSync('fromListToHome', 'false')
  },
  initData: function (flag) {
    var that = this
    if (that.data.showTitle == "0") {
      wx.showLoading({
        title: app.translater('加载中...'),
      })
    }
    app.httpUtils.get('MonthReport', this.data.searchModel, function (data) {
      if (data.Success) {
        if (flag == true) {
          that.setData({
            datas: []
          })
        }
        var chart = { e_qty, i_qty }
        var e_qty = 0
        var i_qty = 0
        var i_decl_total = 0
        var e_decl_total = 0
        if (data.Data5.total != 0) {
          var data = data.Data5.rows[0]
          e_qty = data.E_QTY
          i_qty = data.I_QTY
          i_decl_total = data.I_DECL_TOTAL
          e_decl_total = data.E_DECL_TOTAL
          if (i_decl_total == "" || i_decl_total == null) {
            i_decl_total = 0
          }
          if (e_decl_total == "" || e_decl_total == null) {
            e_decl_total = 0
          }
          var decl_total = i_decl_total + e_decl_total
          data.I_DECL_TOTAL = app.utils.numFormatter(data.I_DECL_TOTAL)
          data.E_DECL_TOTAL = app.utils.numFormatter(data.E_DECL_TOTAL)
          decl_total = app.utils.numFormatter(decl_total)
          that.setData({
            data: data,
            DECL_TOTAL: decl_total
          })
        } else {
          var dec_month = that.data.searchModel.month
          var data = { DEC_YEAR: dec_month, I_QTY: "0", I_DECL_TOTAL: "0", E_QTY: "0", E_DECL_TOTAL: "0" }
          that.setData({
            data: data,
            DECL_TOTAL: "0"
          })
        }
        new wxCharts({
          animation: true, //是否有动画
          canvasId: 'pieCanvas',
          type: 'pie',
          series: [{
            name: app.translater('进口报关单票数'),
            data: i_qty,
          }, {
            name: app.translater('出口报关单票数'),
            data: e_qty
          }],
          width: that.data.winWidth,
          height: 300,
          dataLabel: true,
        })
        that.setData({
          show: true
        })
        wx.hideLoading()
        if (flag == true) {
          setTimeout(function () {
            that.setData({
              //加载成功
              showTitle: "3"
            })
          }, 300)
          setTimeout(function () {
            that.setData({
              margin_top: 0,
              showTitle: "0",
              showFinish: true
            })
          }, 600)
        }
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      indexs: parseInt(e.detail.value)+1,
      data: {}
    })
    if (e.detail.value < 10) {
      this.data.searchModel.month = "0" + e.detail.value
    } else {
      this.data.searchModel.month = e.detail.value
    }
    this.setData({
      show: false
    })
    this.initData()
  },
  touchStart: function (e) {
    this.setData({
      touchStart: e.touches[0].clientY,
      pageYStart: e.touches[0].pageY
    })
  },
  touchMove: function (e) {
    var that = this
    app.utils.reportTouchMove(that, e)
  },
  touchEnd: function (e) {
    var that = this
    app.utils.reportTouchEnd(that)
  }
})