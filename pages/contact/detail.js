var app = getApp()
Page({
  data: {
    isShow: false
  },
  onLoad: function(options) {
    var userId = options.userId
    this.getUser(userId)
  },
  getUser: function(userId) {
    console.log(11111)
    var that = this
    app.platformApi.commonApi("/user/getUserDetail", {
      "userId": userId,
      "userName": ""
    }, function(data) {
      if (data.code == "0000") {
        if (data.result.length > 0) {
          that.setData({
            user: data.result[0]
          })
        } else {
          wx.showToast({
            icon: "none",
            title: "查无数据",
            duration: 2000
          })
          that.goBack()
        }
      } else {
        wx.showToast({
          icon: "none",
          title: data.message,
          duration: 2000
        })
        that.goBack()
      }
      console.log(data)
    })
  },
  showAddress: function(e) {
    console.log(e)
    var userId = e.currentTarget.dataset.userid
    var corpId = e.currentTarget.dataset.corpid;
    var corpName = e.currentTarget.dataset.corpname;
    wx.navigateTo({
      url: 'contact-address?userId=' + userId + '&corpId=' + corpId + '&corpName=' + corpName,
    })
  },

  deleteContact: function() {
    var id = this.data.user.userId
    var that = this
    wx.showModal({
      title: '删除确认',
      content: '您确认要删除好友【' + that.data.user.userName + '】吗？',
      success: function(res) {
        if (res.confirm) {
          app.platformApi.commonApi("/user/deleteUserContact", {
            userId: id,
            userName: ""
          }, function(data) {
            if (data.code == "0000") {
              wx.showToast({
                icon: "none",
                title: '删除成功'
              })
            } else {
              wx.showToast({
                icon: "none",
                title: data.message
              })
            }
            that.goBack()
          })
        }
      }
    })

  },
  goBack: function() {
    setTimeout(function() {
      wx.navigateBack()
    }, 2000)
  },
})