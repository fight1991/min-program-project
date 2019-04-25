var app = getApp()
Page({
  data: {
    titles: ["用户ID", "用户名称", "三方昵称", "审核状态", "类型", "申请时间", "审核人", "审核时间", "不同意", "同意"],
    titless: {},
    getInstance: {
      seq_no: "",
    },
    postInstance: {
      seq_no: "",
      audit_user: "",
      audit_note: "",
      status: ""
    },
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      site: "",
      status: "未审核"
    },
    searchModel_ed: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      site: "",
      status: "通过"
    },
    userInfo: {},
    datas: [],
    datas_ed: [],
    obj: {},
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
    var that = this
    var seq_no = wx.getStorageSync('seq_no')
    that.setData({
      getInstance: {
        seq_no: seq_no,
      },
    })
    app.getUserInfo(function (userInfo) {
      that.data.searchModel.site = userInfo.site
      that.data.searchModel_ed.site = userInfo.site
      that.data.postInstance.audit_user = userInfo.userName
    })
    app.httpUtils.get('CmsBindApprove', this.data.getInstance, function (data) {
      if (data.Success) {
        var obj = data.Data5
        obj.CREATE_DATE = app.utils.dateFormatter(obj.CREATE_DATE)
        obj.AUDIT_TIME = app.utils.dateFormatter(obj.AUDIT_TIME)
        that.setData({
          obj: obj
        })
      }
    })
  },
  onShow: function () {
    wx.setStorageSync('fromDetailsToList', 'false')
  },
  reviewResult: function (e) {
    var that = this
    var id = e.currentTarget.id
    that.data.postInstance.seq_no = e.currentTarget.dataset.id
    if (id == "notPass") {
      that.after()
    } else if (id == "pass") {
      that.data.postInstance.status = "通过"
      app.httpUtils.post('CmsBindApprove', this.data.postInstance, function (data) {
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