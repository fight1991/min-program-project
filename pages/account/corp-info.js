var app = getApp()
Page({
  data: {

    auditStatus: '未知'
  },
  onLoad: function(options) {
    var corp = JSON.parse(wx.getStorageSync("edit_corp_info"))
    this.setData({
      corp: corp
    }) 
    switch (corp.auditStatus) {
      case "00":
        this.setData({
          auditStatus: '未认证'
        })
        break;
      case "01":
        this.setData({
          auditStatus: '待认证'
        })
        break;
      case "02":
        this.setData({
          auditStatus: '已认证'
        })
        break;
      case "03":
        this.setData({
          auditStatus: '冻结停用'
        })
        break;
      default:
        break
    }
    console.log(corp)
  },
  setUserDefaultCorp: function(e) {
    var that = this
    if (e.detail.value) {
      this.data.corp.defaultCorp = '1'
    } else {
      this.data.corp.defaultCorp = '0'
    }
    this.setData({
      corp: this.data.corp
    })
    console.log(this.data.corp)
    app.platformApi.commonApi("/user/setUserDefaultCorp", {
        corpId: that.data.corp.corpId,
        isDefault: that.data.corp.defaultCorp,
        userId: that.data.corp.userId
      },
      function(data) {
        if (data.code == "0000") {
          wx.showToast({
            icon: "none",
            title: "设置成功",
            duration: 2000
          })
        } else {
          wx.showToast({
            icon: "none",
            title: data.message,
            duration: 2000
          })
        }
      })
  },
  deleteCorp: function(e) {
    var that = this
    wx.showModal({
      title: '解绑确认',
      content: '您确认要绑定吗？',
      success: function(res) {
        if (res.confirm) {
          that.unbindCorp()
        }
      }
    })
  },
  unbindCorp: function() {
    var that = this
    app.platformApi.commonApi("/user/userUnbindCorp", {
        corpId: that.data.corp.corpId
      },
      function(data) {
        if (data.code == "0000") {
          wx.showToast({
            icon: "none",
            title: "解除成功",
            duration: 2000
          })
          wx.navigateBack()
        } else {
          wx.showToast({
            icon: "none",
            title: data.message,
            duration: 2000
          })
        }
      })
  }
})