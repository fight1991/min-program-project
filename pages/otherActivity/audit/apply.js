var app = getApp()
import WxValidate from '../../../utils/WxValidate'
var that
var list = []
Page({
  data: {
    obj: {
      mobile: ''
    },
    activityId: '20190228',
    order_no: '',
    code_tips: "获取验证码",
    enable: true,
    currProvince: '',
    currCity: '',
    cityName2: []
  },
  onLoad: function(options) {
    that = this
    that.setData({
      activityModel: JSON.parse(options.activityModel),
      activityId: JSON.parse(options.activityModel).activityId
    })
    wx.setNavigationBarTitle({
      title: that.data.activityModel.name,
    })
    this.initValidate()
    app.platformApi.dictionary("/dictionary/getArea", {
      codeId: "0",
      type: '0'
    }, function(data) {
      var cityName = []
      data.result.forEach(function(value) {
        cityName.push(value.cityName)
      })
      wx.hideLoading()
      that.setData({
        cityName1: cityName,
        provinces: data.result
      })
    })
  },
  onShow: function() {

  },
  getCode: function() {
    var that = this
    if (!that.data.enable) {
      return
    }
    if (typeof that.data.obj.mobile == 'undefind' || that.data.obj.mobile.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写手机号',
      })
    } else if (/^1[3456789]\d{9}$/.test(that.data.obj.mobile.trim())) {
      app.platformApi.commonApi("/login/getValidateCode", {
        mobile: that.data.obj.mobile,
        type: that.data.activityModel.saveValidateCode
      }, function(data) {
        if (data.code == "0000") {
          wx.showToast({
            icon: 'none',
            title: data.message,
          })
          that.setData({
            enable: false
          })
          var time = 60
          var intervalId = setInterval(function() {
            time = time - 1
            if (time == 0) {
              clearInterval(intervalId)
              that.setData({
                code_tips: "重新获取"
              })
              that.setData({
                enable: true
              })
            } else {
              that.setData({
                code_tips: time + "秒"
              })
            }
          }, 1000)
        } else {
          wx.showToast({
            icon: 'none',
            title: data.message,
          })
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '手机号格式不正确',
      })
    }
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      userName: {
        required: true,
      },
      mobile: {
        required: true,
        tel: true
      },
      code: {
        required: true,
        minlength: 4
      },
      corpName: {
        required: true,
      },
      // corpEmail: {
      //   required: true,
      //   email: true,
      // },
      // position: {
      //   required: true,
      // },
    }
    const messages = {
      userName: {
        required: "姓名不为空",
      },
      mobile: {
        required: "手机号不为空",
      },
      code: {
        required: "验证码不为空",
        minlength: "请输入4位验证码"
      },
      corpName: {
        required: "企业名称不为空",
      },
      // corpEmail: {
      //   required: "企业邮箱不为空",
      // },
      // position: {
      //   required: "职位不为空",
      // },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
      duration: 1000
    })
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.obj[id] = e.detail.value
  },
  confirm: function(e) {
    that = this
    that.data.obj.addressProvince = that.data.currProvince.toString()
    that.data.obj.addressCity = that.data.currCity.toString()
    that.data.obj.activityId = that.data.activityId
    that.data.obj.payNumber = that.data.order_no
    that.data.obj.payType = 'WX'
    wx.showLoading({
      title: '提交中...',
    })
    app.platformApi.activity("/activity/saveActivityActor", that.data.obj, function(result) {
      wx.hideLoading()
      if (result.code == '0000') {
        wx.navigateTo({
          url: 'finish?activityModel=' + JSON.stringify(that.data.activityModel),
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })
  },
  bindPickerChange(e) {
    that = this
    this.setData({
      index1: e.detail.value,
      currProvince: that.data.provinces[e.detail.value].codeId,
      currCity: ''
    })
    app.platformApi.dictionary("/dictionary/getArea", {
      codeId: that.data.currProvince,
      type: '2'
    }, function(data) {
      var cityName = []
      data.result.forEach(function(value) {
        cityName.push(value.cityName)
      })
      wx.hideLoading()
      that.setData({
        cityName2: cityName,
        city: data.result,
        index2: 0,
        currCity: data.result[0].codeId
      })
    })

  },
  bindPickerChange4City(e) {
    that = this
    this.setData({
      index2: e.detail.value,
      currCity: that.data.city[e.detail.value].codeId
    })
  },
  submit: function(e) {
    that = this
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    app.platformApi.activity("/activity/checkSubmit", {
      code: that.data.obj.code,
      mobile: that.data.obj.mobile,
      activityId: that.data.activityId
    }, function(data) {
      if (data.code == '0000') {
        if (that.data.activityModel.price>0) {
          that.prePay(e)
        } else {
          that.confirm(e)
        }
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  prePay: function(e) {
    var that = this
    wx.showLoading({
      title: '等待中...',
    })
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
              wx.hideLoading()
              console.log(data)
              data = data.data
              if (data.Code == "0000") {
                that.pay(data.Data, e)
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
  pay: function(data, e) {
    var that = this
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
          that.confirm(e)
        } else {
          console.log("...........支付失败...........");
          console.log(res)
        }
      }
    })
  },
})