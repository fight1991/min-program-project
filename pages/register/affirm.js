import WxValidate from '../../utils/WxValidate'
var app = getApp()
Page({
  data: {
    currentUser: {},
  },
  onLoad: function (options) {
    var that=this
    this.initValidate()
    that.setData({
      currentUser:{
        mobile: options.mobile
      }
    })
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      password: {
        required: true,
      },
      oncepassword: {
        required: true,
        equalTo: 'password'
      },
    }
    const messages = {
      password: {
        required: '密码不为空',
      },
      oncepassword: {
        required: '确认密码不为空',
        equalTo:'确认密码与密码不一致'
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
  nextstep: function (e) {
    var that = this
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      wx.navigateTo({
        url: 'complete?mobile=' + that.data.currentUser.mobile + '&password=' + that.data.currentUser.password,
      })
    }
  },
  bindData: function (e) {
    var id = e.currentTarget.id
    this.data.currentUser[id] = e.detail.value
  },
})