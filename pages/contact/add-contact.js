var app = getApp()
Page({
  data: {
    users: [],
    orgUsers: [],
    userId: []
  },
  onLoad: function(options) {
    var that = this
    this.getNewContact()
  },
  getNewContact: function() {
    var that = this
    var userId = []
    app.platformApi.commonApi("/user/getNewContacts", {}, function(data) {
      if (data.code == "0000") {
        if (data.result.length > 0) {
          data.result.forEach(function(val, index) {
            userId.push(val.userId)
            if (index == data.result.length - 1) {
              app.platformApi.commonApi("/user/updateContactApplyReadState", userId, function(data) {
              })
            }
          })
        }
        that.setData({
          users: data.result,
          orgUsers: data.result
        })
      } else {
        wx.showToast({
          icon: "none",
          title: data.message
        })
      }
      console.log(data)
    })
  },
  search: function(e) {
    var key = e.detail.value.trim()
    var tmp = []
    if (key.length == 0) {
      tmp = this.data.orgUsers
    } else {
      this.data.orgUsers.forEach(function(v) {
        if (v.userName.indexOf(key) > -1) {
          tmp.push(v)
        }
      })
    }
    this.setData({
      "users": tmp
    })
  },
  operateOnContacts: function(e) {
    var that = this
    var userId = e.currentTarget.dataset.id
    var operation = e.currentTarget.dataset.type
    app.platformApi.commonApi("/user/operateOnContacts", {
      "operation": operation,
      "userId": userId
    }, function(data) {
      if (data.code == "0000") {
        wx.showToast({
          icon: "none",
          title: '操作完成'
        })
        that.getNewContact()
      } else {
        wx.showToast({
          icon: "none",
          title: data.message
        })
      }
      console.log(data)
    })
  }
})