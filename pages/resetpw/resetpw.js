import WxValidate from '../../utils/WxValidate'
const app = getApp()
var interval = null //倒计时函数
Page({
  data: {
    currentUser: {},
    date: '请选择日期',
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 60,
  },
  onLoad: function(options) {
    console.log(options)
    this.initValidate()
  },
  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: that.data.currentTime,
          disabled: false
        })
      }
    }, 1800)
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
      password: {
        required: true,
        pw: true
      },
      passworded: {
        required: true,
        equalTo: 'password',
        pw: true
      },
    }
    const messages = {
      mobile: {
        required: "手机号码不为空",
      },
      verificationcode: {
        required: "验证码不为空",
      },
      password: {
        required: "密码不为空",
        pw: '请输入6-8位数字或字母的密码'
      },
      passworded: {
        required: '确认密码不为空',
        equalTo: "密码不一致",
        pw: '请输入6-8位数字或字母的密码'
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  getVerificationCode() {
    var that = this
    wx.showLoading({})
    app.httpUtils.get('Register', {
      mobile: that.data.currentUser.mobile,
      sms_type: '003'
    }, function(data) {
      if (!data.Data5.Success) {
        if (data.Data5.ErrorMessage == "触发分钟级流控Permits:1") {
          data.Data5.ErrorMessage = "验证码获取频繁，请稍候再试"
        }
        wx.showToast({
          icon: 'none',
          title: data.Data5.ErrorMessage
        })
        that.setData({
          currentTime: 0
        })
        that.getCode();
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '发送成功！',
        })
        that.setData({
          currentTime: 60
        })
        that.getCode();
        that.setData({
          disabled: true
        })
      }
    })
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.currentUser[id] = e.detail.value
  },
  reset: function(e) {
    var that = this
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      console.log(this.data.currentUser)
      this.data.currentUser.username = ''
      app.httpUtils.post('User', this.data.currentUser, function(data) {
        if (data.Success) {
          wx.showToast({
            title: '重置成功！',
          })
          wx.redirectTo({
            url: '../../pages/accountBind/accountBind',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: data.ErrorMessage,
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
})