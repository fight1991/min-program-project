var app = getApp()
import WxValidate from '../../utils/WxValidate'
Page({
  data: {
    userId: '',
    logData4Address: [],
    addressModel: {
      city: '',
      address: ''
    },
    type: ''
  },
  onLoad: function (options) {
    var that = this
    this.initValidate()
  },
  onReady: function () {
  },
  onShow: function () {

  },
  bindData: function (e) {
    var id = e.currentTarget.id
    this.data.addressModel[id] = e.detail.value
  },
  confirm: function (e) {
    var that = this
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]
      console.log(prevPage.data.address)
      prevPage.setData({
        address: that.data.addressModel.city + that.data.addressModel.address
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      city: {
        required: true,
      },
      address: {
        required: true,
      },
    }
    const messages = {
      city: {
        required: "城市不为空",
      },
      address: {
        required: "地址不为空",
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
      duration: 1000
    })
  },
  showAddress: function () {
    var that = this
    wx.navigateTo({
      url: 'country',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})