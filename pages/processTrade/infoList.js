var app = getApp()
Page({
  data: {
    titles: ["查询", "项号", "计量单位", "法定单位", "关闭", "账册编号", "企业内部编号", "经营单位代码", "经营单位名称", "收发货单位代码", "文档上传标识", "收发货单位名称", "序号", "商品货号", "商品编码", "商品名称", "规格型号", "计量单位", "法定单位", "第二单位", "处理标志", "备注", "币制", "原产国", "单耗版本号", "料件序号", "料件名称", "净耗", "损耗率", "英文品名", "BOM版本号", "开始日期", "结束日期", "成品序号", "成品货号", "成品名称"],
    titless: {},
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    datas: [],
    status_flag: false,
    backFlag: true,
    load: 'true',
    showList: false,
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    showFinish: true,
    src: ""
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
    app.utils.loadMore(that)
  },
  initData: function (flag) {
    var that = this
    var path = that.data.src
    app.httpUtils.initData(that, flag, path)
  },
  onLoad: function (options) {
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      console.log(value)
      tmp[value] = app.translater(value)
    })
    this.setData({
      src: options.src,
      titles: [app.translater(this.data.titles[0])],
      titless: tmp
    })
    if (this.data.src == "CusImg") {
      wx.setNavigationBarTitle({
        title: app.translater("账册料件") + "(" + options.ems_no + ")",
      })
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          ems_no: options.ems_no,
          ems_type: options.ems_type,
          g_no: "",
          code_t_s: ""
        }
      })
    } else if (this.data.src == "CusExg") {
      wx.setNavigationBarTitle({
        title: app.translater("账册成品") + "(" + options.ems_no + ")",
      })
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          trade_code: options.trade_code,
          ems_no: options.ems_no,
          ems_type: options.ems_type,
          g_no: "",
          code_t_s: ""
        }
      })
    } else if (this.data.src == "CusConsume") {
      wx.setNavigationBarTitle({
        title: app.translater("账册单损耗") + "(" + options.ems_no + ")",
      })
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          trade_code: options.trade_code,
          ems_no: options.ems_no,
          ems_type: options.ems_type,
          exg_no: "",
          exg_version: ""
        }
      })
    } else if (this.data.src == "OrgImg") {
      wx.setNavigationBarTitle({
        title: app.translater("料件归并关系") + "(" + options.ems_no + ")",
      })
      //根据货号查询
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          trade_code: options.trade_code,
          ems_no: options.ems_no,
          ems_type: options.ems_type,
          cop_g_no: ""
        }
      })
    } else if (this.data.src == "OrgExg") {
      wx.setNavigationBarTitle({
        title: app.translater("成品归并关系") + "(" + options.ems_no + ")",
      })
      //根据货号查询
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          trade_code: options.trade_code,
          ems_no: options.ems_no,
          ems_type: options.ems_type,
          cop_g_no: ""
        }
      })
    } else if (this.data.src == "OrgBom") {
      wx.setNavigationBarTitle({
        title: app.translater("Bom表") + "(" + options.ems_no + ")",
      })
      this.setData({
        searchModel: {
          enable: true,
          PageIndex: 1,
          pageSize: 10,
          trade_code: options.trade_code,
          ems_no: options.ems_no,
          ems_type: options.ems_type,
          cop_exg_no: "",
          cop_img_no: "",
          begin_date: ""
        },
        EMS_NO: options.ems_no
      })
    }
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function () {
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
  },
  showSearch: function (e) {
    this.setData({
      backFlag: true
    })
    if (this.data.src == "CusImg") {
      wx.navigateTo({
        url: 'detailsSearch?g_no=' + this.data.searchModel.g_no + "&code_t_s=" + this.data.searchModel.code_t_s + "&src=" + this.data.src + "&ems_no=" + this.data.searchModel.ems_no + "&trade_code=" + this.data.searchModel.trade_code + "&ems_type=" + this.data.searchModel.ems_type,
      })
    } else if (this.data.src == "CusExg") {
      wx.navigateTo({
        url: 'detailsSearch?g_no=' + this.data.searchModel.g_no + "&code_t_s=" + this.data.searchModel.code_t_s + "&src=" + this.data.src + "&ems_no=" + this.data.searchModel.ems_no + "&trade_code=" + this.data.searchModel.trade_code + "&ems_type=" + this.data.searchModel.ems_type,
      })
    } else if (this.data.src == "CusConsume") {
      wx.navigateTo({
        url: 'detailsSearch?exg_no=' + this.data.searchModel.exg_no + "&exg_version=" + this.data.searchModel.exg_version + "&src=" + this.data.src + "&ems_no=" + this.data.searchModel.ems_no + "&trade_code=" + this.data.searchModel.trade_code + "&ems_type=" + this.data.searchModel.ems_type,
      })
    } else if (this.data.src == "OrgImg") {
      wx.navigateTo({
        url: 'detailsSearch?cop_g_no=' + this.data.searchModel.cop_g_no + "&src=" + this.data.src + "&ems_no=" + this.data.searchModel.ems_no + "&trade_code=" + this.data.searchModel.trade_code + "&ems_type=" + this.data.searchModel.ems_type,
      })
    } else if (this.data.src == "OrgExg") {
      wx.navigateTo({
        url: 'detailsSearch?cop_g_no=' + this.data.searchModel.cop_g_no + "&src=" + this.data.src + "&ems_no=" + this.data.searchModel.ems_no + "&trade_code=" + this.data.searchModel.trade_code + "&ems_type=" + this.data.searchModel.ems_type,
      })
    } else if (this.data.src == "OrgBom") {
      wx.navigateTo({
        url: 'detailsSearch?cop_exg_no=' + this.data.searchModel.cop_exg_no + "&cop_img_no=" + this.data.searchModel.cop_img_no + "&begin_date=" + this.data.searchModel.begin_date + "&src=" + this.data.src + "&ems_no=" + this.data.searchModel.ems_no + "&trade_code=" + this.data.searchModel.trade_code + "&ems_type=" + this.data.searchModel.ems_type,
      })
    }
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
  },
  showDetails: function (e) {
    if (this.data.showFinish == true) {
      var currentStatu = e.currentTarget.dataset.statu
      var ems_no = e.currentTarget.id
      var pk_no = e.currentTarget.dataset.pk_no
      if (this.data.src == "CusImg") {
        this.setData({
          getInstance: {
            ems_no: ems_no,
            pk_no: pk_no,
          }
        })
      } else if (this.data.src == "CusExg") {
        this.setData({
          getInstance: {
            ems_no: ems_no,
            pk_no: pk_no,
          }
        })
      } else if (this.data.src == "CusConsume") {
        this.setData({
          getInstance: {
            ems_no: ems_no,
            pk_no: pk_no,
          }
        })
      } else if (this.data.src == "OrgImg") {
        var cop_ems_no = e.currentTarget.dataset.cop_ems_no
        var trade_code = this.data.searchModel.trade_code
        var cop_g_no = e.currentTarget.dataset.cop_g_no
        var g_no = e.currentTarget.dataset.g_no
        this.setData({
          getInstance: {
            cop_ems_no: cop_ems_no,
            trade_code: trade_code,
            cop_g_no: cop_g_no,
            g_no: g_no
          }
        })
      } else if (this.data.src == "OrgExg") {
        var trade_code = e.currentTarget.dataset.trade_code
        var cop_ems_no = e.currentTarget.dataset.cop_ems_no
        var cop_g_no = e.currentTarget.dataset.cop_g_no
        var g_no = e.currentTarget.dataset.g_no
        this.setData({
          getInstance: {
            cop_ems_no: cop_ems_no,
            trade_code: trade_code,
            cop_g_no: cop_g_no,
            g_no: g_no
          }
        })
      } else if (this.data.src == "OrgBom") {
        var trade_code = e.currentTarget.dataset.trade_code
        var cop_ems_no = e.currentTarget.dataset.cop_ems_no
        var cop_exg_no = e.currentTarget.dataset.cop_exg_no
        var cop_img_no = e.currentTarget.dataset.cop_img_no
        this.setData({
          getInstance: {
            trade_code: trade_code,
            cop_ems_no: cop_ems_no,
            cop_exg_no: cop_exg_no,
            cop_img_no: cop_img_no
          }
        })
      }
      // this.util(currentStatu)
      var that = this
      var path = this.data.src
      var search = this.data.getInstance
      wx.navigateTo({
        url: 'detailsInfoList?path=' + path + '&search=' + JSON.stringify(search) + '&ems_no=' + ems_no,
      })
    }
  },
})