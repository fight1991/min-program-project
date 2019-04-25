var app = getApp()
Page({
  data: {
    defCorp:{
      corpId:''
    }
  },
  onLoad: function(options) {
  },
  onShow:function(){
    this.getInfo()
  },
  edit: function() {
    wx.navigateTo({
      url: 'user-edit',
    })
  },
  addressMgr: function(e) {
    var corpId = e.currentTarget.dataset.corpid
    if (corpId == "-1") {
      wx.showToast({
        icon: "none",
        title: '请先维护企业信息'
      })
    } else {
      wx.navigateTo({
        url: 'address-mgr?corpId=' + corpId,
      })
    }
  },
  getInfo: function() {
    var that = this 
    app.platformApi.commonApi("/user/getUserDefaultCorp", {}, function (data) {
      if (data.code == "0000") { 
        that.setData({
          defCorp: data.result
        })
      }  
    })
    app.platformApi.commonApi("/user/getUserDetail", {
      userId: "",
      userName: ""
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
  }
})