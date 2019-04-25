var app = getApp()
Page({

  data: {
    order_no: '',
    activityId: '20190228',
    activityModel: {}
  },

  onLoad: function(options) {
    console.log('****************')
    console.log(options)
    console.log('****************')
    var that = this
    if (typeof options.scene != 'undefined' && options.scene != null) {
      this.data.activityId = options.scene
    }
    if (!app.platformApi.platformHost) {
      app.init(null, function() {
        that.getInfo()
      })
    }
    wx.showLoading({
      title: '加载中...',
    })

  },

  getInfo: function() {
    var that = this
    app.platformApi.activity("/activity-config/getActivityConfig", {
      'activityId': this.data.activityId
    }, function(result) {
      wx.hideLoading()
      result.result.activityStartTime = app.utils.dateTimeFormatter4TZ(result.result.activityStartTime).substring(0, 16)
      result.result.activityEndTime = app.utils.dateTimeFormatter4TZ(result.result.activityEndTime).substring(0, 16)
      that.setData({
        activityModel: result.result
      })
      wx.setNavigationBarTitle({
        title: result.result.name,
      })
    })
  },

  prePay: function() {
    var that = this
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            url: app.globalData.cms_user.host + '/api/UserService/PrePay',
            data: {
              code: res.code,
              activity_id: that.data.activityId,
              activity_name: that.data.activityModel.name,
              activity_fee: that.data.activityModel.price * 100,
            },
            success: function(data) {
              console.log(data)
              data = data.data
              if (data.Code == "0000") {
                that.pay(data.Data)
              } else {
                wx.showToast({
                  title: data.Message,
                  icon: ''
                })
              }
              console.log(data)
            },
            method: "POST"
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  pay: function(data) {

    this.data.order_no = data["order_no"]

    wx.requestPayment({
      'timeStamp': data["timeStamp"],
      'nonceStr': data["nonce_str"],
      'package': data['package'],
      'signType': 'MD5',
      'paySign': data["paySign"],
      'success': function(res) {
        console.log("...........success...........");
        console.log(res)
      },
      'fail': function(res) {
        console.log("...........fail...........");
        console.log(res)
      },
      'complete': function(res) {
        if (res.errMsg == "requestPayment:ok") {
          console.log("...........支付成功...........");
          console.log(res)
        } else {
          console.log("...........支付失败...........");
          console.log(res)
        }
      }
    })
  },
  apply: function() {
    var that = this
    wx.navigateTo({
      url: 'apply?activityModel=' + JSON.stringify(that.data.activityModel),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  refund: function() {
    var that = this
    wx.navigateTo({
      url: 'refund?activityModel=' + JSON.stringify(that.data.activityModel),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})