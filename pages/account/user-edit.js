var app = getApp()
Page({
  data: {
    postData: {},
    user: {}
  },
  onLoad: function(options) {
    this.data.site = app.globalData.cms_user.site
    this.setData({
      site: app.globalData.cms_user.site
    })
    console.log(this.data.site)
    
    this.myDialog = this.selectComponent("#myDialog")
  },
  onShow:function(){
    this.getInfo()
  },
  bindData: function(e) {
    var key = e.currentTarget.id
    this.data.postData[key] = e.detail.value
  },
  getInfo: function() {
    var that = this
    app.platformApi.commonApi("/user/getUserDetail", {
      userId: "",
      userName: ''
    }, function(data) {
      if (data.code == "0000") {
        if (data.result.length > 0) {
          that.data.postData["userName"] = data.result[0]["userName"]
          that.data.postData["emailAddress"] = data.result[0]["emailAddress"]
          that.setData({
            user: data.result[0]
          })
          that.getCorps()
        } else {
          wx.showToast({
            icon: "none",
            title: "查无数据",
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          icon: "none",
          title: data.message,
          duration: 2000
        })
      }
      console.log(data)
    })
  },
  getCorps: function() {
    var that = this
    app.platformApi.commonApi("/user/queryUserCorps", {
      corpStatusList: [],
      corpTypes: []
    }, function(data) {
      if (data.code == "0000") {
        if (data.result.length > 0) {
          console.log(data.result)
          var temp = that.data.user
          temp.corps = data.result
          that.setData({
            user: temp
          })
        }
      } else {
        wx.showToast({
          icon: "none",
          title: data.message,
          duration: 2000
        })
      }
      console.log(data)
    })
  },
  updateUser: function() {
    var that = this
    if (that.data.postData.userName.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '姓名不能为空',
      })
      return
    }
    if (that.data.postData.emailAddress.trim() != '') {
      if (!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(that.data.postData.emailAddress))) {
        wx.showToast({
          icon: 'none',
          title: '邮箱格式不正确',
        })
        return
      }
    }
    app.platformApi.commonApi("/user/updateUserInfo", that.data.postData, function(data) {
      if (data.code == "0000") {
        wx.showToast({
          icon: "none",
          title: "更新成功",
          duration: 1000
        })
        app.globalData.cms_user.email = that.data.postData.emailAddress
        setTimeout(function(){
          wx.navigateBack()
        },1000)
      } else {
        wx.showToast({
          icon: "none",
          title: data.message,
          duration: 2000
        })
      }
      console.log(data)
    })
  },
  addCorp: function(e) {
    wx.navigateTo({
      url: 'corp-add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  colseDialog: function() {
    this.myDialog.hide()
  },
  showDialog: function() {
    this.myDialog.clear()
    this.myDialog.show()
  },
  showCorp:function(e){
    var that = this
    var corpId = e.currentTarget.dataset.corpid
    this.data.user.corps.forEach(function(m){
      if (m.corpId == corpId){
        m.userId = that.data.user.userId
        wx.setStorageSync("edit_corp_info", JSON.stringify(m))
      }
    })
    wx.navigateTo({
      url: "corp-info"
    })
  }
})