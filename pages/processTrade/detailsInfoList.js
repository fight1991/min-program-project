// pages/accountBookE/detailsInfoList.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: ["查询", "项号", "计量单位", "法定单位", "关闭", "账册编号", "企业内部编号", "经营单位代码", "经营单位名称", "收发货单位代码", "文档上传标识", "收发货单位名称", "序号", "商品货号", "商品编码", "商品名称", "规格型号", "计量单位", "法定单位", "第二单位", "处理标志", "备注", "币制", "原产国", "单耗版本号", "料件序号", "料件货号", "料件名称", "净耗", "损耗率", "英文品名", "BOM版本号", "开始日期", "结束日期", "成品序号", "成品货号", "成品名称"],
    titless: {},
    src: "",
    obj: {},
    searchModel: {},
    files: []
  },
  onLoad: function (options) {
    this.data.src = options.path
    this.data.searchModel = JSON.parse(options.search)
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp,
      src: options.path,
    })
    wx.setNavigationBarTitle({
      title: options.ems_no,
    })
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function () {
    var that = this
    console.log(that.data.src)
    console.log(that.data.searchModel)
    app.httpUtils.get(that.data.src, that.data.searchModel, function (data) {
      if (data.Success) {
        that.setData({
          obj: data.Data5,
        })
        console
      }
    })
  },
})