var app = getApp()
import WxValidate from '../../../utils/WxValidate'
var that
var list = []
Page({

  data: {
    obj: {
      mobile: ''
    },
    activityId: '20190228',
    code_tips: "获取验证码",
    enable: true,
  },

  onLoad: function(options) {
    that = this
    that.setData({
      activityModel: JSON.parse(options.activityModel),
      activityId: JSON.parse(options.activityModel).activityId
    })
    this.initValidate()
  },

  initValidate() {
    // 验证字段的规则
    const rules = {
      mobile: {
        required: true,
        tel: true
      },
      code: {
        required: true,
      }
    }
    const messages = {
      mobile: {
        required: "手机号不为空",
      },
      code: {
        required: "验证码不为空",
      }
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
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.obj[id] = e.detail.value
  },
  getCode: function() {
    var that = this
    if (!that.data.enable) {
      return
    }
    if (typeof that.data.obj.mobile == 'undefind' || that.data.obj.mobile.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写手机号',
      })
    } else if (/^1[3456789]\d{9}$/.test(that.data.obj.mobile.trim())) {
      wx.showLoading({
        title: '获取验证码中...',
      })
      app.platformApi.commonApi("/login/getValidateCode", {
        mobile: that.data.obj.mobile,
        type: that.data.activityModel.paybackValidateCode
      }, function(data) {
        console.log(data)
        if (data.code == "0000") {
          wx.showToast({
            icon: 'none',
            title: data.message,
          })
          that.setData({
            enable: false
          })
          var time = 60
          var intervalId = setInterval(function() {
            time = time - 1
            if (time == 0) {
              clearInterval(intervalId)
              that.setData({
                code_tips: "重新获取"
              })
              that.setData({
                enable: true
              })
            } else {
              that.setData({
                code_tips: time + "秒"
              })
            }
          }, 1000)
        } else {
          wx.showToast({
            icon: 'none',
            title: data.message,
          })
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '手机号格式不正确',
      })
    }
  },
  confirm: function(e) {
    that = this
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    that.data.obj.activityId = that.data.activityId
    wx.showLoading({
      title: '退款中...',
    })
    app.platformApi.activity("/activity/checkRefund", that.data.obj, function(data) {
      if (data.code == '0000') {
        app.platformApi.activity("/activity/refunded", {
          'mobile': that.data.obj.mobile,
          'activityId': that.data.obj.activityId
        }, function(res) {
          wx.hideLoading()
          if (res.code == '0000') {
            wx.showToast({
              title: res.message
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1,
              })
            }, 1500)
          } else {
            wx.showModal({
              title: '提示',
              content: res.message,
              showCancel: false,
              cancelText: '',
              cancelColor: '',
              confirmText: '确定',
              confirmColor: '',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }

        })
      } else {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: data.message,
          showCancel: false,
          cancelText: '',
          cancelColor: '',
          confirmText: '确定',
          confirmColor: '',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  }
})