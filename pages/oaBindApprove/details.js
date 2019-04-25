var app = getApp()
Page({
  data: {
    titles: ["三方昵称", "用户ID", "审核状态", "用户工厂", "用户地址", "用户邮箱", "审核状态", "申请时间", "审核人", "审核时间", "备注", "不同意", "同意"],
    titless: {},
    getInstance: {
      seq_no: "",
    },
    postInstance: {
      open_id: "",
      audit_user: "",
      status: ""
    },
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      user_site: "",
      status: "N"
    },
    searchModel_ed: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      user_site: "",
      status: "Y"
    },
    userInfo: {},
    datas: [],
    datas_ed: [],
    obj: {},
  },
  onShow: function () {
    wx.setStorageSync('fromDetailsToList', 'false')
  },
  onLoad: function (options) {
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
    var open_id = wx.getStorageSync('open_id')
    that.setData({
      getInstance: {
        open_id: open_id,
      },
    })
    app.getUserInfo(function (userInfo) {
      that.data.searchModel.user_site = userInfo.site
      that.data.searchModel_ed.user_site = userInfo.site
      that.data.postInstance.audit_user = userInfo.userName
    })
    app.httpUtils.get('OABindApprove', this.data.getInstance, function (data) {
      if (data.Success) {
        var obj = data.Data5
        obj.CREATE_DATE = app.utils.dateFormatter(obj.CREATE_DATE)
        obj.AUDIT_DATE = app.utils.dateFormatter(obj.AUDIT_DATE)
        that.setData({
          obj: obj
        })
      }
    })
  },
  reviewResult: function (e) {
    var that = this;
    var id = e.currentTarget.id
    that.data.postInstance.open_id = e.currentTarget.dataset.id
    if (id == "notPass") {
      that.after()
    } else if (id == "pass") {
      that.data.postInstance.status = "Y"
      app.httpUtils.post('OABindApprove', this.data.postInstance, function (data) {
        if (data.Success) {
          that.after()
        }
      })
    }
  },
  after: function () {
    var that = this
    app.utils.approveAfter(that)
  }
})