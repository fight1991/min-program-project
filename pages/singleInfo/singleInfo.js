import WxValidate from '../../utils/WxValidate' 
var app = getApp()
Page({
  data: {
    obj: {},
    singleAccount: { is_bind: true }
  },
  onLoad: function (options) {
    var that = this
    this.initData()
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme,
        currentUser: userInfo
      })
    })
    this.initValidate()
  },
  initData() {
    var that = this
    app.httpUtils.get('SWInfo', { user_id: app.globalData.cms_user.userName,op:"02" }, function (data) {
      if (data.Success) {
        if (data.Data5 == null) {
          that.setData({
            searchNone:true
          })
        } else {
          that.setData({
            searchNone: false,
            obj: data.Data5
          })
        }
      }
    })
   
  }, 
  unbind: function () {
    app.httpUtils.post('SWInfo', { user_id: app.globalData.cms_user.userName,op: "03" }, function (data) {
      if (data.Success) {
        wx.showToast({
          title: '解绑成功',
          icon: 'none',
          duration: 2000
        })
        wx.reLaunch({
          url: '../../pages/index/index'
        })
      } else {
        wx.showToast({
          title: '解绑失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  login: function (e) {
    var that = this
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      that.data.singleAccount['user_id'] = that.data.currentUser.userName
      that.data.singleAccount['op'] = '02'
      wx.showLoading({
        title: '验证中...',
      })
      app.httpUtils.post('SWInfo', this.data.singleAccount, function (data) {
        wx.hideLoading()
        if (data.Success) {
          that.initData() 
        } else {
          wx.showToast({
            title: data.ErrorMessage,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      sw_id: {
        required: true,
      },
      sw_password: {
        required: true,
      }
    }
    const messages = {
      sw_id: {
        required: "账号不为空",
      },
      sw_password: {
        required: "密码不为空",
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
  bindData: function (e) {
    console.log(e)
    var id = e.currentTarget.id
    this.data.singleAccount[id] = e.detail.value
  }
})