var app = getApp()
Page({
  data: {
    isFailure: false,
    flag: false,
    obj: {},
    logged: false,
    url: '/logistics/getLogisticsWithoutLogin'
  },
  onLoad: function(options) {
    var that = this
    that.setData({
      status: options.status
    })
    app.getUserInfo(function(userInfo) {
      that.setData({
        currentUser: userInfo
      })
    })
    var wait_time = 100
    if (options.hasOwnProperty("sence") == false) {
      wait_time = 5000
      app.init()
    }
    console.log(options)
    var logPid = options.logPid;
    this.data.logPid = logPid
    var roleList = []
    if (options.roleList) {
      roleList = options.roleList.split(',');
    }
    console.log(roleList)
    if (options.sence == 'notice') {
      this.data.flag = true
      this.data.url = '/logistics/getLogisticsByWeChat'
      that.setData({
        logged: true,
        sence: 'notice'
      })
    }
    if (options.sence == 'logged') {
      this.data.url = '/logistics/getLogisticsByWeChat'
      this.data.flag = true
      that.setData({
        logged: true,
        sence: 'logged'
      })
    }
    this.data.roleList = roleList
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function() {
      app.platformApi.logistics(that.data.url, {
        "logPid": that.data.logPid,
        "roleIdList": that.data.roleList,
      }, function(data) {
        wx.hideLoading()
        if (data.code == '0000') {
          if (that.data.url == '/logistics/getLogisticsWithoutLogin') {
            if (data.result.msgStatus == '8') {
              that.setData({
                status: '8'
              })
            }
          }
          if (data.result.trackingTime != null || data.result.trackingTime != '') {
            data.result.trackingTime = data.result.trackingTime.substring(0, data.result.trackingTime.lastIndexOf(':'))
          }
          data.result.T = data.result.overseasContact + ((data.result.overseasMobile == null || data.result.overseasMobile == '') ? '' : '/') + data.result.overseasMobile + ((data.result.overseasAddr == null || data.result.overseasAddr == '') ? '' : '/') + data.result.overseasAddr
          data.result.S = data.result.domesticContact + ((data.result.domesticMobile == null || data.result.domesticMobile == '') ? '' : '/') + data.result.domesticMobile + ((data.result.domesticAddr == null || data.result.domesticAddr == '') ? '' : '/') + data.result.domesticAddr
          that.setData({
            nodeList: data.result.nodeList,
            obj: data.result
          })
        }
      })
    }, wait_time)

  },
  onShow: function() {
    this.setData({
      isShowCount: 8
    })
  },
  reject: function() {
    if (this.data.flag) {
      app.platformApi.logistics("/logistics/refuseLogistics", {
        "logPid": this.data.logPid,
        "roleList": this.data.obj.roleList
      }, function(data) {
        if (data.code == '0000') {
          wx.navigateBack()
        } else {
          wx.showToast({
            title: '拒接失败',
            icon: "none"
          })
        }
      })
    } else {
      wx.setStorageSync("invitation", JSON.stringify({
        logPid: this.data.logPid,
        roleList: this.data.obj.roleList,
        reject: true
      }))
      wx.reLaunch({
        url: '/pages/accountBind/accountBind'
      })
    }
  },
  join: function() {
    var that = this
    if (this.data.flag) {
      app.platformApi.logistics("/logistics/takingLogistics", {
        logPid: this.data.logPid,
        roleList: this.data.obj.roleList
      }, function(data) {
        wx.setStorageSync('isFromInvitation', 'true')
        wx.setStorageSync('dataFromInvitation', JSON.stringify({
          logPid: that.data.logPid,
          roleList: that.data.obj.roleList
        }))
        if (data.code == '0000') {
          wx.showToast({
            title: '接单成功',
            "icon": "none"
          })
          if (data.result == "1") {
            wx.setStorageSync("invitation", JSON.stringify({
              logPid: that.data.logPid,
              roleList: that.data.obj.roleList
            }))
            wx.redirectTo({
              url: '/pages/invitation/assignRoles'
            })
          } else {
            wx.navigateBack()
          }
        } else {
          wx.showToast({
            title: data,
            "icon": "none"
          })
          wx.removeStorageSync("invitation")
        }
      })
    } else {
      wx.setStorageSync("invitation", JSON.stringify({
        logPid: this.data.logPid,
        roleList: this.data.obj.roleList,
        reject: false
      }))
      wx.reLaunch({
        url: '/pages/accountBind/accountBind'
      })
    }
  },
  callPhone: function(e) {
    app.utils.phoneCall(this.data.obj.mobileNo)
  },
  showMore: function() {
    this.setData({
      isShowCount: 15
    })
  },
  pickUp: function() {
    this.setData({
      isShowCount: 8
    })
  },
  autoLogin: function() {
    wx.setStorageSync("invitation", JSON.stringify({
      logPid: this.data.logPid,
      roleList: this.data.roleList,
      reject: false
    }))
    wx.reLaunch({
      url: '/pages/accountBind/accountBind'
    })
  },
  showImg: function(e) {
    var url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url,
      urls: this.data.obj.urls
    })
  },
  unlogged: function() {
    wx.reLaunch({
      url: '/pages/accountBind/accountBind'
    })
  }
})