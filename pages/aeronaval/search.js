var app = getApp()
Page({
  data: {
    datas: [],
    style: "back",
    arrayTrafMode: ['海运', '空运'],
    arrayFlag: ['进口', '出口'],
    searchModel: {
      type: 'Search',
    },
    disabled: ''
  },
  onLoad: function(options) {
    var that = this
    if (options.isFromLogisticsTracking == 'true') {
      if (options.trafMode == '2') {
        options.trafMode == '海运'
      } else if (options.trafMode == '5') {
        options.trafMode == '空运'
      }
      that.data.searchModel.i_e_flag = options.iEFlag == 'null' ? '' : options.iEFlag
      that.data.searchModel.custom_master = options.customMaster == 'null' ? '' : options.customMaster
      that.data.searchModel.bill_nos = options.mawbNo == 'null' ? '' : options.mawbNo
      that.data.searchModel.bill_no = options.billNo == 'null' ? '' : options.billNo
      that.data.searchModel.traf_mode = options.voyFlightNo == 'null' ? '' : options.voyFlightNo
      that.setData({
        i_e_flag: options.iEFlag == 'I' ? '进口' : '出口',
        searchModel: that.data.searchModel
      })
    }
    this.data.searchModel.trafMode = options.trafMode
    if (options.trafMode == '海运') {
      this.data.searchModel.accessName = '海运舱单查询'
      wx.setNavigationBarTitle({
        title: '海运舱单查询',
      })
    } else {
      this.data.searchModel.accessName = '空运舱单查询'
      wx.setNavigationBarTitle({
        title: '空运舱单查询',
      })
    }
    var that = this
    app.authorize()
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
    //显示上一次查询数据
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
    })
    var that = this
    app.getUserInfo(function(userInfo) {
      that.data.searchModel.site = userInfo.site
      var bg1 = userInfo.theme + "/newsearch.png"
      that.setData({
        theme: userInfo.theme,
        bg: bg1
      })
    })
  },
  onShow: function() {
    wx.setStorageSync('load', 'false')
  },
  bindData: function(e) {
    var that = this
    app.utils.bindData(that, e)
  },
  search: function(e) {
    this.data.searchModel.type = "Search"
    var that = this
    that.setData({
      disabled: 'disabled'
    })
    var custom_master = that.data.searchModel.custom_master
    if (typeof custom_master == "undefined" || custom_master == "" || !this.isInteger(custom_master)) {
      wx.showToast({
        icon: 'none',
        title: '关区代码格式不正确',
      })
      that.setData({
        disabled: ''
      })
    } else {
      wx.showLoading({
        title: '查询中',
      })
      this.initData(function(data) {
        that.setData({
          disabled: ''
        })
        console
        wx.hideLoading()
        if (data.Data5.data == null || data.Data5.data.BILL_NO == '') {
          wx.showToast({
            icon: 'none',
            title: '查无数据',
          })
        } else {
          wx.setStorageSync('datasss', data.Data5.data)
          wx.navigateTo({
            url: 'aeronaval'
          })
        }
      })
    }
  },
  initData: function(callback) {
    var that = this

    var url = "ManifestInfo"
    if (that.data.searchModel.trafMode == '海运') {
      url = 'ManifestInfoForSea'

    } else if (that.data.searchModel.trafMode == '空运') {
      url = 'ManifestInfoForAir'
    }
    app.httpUtils.get(url, that.data.searchModel, callback)
  },
  reset: function() {
    this.data.searchModel.entry_id = ""
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
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
  bindChangeTrafMode: function(e) {
    var selectItemTrafMode = e.detail.value
    this.data.searchModel.traf_mode = this.data.arrayTrafMode[selectItemTrafMode]
    this.setData({
      trafMode: this.data.arrayTrafMode[selectItemTrafMode]
    })
  },
  bindChangeFlag: function(e) {
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
  bindChangeCustom: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var selectCustom = e.detail.value
    this.setData({
      custom: this.data.customsList[selectCustom].Text
    })
    this.data.searchModel.custom = this.data.customsList[selectCustom].Code
  },
  isInteger: function(str) {
    var regNum = new RegExp('\\d{4}')
    return regNum.test(str)
  },
  scanCode: function(e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scan(that, key)
  },
})