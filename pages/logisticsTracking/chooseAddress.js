var app = getApp()
import WxValidate from '../../utils/WxValidate'
Page({
  data: {
    userId: '',
    logData4Address: [],
    addressModel: {
      city: '',
      address: ''
    },
    type: ''
  },
  onLoad: function(options) {
    var that = this
    this.initValidate()
    that.data.type = options.type
    that.data.userId = options.userId
    if (options.type == '1') {
      that.setData({
        addressModel: {
          city: options.city1,
          address: options.address1
        }
      })
    } else {
      that.setData({
        addressModel: {
          city: options.city2,
          address: options.address2
        }
      })
    }
    that.setData({
      logData4Address: wx.getStorageSync('logData4Address')
    })
  },
  empty: function() {
    wx.removeStorageSync('logData4Address')
    this.setData({
      logData4Address: []
    })
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.addressModel[id] = e.detail.value
  },
  selected: function(e) {
    var that = this
    var contact = this.data.logData4Address[e.currentTarget.dataset.index]

    var city = contact.substring(0, contact.indexOf('-'))
    var address = contact.substring(contact.indexOf('-') + 1)

    this.setData({
      addressModel: {
        city: city,
        address: address
      }
    })
  },
  confirm: function(e) {
    var that = this
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      var type = that.data.type
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]
      var reqData = prevPage.data.reqData
      var city1 = prevPage.data.city1
      var city2 = prevPage.data.city2
      var address1 = prevPage.data.address1
      var address2 = prevPage.data.address2
      var logData4Address = []
      if (that.data.logData4Address.length != 0) {
        logData4Address = that.data.logData4Address
      }
      if (type == '1') {
        reqData.overseasAddr = that.data.addressModel.city + that.data.addressModel.address
        city1 = that.data.addressModel.city
        address1 = that.data.addressModel.address
      } else if (type == '2') {
        reqData.domesticAddr = that.data.addressModel.city + that.data.addressModel.address
        city2 = that.data.addressModel.city
        address2 = that.data.addressModel.address
      }
      var isExist = false
      var logData4AddressValue = that.data.addressModel.city + '-' + that.data.addressModel.address
      logData4Address.forEach(function(val, index) {
        if (val == logData4AddressValue) {
          isExist = true
        }
      })
      if (!isExist) {
        logData4Address.push(logData4AddressValue)
      }
      wx.setStorageSync('logData4Address', logData4Address)
      prevPage.setData({
        reqData: reqData,
        city1: city1,
        address1: address1,
        city2: city2,
        address2: address2,
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      city: {
        required: true,
      },
      address: {
        required: true,
      },
    }
    const messages = {
      city: {
        required: "城市不为空",
      },
      address: {
        required: "地址不为空",
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
  showAddressList: function() {
    wx.navigateTo({
      url: '../../pages/account/address-select?userId=' + this.data.userId,
    })
  },
  showAddress: function() {
    var that = this
    wx.navigateTo({
      url: 'country?type=' + that.data.type,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})