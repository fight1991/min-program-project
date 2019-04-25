var app = getApp()
Page({
  data: {
    titles: ["项号", "商品编码", "请输入", "重置", "搜索", "成品项号", "版本号", "料件项号"],
    titless: {},
    datas: [],
    style: "back"
  },
  onLoad: function (options) {
    app.authorize()
    console.log(options)
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      console.log(value)
      tmp[value] = app.translater(value)
    })
    this.setData({
      src: options.src,
      titless: tmp
    })
    this.setData({
      src: options.src
    })
    if (this.data.src == "CusImg") {
      wx.setNavigationBarTitle({
        title: app.translater('账册料件查询'),
      })
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          ems_no: options.ems_no,
          trade_code: options.trade_code,
          ems_type: options.ems_type,
          g_no: options.g_no,
          code_t_s: options.code_t_s
        }
      })
    } else if (this.data.src == "CusExg") {
      wx.setNavigationBarTitle({
        title: app.translater('账册成品查询'),
      })
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          ems_no: options.ems_no,
          trade_code: options.trade_code,
          ems_type: options.ems_type,
          g_no: options.g_no,
          code_t_s: options.code_t_s
        }
      })
    } else if (this.data.src == "CusConsume") {
      wx.setNavigationBarTitle({
        title: app.translater('单损耗查询'),
      })
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          exg_no: options.exg_no,
          exg_version: options.exg_version,
          ems_no: options.ems_no,
          trade_code: options.trade_code,
          ems_type: options.ems_type
        }
      })
    } else if (this.data.src == "OrgImg") {
      wx.setNavigationBarTitle({
        title: app.translater('料件归并关系查询'),
      })
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          cop_g_no: options.cop_g_no,
          ems_no: options.ems_no,
          trade_code: options.trade_code,
          ems_type: options.ems_type
        }
      })
    } else if (this.data.src == "OrgExg") {
      wx.setNavigationBarTitle({
        title: app.translater('成品归并关系查询'),
      })
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          cop_g_no: options.cop_g_no,
          ems_no: options.ems_no,
          trade_code: options.trade_code,
          ems_type: options.ems_type
        }
      })
    } else if (this.data.src == "OrgBom") {
      wx.setNavigationBarTitle({
        title: app.translater('BOM表查询'),
      })
      console.log(options)
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          ems_no: options.ems_no,
          trade_code: options.trade_code,
          ems_type: options.ems_type,
          cop_exg_no: options.cop_exg_no,
          cop_img_no: options.cop_img_no,
          begin_date: options.begin_date
        }
      })
    }
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function () {
    wx.setStorageSync('load', 'false')
  },
  bindData: function (e) {
    var that = this
    app.utils.bindData(that, e)
  },
  search: function (e) {
    app.utils.search(this.data.searchModel)
  },
  // 重置
  reset: function () {
    if (this.data.src == "CusImg") {
      this.data.searchModel.g_no = ""
      this.data.searchModel.code_t_s = ""
    } else if (this.data.src == "CusExg") {
      this.data.searchModel.g_no = ""
      this.data.searchModel.code_t_s = ""
    } else if (this.data.src == "OrgImg") {
      this.data.searchModel.cop_g_no = ""
    } else if (this.data.src == "OrgExg") {
      this.data.searchModel.cop_g_no = ""
    } else if (this.data.src == "OrgBom") {
      this.data.searchModel.cop_exg_no = ""
      this.data.searchModel.cop_img_no = ""
      this.data.searchModel.begin_date = ""
    }
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
    })
  },
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
  },
  //二维码扫描功能
  scanCode: function (e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scan(that, key)
  }
})