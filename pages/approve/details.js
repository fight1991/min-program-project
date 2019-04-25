var app = getApp()
Page({
  data: {
    titles: ["审核类型", "审批人", "货号", "货品类型", "品名", "商品编码", "锁定标识", "HS检测", "申报要素", "英文品名", "企业单位", "申报单位", "法定单位", "第二单位", "申报比例", "法定比例", "第二比例", "保税标识", "监管条件", "3C标识", "商检标识", "归并标识", "币制", "原产国", "净重", "单价", "关税税率", "最惠国税率", "暂定税率", "业务单元", "项目名称", "CCC证书号", "CCC界定", "品牌", "备注", "申请人", "申请时间", "审批说明", "不同意", "同意"],
    titless: {},
    getInstance: {
      seq_no: "",
    },
    postInstance: {
      seq_no: "",
      audit_user: "",
      audit_note: "",
      audit_flag: ""
    },
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      site: "",
      audit_flag: "未审核",
      audit_user: ""
    },
    searchModel_ed: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      site: "",
      audit_flag: "通过",
      audit_user: ""
    },
    userInfo: {},
    datas: [],
    datas_ed: [],
    obj: {}
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
    var id = wx.getStorageSync('id')
    that.setData({
      getInstance: {
        seq_no: id,
      },
    })
    app.getUserInfo(function (userInfo) {
      that.data.searchModel.audit_user = userInfo.userName
      that.data.searchModel_ed.audit_user = userInfo.userName
      that.data.searchModel.site = userInfo.site
      that.data.searchModel_ed.site = userInfo.site
      that.data.postInstance.audit_user = userInfo.userName
    })
    app.httpUtils.get('Approve', this.data.getInstance, function (data) {
      if (data.Success) {
        var obj = data.Data5
        obj.UPDATE_TIME = app.utils.dateFormatter(obj.UPDATE_TIME)
        that.setData({
          obj: obj
        })
      }
    })
  },
  onShow: function () {
    wx.setStorageSync('fromDetailsToList', 'false')
  },
  bindData: function (e) {
    this.data.postInstance.audit_note = e.detail.value
  },
  reviewResult: function (e) {
    var that = this
    var id = e.currentTarget.id
    that.data.postInstance.seq_no = e.currentTarget.dataset.id
    if (id == "notPass") {
      that.data.postInstance.audit_flag = "未通过"
    } else if (id == "pass") {
      that.data.postInstance.audit_flag = "已通过"
    }
    app.httpUtils.post('Approve', that.data.postInstance, function (data) {
      if (data.Success) {
        that.after()
      }
    })
  },
  after: function () {
    var that = this
    app.utils.approveAfter(that)
  }
})