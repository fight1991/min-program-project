var app = getApp()
Page({
  data: {
    titles: ["您的资料正在审核中", "只有通过审核的账户才可以访问该小程序", "如需帮助请联系相关工作人员", "联系客服", "关于我们"],
    titless: {},
  },
  aboutUs: function () {
    wx.navigateTo({
      url: '../../pages/abountUs/abountUs',
    })
  },
  onLoad: function () {
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  contactUs: function () {
    wx.showModal({
      content: app.translater('客户热线') + '：400-928-2077',
      confirmText: '拨打',
      success: function (res) {
        if (res.confirm) {
          app.utils.phoneCall("400-928-2077")
        }
      }
    })
  }
})