var wxCharts = require('../../content/libs/charts/wxcharts-min.js')
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    titles: ["加载中...", "进口报表", "报关单量", "年份选择", "月份", "数量(票)", "金额"],
    titless: {},
    searchModel: {
      year: new Date().getFullYear(),
      site: "",
      i_e_flag: "I",
    },
    year: "",
    chart: {},
    datas: [],
    show: false,
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    showFinish: true
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.translater('进口报表'),
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
    var that = this
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
    var year = new Date().getFullYear()
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      year: year
    })
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
    app.httpUtils.get('Report', this.data.searchModel, function (data) {
      if (data.Success) {
        if (flag == true) {
          that.setData({
            datas: []
          })
        }
        var chart = { categories: [], data: [] }
        data.Data5.forEach(function (val, index) {
          chart.categories.push(val.DEC_MONTH)
          chart.data.push(val.QTY)
          val.DECL_TOTAL = app.utils.numFormatter(val.DECL_TOTAL)
        })
        that.setData({
          datas: data.Data5,
          show: true
        })
        //图表展示
        new wxCharts({
          canvasId: 'columnCanvas',
          background: '#1296db',
          title: {
            name: app.translater("进口报表")
          },
          type: 'column',
          animation: true,
          dataLabel :true,
          categories: chart.categories,
          series: [{
            name: app.translater('报关单量'),
            data: chart.data,
            color: '#b6e6fa',
          }],
          yAxis: {
            min: 0,
            max: 10,
            fontColor: '#b6e6fa',
            gridColor: '#b6e6fa',
          },
          xAxis: {
            disableGrid: true,
            type: 'calibration',
            fontColor: '#b6e6fa',
          },
          extra: {
            column: {
              width: 15,
            },
            legendTextColor: '#b6e6fa',
          },
          width: that.data.winWidth,
          height: 250,
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
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      show: false
    })
    this.data.searchModel.year = e.detail.value
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