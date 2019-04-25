import WxValidate from '../../utils/WxValidate'
var app = getApp()
Page({
  data: {
    currentUser: {},
    isShow: true
  },
  onLoad: function (options) {
    this.initValidate()
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      USER_NAME: {
        required: true,
      },
      USER_MOBILE: {
        required: true,
        tel: true,

      },
      EMAIL_ADDRESS: {
        required: true,
        email: true,
      },
      COMPANY_NAME: {
        required: true,
      },
    }
    const messages = {
      USER_NAME: {
        required: '姓名不为空',
      },
      USER_MOBILE: {
        required: '手机号不为空',
      },
      EMAIL_ADDRESS: {
        required: '邮箱不为空',
      },
      COMPANY_NAME: {
        required: '公司全称不为空',
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
  signUp: function (e) {
    var that = this
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      var that = this
      app.httpUtils.post('Sign', that.data.currentUser, function (data) {
        if (data.Success) {
          that.setData({
            isShow: false
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: '已报名，请签到',
          })
        }
      })

    }
  },
  bindData: function (e) {
    var id = e.currentTarget.id
    this.data.currentUser[id] = e.detail.value
  },
  complete: function () {
    var that = this
    wx.login({
      success: function (res) {
        var data={}
        if (res.code) {
          wx.getUserInfo({
            success: function (r) {
              data.encryptedData = r.encryptedData
              data.iv = r.iv
              data.code = res.code
              data.user_id = that.data.currentUser.USER_MOBILE
              data.actionType='001'
              app.httpUtils.post('Sign', data, function (data){
                wx.reLaunch({
                  url: '/pages/accountBind/accountBind'
                })
              })
            }, fail: function (res) {
              console.log(res)
            }
          })
        } else {
          wx.showModal({
            title: '警告',
            content: '获取用户登录态失败！' + res.errMsg,
            success: function (res) {
              if (res.confirm) {
              }
            }
          })
        }
      }
    })
  }
})