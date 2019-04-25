var app = getApp()
Page({
  data: {
    userId: '',
    contact: '',
    userModel: {},
    showflag: '',
    isFromContact: false
  },
  onLoad: function(options) {
    var that = this
    this.data.userId = options.userId
    if (typeof options.isFromContact != 'undefind') {
      that.data.isFromContact = options.isFromContact
    }
    app.getUserInfo(function(userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    wx.showLoading({
      title: '加载中...',
    })
    app.platformApi.commonApi("/user/getUserDetail", {
      userId: this.data.userId
    }, function(data) {
      wx.hideLoading()
      if (data.code == '0000') {
        that.setData({
          userModel: data.result[0]
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: data.message,
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      }
    })
  },

  radioChange: function(e) {
    var that = this
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    that.data.contact = e.detail.value
  },
  comfirm: function() {
    var that = this
    var contact = that.data.contact
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]
    let prevprevPage = pages[pages.length - 3]
    if (that.data.isFromContact) {
      prevprevPage.setData({
        isFromContact: true,
        address: that.data.contact,
        contactModel: {
          name: that.data.userModel.userName,
          mobile: that.data.userModel.mobile,
          userId: that.data.userModel.userId,
        }
      })
      wx.navigateBack({
        delta: 2
      })
    } else {
      prevPage.setData({
        addressModel: {
          city: contact.substring(0, contact.indexOf('-')),
          address: contact.substring(contact.indexOf('-') + 1)
        },
      })
      wx.navigateBack({
        delta: 1
      })
    }
  }
})