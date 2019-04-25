var app = getApp()
Page({
  data: {
    titles: ["查询", "供应商代码", "供应商名称", "简称", "是否关联方", "联系人", "电话号码", "所属国", "地区", "传真", "公司地址", "邮政编码", "备注", "付款方式", "关闭"],
    titless: {},
    searchModel: {
      seq_no: "",
      accessName: '供应商详情查询'
    },
    obj: {},
  },
  onLoad: function (options) {
    this.data.searchModel["seq_no"] = options.seq_no
    var tmp = {

    }
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    wx.setNavigationBarTitle({
      title: options.customer_id
    })
    var that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  onShow: function () {
    var that = this
    app.httpUtils.get('Supplier', that.data.searchModel, function (data) {
      if (data.Success) {
        that.setData({
          obj: data.Data5,
        })
      }
    })
  },
})