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
    currCountry:'',
    currCity: '',
    mobileZone:'',//电话前缀
    cityName2: [],
    currQuhao:'',
    countryname: [], 
    provinceName:[],
  },
  onLoad: function(options) {
    let that = this
    // 如果是从地区列表跳转过来的,读取本地信息
    let temp = wx.getStorageSync('formData')
    if (options.mobileZone && temp) {
      // 读取本地信息
      this.setData({
        obj: JSON.parse(temp)
      })
    }
    
    that.setData({
      activityModel: JSON.parse(options.activityModel),
      activityId: JSON.parse(options.activityModel).activityId,
      mobileZone: options.mobileZone ? options.mobileZone:'86'
    })
    wx.setNavigationBarTitle({
      title: that.data.activityModel.name,
    })
    this.initValidate()
    app.platformApi.dictionary("/dictionary/cascadeGetArea", {
      codeId: "0",
      type: '0'
    }, function(data) {
      var countryName = []
      that.setData({
        allcountry: data.result,
        index1: 0
      })
      that.bindPickerChange({ detail: { value: 0 } })
      data.result.forEach(function(value) {
        countryName.push(value.name)
        if (value.code == options.code){
          that.setData({
            index1: data.result.indexOf(value)
          })
          that.bindPickerChange({ detail: { value: data.result.indexOf(value) } })
        }
      })
      wx.hideLoading()
      that.setData({
        countryname: countryName
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
    // if (typeof that.data.obj.mobile == 'undefind' || that.data.obj.mobile.trim() == '') {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '请填写手机号',
    //   })
    // } else 
    if (that.data.obj.mobile.trim().length>0) {
      app.platformApi.commonApi("/login/getValidateCode", {
        mobile: that.data.obj.mobile,
        type: that.data.activityModel.saveValidateCode,
        mobileZone: that.data.mobileZone
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
        title: '请输入手机号码',
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
        digits: true
        // tel: true
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
        required: "手机号不为空"
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
    that.data.obj.country = that.data.currCountry,
    that.data.obj.mobileZone = that.data.mobileZone
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
  getAllQuhao(code){
    app.platformApi.dictionary("/dictionary/getAreaGroup", {
    }, function (data) {
      let quhao = []
      data.result.forEach(function (value) {
        quhao = [quhao, ...value.uniqueCountry]
      })
      wx.hideLoading()
      that.setData({
        allQuhaos: quhao
      })
    })
  },
  bindPickerChangeP(e) {
    that = this
    this.setData({
      index2: e.detail.value,
      currProvince: that.data.provinces[e.detail.value].code
    })
    app.platformApi.dictionary("/dictionary/cascadeGetArea", {
      code: that.data.provinces[e.detail.value].code,
      type: '2'
    }, function (data) {
      var CityName = []
      data.result.forEach(function (value) {
        CityName.push(value.name)
      })
      wx.hideLoading()
      that.setData({
        cityName2: CityName,
        citys: data.result,
        index3: 0,
        currCity: data.result[0].codeId || ''
      })
    })

  },
  bindPickerChange(e) {
    that = this
    this.setData({
      index1: e.detail.value,
      currCountry: that.data.allcountry[e.detail.value].code,
      currProvince: '',
      index2:'',
      index3: '',
      currCity: '',
      cityName2:[],
      provinceName:[],
      provinces:[]
    })
    app.platformApi.dictionary("/dictionary/cascadeGetArea", {
      code: that.data.currCountry,
      type: '1'
    }, function (data) {
      var ProvinceName = []
      data.result.forEach(function (value) {
        ProvinceName.push(value.name)
      })
        that.setData({
          provinceName: ProvinceName,
          provinces: data.result,
          currCity: ''
        })
      
      wx.hideLoading()
    })

  },
  getQuhao(){
    wx.redirectTo({
      url: '../areaDetail/areaDetail?activityModel=' + JSON.stringify(this.data.activityModel),
    })
    let formData = JSON.stringify(this.data.obj)
    // 保存表单信息
    wx.setStorageSync('formData', formData)
  },
  bindPickerChange4City(e) {
    that = this
    this.setData({
      index3: e.detail.value,
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
      activityId: that.data.activityId,
      mobileZone: that.data.mobileZone
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