var app = getApp()
Page({
  data: {
    titles: ["账户名", "邮 箱", "域 名", "工 厂"],
    titless: {},
    site: "",
    userInfo: {},
    currentUser: {},
    isAlter: false
  },
  onLoad: function (options) {
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    app.authorize()
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo,
        theme: userInfo.theme
      })
    })
    app.getWechatUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })
  },
  alter: function () {
    var that = this
    that.setData({
      isAlter: true

    })
  },
  bindData: function (e) {
    var id = e.currentTarget.id
    this.data.currentUser[id] = e.detail.value
  },
  update: function () {

    var that = this
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    that.data.currentUser.type = '01'
    if (reg.test(that.data.currentUser.email)) {
      wx.showLoading({
        title: '更新中...',
      })
      app.httpUtils.post('User', that.data.currentUser, function (data) {
        wx.hideLoading()
        if (data.Success) {
          app.setUserInfo(that.data.currentUser)
          that.setData({
            isAlter: false
          })
          wx.showToast({
            title: '修改成功',
          })
          that.onLoad()
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none',
          })
        }
      })
    }else{
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none',
      })
    }
  },
  updatebk:function(){
    var that=this
    that.setData({
      isAlter: false
    })
  }
})