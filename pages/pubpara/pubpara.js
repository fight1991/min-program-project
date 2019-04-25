//index.js
//获取应用实例
var app = getApp()
var flag = true
var color = ""
Page({
  //传送的参数
  data: {
    searchModel: {
      enable: true,
      PageIndex: 1,
      PageSize: 3,
      category: ""
    },
    datas1: [],
    datas2: [],
    datas3: [],
    titles: ["重置", "税则查询", "商品编码", "商品名称"],
    titless: {},
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    theme: "",
    movies: [
      [{
          url: 'ccbanotices.png',
          dataUrl: "../information/information?category=Information"
        },
        {
          url: 'ccbainform.png',
          dataUrl: "../information/information?category=IndustryNews"
        },
      ],
      [{
          url: 'ccbalaw.png',
          dataUrl: "../information/information?category=PolicyLaw"
        },
        {
          url: 'ccbamore.png',
          dataUrl: "../activity/activity"
        }
      ]
    ],
    types: ['汽车申报参数'],
    table: [
      [{
          id: "customsRel",
          name: app.translater("关区"),
          normal: "index/ccba_customsRel-normal.png",
          pressed: "index/ccba_ustomsRel-pressed.png",
          state: true,
          url: "../customsRel/customsRel"
        },
        {
          id: "country",
          name: app.translater("国别(地区)"),
          normal: "index/ccba_country-normal.png",
          pressed: "index/ccba_country-pressed.png",
          state: true,
          url: "../country/country"
        },
        {
          id: "curr",
          name: app.translater("币制"),
          normal: "index/ccba_curr-normal.png",
          pressed: "index/ccba_curr-pressed.png",
          state: true,
          url: "../curr/curr"
        },
        {
          id: "unit",
          name: app.translater("计量单位"),
          normal: "index/ccba_unit-normal.png",
          pressed: "index/ccba_unit-pressed.png",
          state: true,
          url: "../unit/unit"
        },
        {
          id: "trade",
          name: app.translater("监管方式"),
          normal: "index/ccba_trade-normal.png",
          pressed: "index/ccba_trade-pressed.png",
          state: true,
          url: "../trade/trade"
        },
      ],
      [

        {
          id: "transf",
          name: "运输方式",
          normal: "index/transport-normal.png",
          pressed: "index/transport-pressed.png",
          state: true,
          url: "../transf/transf"
        }, {
          id: "levytype",
          name: "征免性质",
          normal: "index/levytype-normal.png",
          pressed: "index/levytype-pressed.png",
          state: true,
          url: "../levytype/levytype"
        },
        {
          id: "port",
          name: "港口",
          normal: "index/port-normal.png",
          pressed: "index/port-pressed.png",
          state: true,
          url: "../port/port"
        },
        {
          id: "wrap",
          name: "包装种类",
          normal: "index/packaging-normal.png",
          pressed: "index/packaging-pressed.png",
          state: true,
          url: "../wrap/wrap"
        },
        {
          id: "transac",
          name: "成交方式",
          normal: "index/transac-normal.png",
          pressed: "index/transac-pressed.png",
          state: true,
          url: "../transac/transac"
        },
      ],
      [{
          id: "licensedocu",
          name: "监管证件",
          normal: "index/licensedocu-normal.png",
          pressed: "index/licensedocu-pressed.png",
          state: true,
          url: "../licensedocu/licensedocu"
        },
        {
          id: "edoc",
          name: "随附单据",
          normal: "index/edoc-normal.png",
          pressed: "index/edoc-pressed.png",
          state: true,
          url: "../edoc/edoc"
        },
        {
          id: "ftacode",
          name: "优惠贸易协定",
          normal: "index/fta-normal.png",
          pressed: "index/fta-pressed.png",
          state: true,
          url: "../ftacode/ftacode"
        },
        {
          id: "district",
          name: "国内地区",
          normal: "index/district-normal.png",
          pressed: "index/district-pressed.png",
          state: true,
          url: "../district/district"
        },
        {
          id: "levymode",
          name: "征减免税方式",
          normal: "index/levymode-normal.png",
          pressed: "index/levymode-pressed.png",
          state: true,
          url: "../levymode/levymode"
        },
      ],
      [{
          id: "inland",
          name: "国内口岸",
          normal: "index/inland-normal.png",
          pressed: "index/inland-pressed.png",
          state: true,
          url: "../inland/inland"
        },
        {
          id: "",
          name: "",
          normal: "",
          pressed: "",
          state: false,
          url: ""
        },
        {
          id: "",
          name: "",
          normal: "",
          pressed: "",
          state: false,
          url: ""
        },
        {
          id: "",
          name: "",
          normal: "",
          pressed: "",
          state: false,
          url: ""
        },
        {
          id: "",
          name: "",
          normal: "",
          pressed: "",
          state: false,
          url: ""
        },
      ]
    ],
    table1: [
      [{
          id: "carbrand",
          name: "中英文对照",
          normal: "index/carbrand-normal.png",
          pressed: "index/carbrand-pressed.png",
          state: true,
          url: "../carbrand/carbrand"
        },
        {
          id: "carparts",
          name: "汽车零部件清单",
          normal: "index/carparts-normal.png",
          pressed: "index/carparts-pressed.png",
          state: true,
          url: "../carparts/carparts"
        },
        {
          id: "",
          name: "",
          normal: "",
          pressed: "",
          state: false,
          url: ""
        },
        {
          id: "",
          name: "",
          normal: "",
          pressed: "",
          state: false,
          url: ""
        },
        {
          id: "",
          name: "",
          normal: "",
          pressed: "",
          state: false,
          url: ""
        },
      ],
    ],
    table2: [
      [{
          id: "codets",
          name: app.translater("税则"),
          normal: "index/ccba_codeTs-normal.png",
          pressed: "index/ccba_codeTs-pressed.png",
          state: true,
          url: "../codets/codets"
        },
        {

          id: "complex",
          name: "统计商品目录",
          normal: "index/complex-normal.png",
          pressed: "index/complex-pressed.png",
          state: true,
          url: "../complex/complex"
        },
        {
          id: "merchElement",
          name: "规范申报要素",
          normal: "index/ccba_merchElement-normal.png",
          pressed: "index/ccba_merchElement-pressed.png",
          state: true,
          url: "../merchElement/merchElement"
        },
        {
          id: "ciq",
          name: app.translater("法检目录"),
          normal: "index/ccba_ciq-normal.png",
          pressed: "index/ccba_ciq-pressed.png",
          state: true,
          url: "../ciq/ciq"
        },
        {
          id: "cccList",
          name: app.translater("3C目录"),
          normal: "index/ccba_ccc-normal.png",
          pressed: "index/ccba_ccc-pressed.png",
          state: true,
          url: "../cccList/cccList"
        },

      ],
      [{
          id: "ciqCode",
          name: "CIQ编码",
          normal: "index/ccba_ciqCode-normal.png",
          pressed: "index/ccba_ciqCode-pressed.png",
          state: true,
          url: "../ciqCode/ciqCode"
        },
        {
          id: "",
          name: "",
          normal: "",
          pressed: "",
          state: false,
          url: ""
        },
        {
          id: "",
          name: "",
          normal: "",
          pressed: "",
          state: false,
          url: ""
        },
        {
          id: "",
          name: '',
          normal: "",
          pressed: "",
          state: false,
          url: ""
        },
        {
          id: "",
          name: '',
          normal: "",
          pressed: "",
          state: false,
          url: ""
        },
      ],
    ]
  },

  onLoad: function(options) {
    var tmp = {};
    var that = this
    that.data.table.forEach(function(vals, index) {
      vals.forEach(function(val, index) {
        val.name1 = val.name.substring(0, 4)
        val.name2 = val.name.substring(4)
      })
    })
    that.data.table1.forEach(function(vals, index) {
      vals.forEach(function(val, index) {
        val.name1 = val.name.substring(0, 4)
        val.name2 = val.name.substring(4)
      })
    })
    that.data.table2.forEach(function(vals, index) {
      vals.forEach(function(val, index) {
        val.name1 = val.name.substring(0, 4)
        val.name2 = val.name.substring(4)
      })
    })
    this.data.titles.forEach(function(value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp,
      table: that.data.table,
      table1: that.data.table1,
      table2: that.data.table2,
    })
    wx.setNavigationBarTitle({
      title: app.translater("通关参数")
    })
    app.authorize()
    var that = this
    app.getUserInfo(function(userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  details: function(e) {
    var url = e.currentTarget.dataset.url
    console.log(url)
    if (url == 'xxxxx') {
      wx.showToast({
        icon: 'none',
        title: '暂无更多活动，敬请期待 . . .',
      })
    } else if (url == '') {
      return
    } else {
      if (url.length == 0) {
        return
      }
      wx.navigateTo({
        url: url,
      })
    }
  },
  pressing: function(e) {},
  touchBegin: function(e) {
    var that = this
    app.utils.touchBegin(that, e)
  },
  othertouchBegin: function(e) {
    var that = this
    app.utils.othertouchBegin(that, e)
  },
  lasttouchBegin: function(e) {
    var that = this
    app.utils.lasttouchBegin(that, e)
  },
  touchOver: function(e) {
    var that = this
    app.utils.touchOver(that, e)
  },
  othertouchOver: function(e) {
    var that = this
    app.utils.othertouchOver(that, e)
  },
  lasttouchOver: function(e) {
    var that = this
    app.utils.lasttouchOver(that, e)
  },
  touchStart: function(e) {
    this.setData({
      touchStart: e.touches[0].clientY,
      touchX: e.touches[0].clientX
    })
  },
  touchMove: function(e) {
    var that = this
    app.utils.tarBarTouchMove(that, e)
  },
  touchEnd: function() {
    var that = this
    var url_left = '../home/home'
    var url_right = '../index/index'
    app.utils.tarBarTouchEnd(that, url_left, url_right)
  }
})