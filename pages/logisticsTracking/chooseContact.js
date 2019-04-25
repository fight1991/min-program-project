var app = getApp()
import WxValidate from '../../utils/WxValidate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logData4Contacts: [],
    logDataFromContacts: [],
    contactModel: {
      name: '',
      mobile: '',
    },
    address: '',
    type: '',
    index: '',
    isFromContact: false,
    isFromParties: false,
    overseasId: '',
    domesticId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (typeof options.name != 'undefined') {
      that.setData({
        contactModel: {
          name: options.name,
          mobile: options.mobile,
        }
      })
    }
    if (typeof options.isFromParties != 'undefined') {
      that.data.isFromParties = true
    }
    this.initValidate()
    that.data.type = options.type
    that.setData({
      logData4Contacts: wx.getStorageSync('logData4Contacts'),
      logDataFromContacts: wx.getStorageSync('logDataFromContacts'),
      isFromParties: that.data.isFromParties
    })
    if (that.data.type == '5') {
      that.data.index = options.index
    }
  },

  empty: function() {
    if (this.data.isFromParties) {
      wx.removeStorageSync('logDataFromContacts')
      this.setData({
        logDataFromContacts: []
      })
    } else {
      wx.removeStorageSync('logData4Contacts')
      this.setData({
        logData4Contacts: []
      })
    }
  },
  selected: function(e) {
    var that = this

    var contact
    if (this.data.isFromParties) {
      contact = this.data.logDataFromContacts[e.currentTarget.dataset.index]
    } else {
      contact = this.data.logData4Contacts[e.currentTarget.dataset.index]
    }
    var name = contact.substring(0, contact.indexOf('('))
    var mobile = contact.substring(contact.indexOf('(') + 1, contact.indexOf(')'))
    this.setData({
      contactModel: {
        name: name,
        mobile: mobile
      }
    })
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.contactModel[id] = e.detail.value
  },
  confirm: function(e) {
    var that = this
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      if (!/^[0-9-]*$/.test(that.data.contactModel.mobile)) {
      wx.showToast({
        icon: 'none',
        title: '联系方式格式不正确',
      })
      return
    }
    var type = that.data.type
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]
    var reqData = prevPage.data.reqData
    var role = prevPage.data.role
    var logData4Contacts = []
    var logDataFromContacts = []
    var overseasId = ''
    var domesticId = ''
    var address1 = ''
    var address2 = ''
    if (that.data.logData4Contacts.length != 0) {
      logData4Contacts = that.data.logData4Contacts
    }
    if (that.data.logDataFromContacts.length != 0) {
      logDataFromContacts = that.data.logDataFromContacts
    }
    if (type == '1') {
      reqData.overseasContact = that.data.contactModel.name
      reqData.overseasMobile = that.data.contactModel.mobile
      reqData.overseasAddr = that.data.address
      address1 = that.data.address
      overseasId = that.data.contactModel.userId
      var isExist = false
      var logData4ContactsValue = reqData.overseasContact + '(' + reqData.overseasMobile + ')'
      logData4Contacts.forEach(function(val, index) {
        if (val == logData4ContactsValue) {
          isExist = true
        }
      })
      if (!isExist) {
        logData4Contacts.push(logData4ContactsValue)
      }
    } else if (type == '2') {
      reqData.domesticContact = that.data.contactModel.name
      reqData.domesticMobile = that.data.contactModel.mobile
      reqData.domesticAddr = that.data.address
      address2 = that.data.address
      domesticId = that.data.contactModel.userId
      var isExist = false
      var logData4ContactsValue = reqData.domesticContact + '(' + reqData.domesticMobile + ')'
      logData4Contacts.forEach(function(val, index) {
        if (val == logData4ContactsValue) {
          isExist = true
        }
      })
      if (!isExist) {
        logData4Contacts.push(logData4ContactsValue)
      }
    } else if (type == '3') {
      reqData.forwarderContact = that.data.contactModel.name
      reqData.forwarderMobile = that.data.contactModel.mobile
      var isExist = false
      var logData4ContactsValue
      if (that.data.isFromContact) {
        logData4ContactsValue = reqData.forwarderContact + '(' + reqData.forwarderMobile + ')'
      }
      logDataFromContacts.forEach(function(val, index) {
        if (val == logData4ContactsValue) {
          isExist = true
        }
      })
      if (!isExist && that.data.isFromContact) {
        logDataFromContacts.push(logData4ContactsValue)
      }
    } else if (type == '4') {
      reqData.agentContact = that.data.contactModel.name
      reqData.agentMobile = that.data.contactModel.mobile
      var isExist = false

      var logData4ContactsValue
      if (that.data.isFromContact) {
        logData4ContactsValue = reqData.agentContact + '(' + reqData.agentMobile + ')'
      }
      logDataFromContacts.forEach(function(val, index) {
        if (val == logData4ContactsValue) {
          isExist = true
        }
      })
      if (!isExist && that.data.isFromContact) {
        logDataFromContacts.push(logData4ContactsValue)
      }
    } else if (type == '5') {
      var index = that.data.index
      role[index].otherContact = that.data.contactModel.name
      role[index].otherMobile = that.data.contactModel.mobile
      var isExist = false
      var logData4ContactsValue
      if (that.data.isFromContact) {
        logData4ContactsValue = role[index].otherContact + '(' + role[index].otherMobile + ')'
      }
      logDataFromContacts.forEach(function(val, index) {
        if (val == logData4ContactsValue) {
          isExist = true
        }
      })
      if (!isExist) {
        logDataFromContacts.push(logData4ContactsValue)
      }
    }
    if (that.data.isFromParties) {
      wx.setStorageSync('logDataFromContacts', logDataFromContacts)
    } else {
      wx.setStorageSync('logData4Contacts', logData4Contacts)
    }
    if (type == '1') {
      prevPage.setData({
        reqData: reqData,
        role: role,
        address1: address1,
      })
    } else if (type == '2') {
      prevPage.setData({
        reqData: reqData,
        role: role,
        address2: address2,
      })
    }

    if (overseasId != '') {
      prevPage.setData({
        overseasId: overseasId,
      })
    }
    if (domesticId != '') {
      prevPage.setData({
        domesticId: domesticId,
      })
    }
    wx.navigateBack({
      delta: 1
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
    },
  }
  const messages = {
    name: {
      required: "姓名不为空",
    },
    mobile: {
      required: "联系方式不为空",
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
showContactList: function() {
  wx.navigateTo({
    url: '../../pages/contact/contact?i=0&isChoose=' + true,
  })
}
})