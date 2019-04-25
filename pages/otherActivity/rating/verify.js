var app = getApp()
import WxValidate from '../../../utils/WxValidate'
Page({

  data: {
    obj: {
      mobile: ''
    },
    code_tips: "获取验证码",
    enable:true
  },

  onLoad: function(options) {
    var that = this
    var tmp = wx.getStorageSync("person_info")
    if (tmp) {
      try{
        that.setData({
          obj: JSON.parse(tmp)
        })
      }catch(e){ 
      } 
    }

    this.initValidate()
  },

  onReady: function() {

  },
  onShow: function() {
    var rateData = JSON.parse(wx.getStorageSync("rateData"))
    this.data.rateData = rateData
  },
  getCode: function() {
    var that = this
    if (!that.data.enable){
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
        type: "survey"
      }, function(data) {
        console.log(data)
        if (data.code == "0000") {
          wx.showToast({
            icon: 'none',
            title: data.message,
          })
          that.setData({
            enable:false
          })
          var time = 30
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
      name: {
        required: true,
      },
      mobile: {
        required: true,
        tel: true
      },
      code: {
        required: true,
      },
      companyName: {
        required: true,
      },
    }
    const messages = {
      name: {
        required: "姓名不为空",
      },
      mobile: {
        required: "手机号不为空",
      },
      code: {
        required: "验证码不为空",
      },
      companyName: {
        required: "企业名称不为空",
      },
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
    var that = this
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    wx.showLoading({
      title: '提交中...',
      icon: "none"
    })

    that.data.rateData.code = that.data.obj.code
    that.data.rateData.mobile = that.data.obj.mobile
    that.data.rateData.corpName = that.data.obj.companyName
    that.data.rateData.userName = that.data.obj.name
    that.data.rateData.openId = that.data.obj.mobile

    console.log(that.data.rateData)

    app.platformApi.commonApi("/customs-rate/saveSurvey", that.data.rateData, function(data) {
      console.log(data)
      setTimeout(function() {
        wx.hideLoading()
        if (data.code == "0000") {
          that.data.obj.code = ""
          wx.setStorageSync("person_info", JSON.stringify(that.data.obj))
          wx.reLaunch({
            url: 'finish'
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 3000
          })
        }
      }, 1000)
    })
  },
})