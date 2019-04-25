var app = getApp()
Page({
  data: {
    titles: ["表头", "料件表", "成品表", "单损耗", "料件归并关系", "成品归并关系", "BOM表", "文档资料", "点击查看"],
    titless: {},
    ems_no: "",
    ems_type: "",
    trade_code: ""
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.ems_no,
    })
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    this.data.ems_no = options.ems_no
    this.data.ems_type = options.ems_type
    this.data.trade_code = options.trade_code
  },
  onShow: function () {
    wx.setStorageSync('fromButtonToHead', 'false')
  },
  enterItem: function (e) {
    var src = e.currentTarget.id
    if (src == "CusHead") {
      //账册表头
      wx.navigateTo({
        url: 'details?src=' + src + "&ems_no=" + this.data.ems_no,
      })
    } else if (src == "SysDoc") {
      //文档资料
      wx.navigateTo({
        url: 'details?src=' + src + "&bill_no=" + this.data.ems_no + "&bill_type=" + "EMS",
      })
    } else {
      wx.navigateTo({
        url: 'infoList?src=' + src + "&ems_no=" + this.data.ems_no + "&ems_type=" + this.data.ems_type + "&trade_code=" + this.data.trade_code,
      })
    }
  }
})