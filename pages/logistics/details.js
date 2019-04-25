var app = getApp()
Page({
  data: {
    array: ['已接单，待提交', '接单提交，待录入', '已录入，待提交', '录入提交，待审核', '已审核，待修改', '已审核，待申报', '已修改，待申报', '单一窗口申报中', '已过机', '结案'],
    obj: {},
  },
  onLoad: function (e) {
    app.authorize()
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    var obj = JSON.parse(e.obj);
    obj.ATD = app.utils.dateFormatter(obj.ATD)
    obj.CHANGE_BILL_DATE = app.utils.dateFormatter(obj.CHANGE_BILL_DATE)
    obj.PICK_UP_DATE = app.utils.dateFormatter(obj.PICK_UP_DATE)
    obj.DELIVERY_DATE = app.utils.dateFormatter(obj.DELIVERY_DATE)
    obj.RCV_DATE = app.utils.dateFormatter(obj.RCV_DATE)
    obj.SUBMIT_TIME = app.utils.dateFormatter(obj.SUBMIT_TIME)
    obj.AUDIT_TIME = app.utils.dateFormatter(obj.AUDIT_TIME)
    obj.D_DATE = app.utils.dateFormatter(obj.D_DATE)    
    obj.CLOSURE_TIME = app.utils.dateFormatter(obj.CLOSURE_TIME)
    obj.BROKER_SIGNFOR_TIME = app.utils.dateFormatter(obj.BROKER_SIGNFOR_TIME)
    obj.CUSTOMER_SIGNFOR_TIME = app.utils.dateFormatter(obj.CUSTOMER_SIGNFOR_TIME)
    obj.CASH_DEPOSIT_TIME = app.utils.dateFormatter(obj.CASH_DEPOSIT_TIME)
    that.setData({
      i_e_flag: wx.getStorageSync('i_e_flag'),
      obj: obj,
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo
      })
    })
  },
  onShow: function () {
    wx.setStorageSync('fromDetailsToList', 'false')
  },
  swichNav: function (e) {
    var that = this
    if (this.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  hide: function () {
    this.setData(
      {
        showModalStatus: false
      }
    )
  },
})  