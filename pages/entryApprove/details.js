var app = getApp()
Page({
  data: {
    array: ['已接单，待提交', '接单提交，待录入', '已录入，待提交', '录入提交，待审核', '已审核，待修改', '已审核，待申报', '已修改，待申报', '单一窗口申报中', '已过机', '结案'],
    hiddenmodalput: true,
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      seq_no:"",
      site: "",
      name:"",
      i_e_flag: ""
    },
    userInfo: {},
    datas: [],
    obj: {}
  },

  onLoad: function (options) {
    app.authorize()
    var that = this
    app.getUserInfo(function (userInfo) {
      that.data.searchModel.site = userInfo.site
      that.data.userInfo = userInfo
    })
    var obj = wx.getStorageSync('obj')
    var i_e_flag = wx.getStorageSync('i_e_flag')
    that.data.searchModel.i_e_flag = i_e_flag
    that.setData({
      obj: obj,
      i_e_flag: i_e_flag
    })
  },
  onShow: function () {
    wx.setStorageSync('fromDetailsToList', 'false')
  },
  reviewResult: function (e) {
    var that = this
    that.setData({
      hiddenmodalput: true
    });
    that.data.searchModel.seq_no = e.currentTarget.dataset.id
    that.data.searchModel.name = that.data.userInfo.userName
    app.httpUtils.post('EntryApprove', that.data.searchModel, function (data) {
      if (data.Success) {
        that.after()
      }
    })
  },
  after: function () {
    var that = this
    app.utils.approveAfter(that)
  },
  ShowAudit: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
})