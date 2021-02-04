import WxValidate from '../../utils/WxValidate'
var app = getApp()
Page({
  data: {
    currentUser: {},
    bindSource: [],
    ischange: false,
    corpInfos: [],
    corpInfo: {
      corpId: '',
      corpName: ''
    }
  },
  onLoad: function(options) {
    console.log(options)
    var that = this
    this.initValidate()
    that.setData({
      currentUser: {
        mobile: options.mobile,
        password: options.password,
        user_id: options.mobile, //账号默认注册手机号
        email_address: '',
        note: ''
      }
    })
    this.getCorpInfos()
  },
  itemtap: function(e) {
    var corpId = e.target.id
    this.data.currentUser.note = e.currentTarget.dataset.corpname
    this.data.corpInfo = {
      corpId: e.target.id,
      corpName: e.currentTarget.dataset.corpname
    }
    this.setData({
      bindSource: [],
      currentUser: this.data.currentUser
    })
  },
  closeSelect: function() {
    this.setData({
      bindSource: []
    })
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.currentUser[id] = e.detail.value
  },

  bindDataAndFilter: function(e) {
    var id = e.currentTarget.id
    this.data.currentUser[id] = e.detail.value
    var prefix = e.detail.value
    var newSource = []
    if (prefix != "") {
      this.data.corpInfos.forEach(function(ss) {
        if (ss != null && ss.corpName != null && ss.corpName.indexOf(prefix) != -1) {
          newSource.push(ss)
        }
      })
    }
    if (newSource.length != 0) {
      this.setData({
        bindSource: newSource
      })
    } else {
      this.setData({
        bindSource: []
      })
    }
  },
  closeSelect: function() {
    this.setData({
      bindSource: []
    })
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      user_name: {
        required: true,
      }
      // note: {
      //   required: true,
      // },
    }
    const messages = {
      user_name: {
        required: '【真实姓名】不能为空',
      }
      // note: {
      //   required: '【公司全称】不能为空',
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
  switchChange: function(e) {
    this.setData({
      ischange: e.detail.value
    })
  },
  nextstep: function(e) {
    var that = this
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      console.log(that.data.currentUser)
      app.httpUtils.post('Register', that.data.currentUser, function(data) {
        if (data.Success) {
          wx.showToast({
            icon: 'success',
            title: '注册成功'
          })
          wx.reLaunch({
            url: '../../pages/index/index'
          })
        } else {
          wx.showToast({
            title: data.ErrorMessage,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  getCorpInfos: function() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    app.platformApi.commonApi("/corp/getCorpByCondAssignProp", {
      "corpName": "",
      "sccCode": "",
      "cusCorpName":"",
      "returnProps": [
        "corpId", "corpName"
      ],
      "tradeCode": ""
    }, function(data) {
      wx.hideLoading()
      console.log(data)
      if (data.code == "0000") {
        that.setData({
          corpInfos: data.result
        })
      }
    })
  }
})