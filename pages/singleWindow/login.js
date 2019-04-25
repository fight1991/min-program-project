import WxValidate from '../../utils/WxValidate'
const app = getApp()
Page({
  data: {  
    singleAccount: { is_bind:true},
    isLoading:true
  },
  onLoad: function (options) { 
    this.initValidate()
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo
      })  
      that.autoLogin(userInfo.userName)
    }) 
  },
  onShow:function(){  
    if (this.data.is_back) { 
      wx.navigateBack()
    }
  },
  autoLogin: function (userName){
    var that =this
    app.httpUtils.post('SWInfo', {user_id:userName,op:"01"}, function (data) {
      if (data.Success) {
        wx.navigateTo({
          url: 'menu'
        })
      } else {
        that.setData({ isLoading:false})
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
        title: '登录中...',
      })
      app.httpUtils.post('SWInfo', this.data.singleAccount, function (data) {
        wx.hideLoading()
        if (data.Success) { 
          wx.navigateTo({
            url: 'menu', 
          })
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
  },
  checkboxChange: function (e) {
    var that = this
    console.log(typeof e.detail.value[0])
    if (typeof e.detail.value[0] == 'undefined') { 
      this.data.singleAccount["is_bind"] = false
    }else{
      this.data.singleAccount["is_bind"] = true
    }
    console.log(this.data.singleAccount["is_bind"])
  }
})