var interval = null //倒计时函数
import WxValidate from '../../utils/WxValidate'
var app = getApp()
Page({
  data: {
    date: '请选择日期',
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 60,
    currentUser: {},
    isRegist :false,
    currentNum:''
  },
  onLoad: function (options) {
    this.initValidate()
  },
  bindData: function (e) {
    var id = e.currentTarget.id
    this.data.currentUser[id] = e.detail.value
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      mobile: {
        required: true,
        tel: true,
      },
      verificationcode: {
        required: true,
      },
    }
    const messages = {
      mobile: {
        required: "手机号码不为空",
      },
      verificationcode: {
        required: "验证码不为空",
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  nextstep: function (e) {
    var that = this
    if (that.data.isRegist == true && that.data.currentNum == that.data.currentUser.mobile){
      wx.showToast({
        icon: 'none',
        title: "该手机号已注册"
      })
      return
    }
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      app.httpUtils.get('Verify', { send_code: that.data.currentUser.verificationcode, mobile: that.data.currentUser.mobile, sms_type: '001' }, function (data) {
        if (data.Data5.Success) {
          wx.navigateTo({
            url: 'affirm?mobile=' + that.data.currentUser.mobile,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: data.Data5.ErrorMessage,
          })
        }
      })

    }
  },
  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
      duration: 1000
    })
  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1800)
  },
  getVerificationCode() {
    var that = this
    wx.showLoading({
    })
    that.data.isRegist = false
    that.data.currentNum = ''
    app.httpUtils.get('Register', { mobile: that.data.currentUser.mobile, sms_type: '001' }, function (data) {
      if (!data.Data5.Success) {
        if (data.Data5.ErrorMessage == "触发分钟级流控Permits:1") {
          data.Data5.ErrorMessage = "验证码获取频繁，请稍候再试"

        }
        if (data.Data5.ErrorMessage == "该手机号已注册"){
          that.data.isRegist=true
          that.data.currentNum = that.data.currentUser.mobile
        }
        wx.showToast({
          icon: 'none',
          title: data.Data5.ErrorMessage
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '发送成功！',
        })
        that.getCode();
        that.setData({
          disabled: true
        })
      }
    })
  },
  bindData: function (e) {
    var id = e.currentTarget.id
    this.data.currentUser[id] = e.detail.value
  },
})