var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reqData: {
      forwarderContact: '',
      forwarderMobile: "",
      agentContact: "",
      agentMobile: ""
    },
    isShow: true,
    isClearShow: false,
    showModal: false,
    showModal1: false,
    partiesModel: {},
    role: [],
    invitation: {
      "forwarder": 0,
      "agent": ""
    },
    itemList: ['添加角色']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.hideShareMenu()
    this.data.reqData = JSON.parse(options.obj)
    this.data.reqData.forwarderContact = ''
    this.data.reqData.forwarderMobile = ''
    this.data.reqData.agentContact = ''
    this.data.reqData.agentMobile = ''
    this.setData({
      reqData: this.data.reqData
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    that.setData({
      role: that.data.role
    })
  },
  hide: function() {
    this.setData({
      isShow: false
    })
  },
  bindData: function(e) {
    var that = this
    var index = e.target.dataset.index
    var id = e.currentTarget.id
    this.data.partiesModel[id] = e.detail.value
    if (typeof index != 'undefined') {
      that.data.role[index].otherContact = e.detail.value.substring(0, e.detail.value.indexOf('/'))
      that.data.role[index].otherMobile = e.detail.value.substring(e.detail.value.indexOf('/') + 1)
      that.setData({
        role: that.data.role
      })
    }
  },
  inputChange: function(e) {
    var that = this
    var index = e.target.dataset.index
    var id = e.currentTarget.id
    this.data.partiesModel[id] = e.detail.value
  },
  isClearShow: function(value) {
    var that = this
    if (value == '' || value == null) {
      that.setData({
        isClearShow: false
      })
    } else {
      that.setData({
        isClearShow: true
      })
    }
  },
  deleteTag: function(e) {
    var start = e.target.dataset.index
    var temp = this.data.role
    temp.splice(start,1)
    this.data.role=temp
    this.onShow()
  },
  addRole: function() {
    var that = this
    that.addNewRole()
    // var itemList = that.data.itemList
    // this.setData({
    //   showModal: true
    // })
    // wx.showActionSheet({
    //   itemList: itemList,
    //   success: function(res) {
    //     if (res.tapIndex == itemList.length - 1) {
    //       that.addNewRole()
    //     } else {
    //     }
    //   }
    // })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  addNewRole: function() {
    this.setData({
      showModal1: true,
      showModal: false
    })
  },
  onConfirm: function() {
    this.setData({
      showModal1: false
    })
    if (typeof this.data.partiesModel.name == 'undefined') {

    } else if (this.data.partiesModel.name.trim() == '') {
      return false
    } else {
      var role = {
        otherContact: '',
        otherMobile: '',
        otherType: this.data.partiesModel.name
      }
      this.data.itemList.unshift(this.data.partiesModel.name)
      this.data.role.push(role);
      this.onShow()
    }
  },
  nextStep: function() {
    var that = this
    this.data.role.forEach(function(item) {
      if (item["otherContact"] == "-0") {
        item["otherContact"] = ""
        item["otherMobile"] = ""
      }
    })
    if (this.data.reqData["forwarderContact"] == "-0") {
      this.data.reqData["forwarderContact"] = ""
    }
    if (this.data.reqData["agentContact"] == "-0") {
      this.data.reqData["agentContact"] = ""
    }
    this.data.reqData.logisticsOtherVO = this.data.role
    console.log(this.data.reqData.logisticsOtherVO)

    var notices = []
    notices.push({
      userId: this.data.reqData.agentUserId,
      name: this.data.reqData.agentContact,
      roleId: '2-' + this.data.reqData.agentUserId,
    })
    notices.push({
      userId: this.data.reqData.forwarderUserId,
      name: this.data.reqData.forwarderContact,
      roleId: '1-' + this.data.reqData.forwarderUserId,
    })
    this.data.reqData.logisticsOtherVO.forEach(function(item) {
      var tmp = {
        userId: item.otherUserId,
        name: item.otherContact,
        roleId: '4-' + item.otherUserId,
      }
      notices.push(tmp)
    })
    if (this.data.reqData.forwarderContact.trim() == '' && this.data.reqData.forwarderMobile.trim() == '' && this.data.reqData.agentContact.trim() == '' && this.data.reqData.agentMobile.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '货代或报关行不能为空',
      })
      return
    } else {
      app.platformApi.logistics("/logistics/updateLogistics", this.data.reqData, function(data) {
        if (data.code == '0000') {
          wx.setStorageSync('invitation', JSON.stringify(data.result))
          // wx.request({
          //   url: app.globalData.cms_user.host + "/wechat/SendMsg",
          //   data: {
          //     logPid: that.data.reqData.logPid,
          //     users: notices,
          //     unionid: wx.getStorageSync("unionid"),
          //     trackingNo: that.data.reqData.trackingNo
          //   },
          //   method: "POST",
          //   dataType: "json",
          //   header: {
          //     'content-type': 'application/json'
          //   },
          //   success: function(res) {
          //     console.log(res.data)
          //   },
          //   complete: function(res) {
          //     console.log(res)
          //   },
          //   fail: function(res) {
          //     console.log(res)
          //   }
          // })
          wx.hideLoading()
          wx.redirectTo({
            url: 'finish'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '新增失败',
            duration: 1000,
            success: function() {
              wx.redirectTo({
                url: 'logisticsTracking',
              })
            }
          })
        }
      })
    }
  },
  closeModel: function() {
    this.setData({
      showModal: false
    })
  },
  chooseContact: function(e) {
    var id =
      wx.setStorageSync("logdata", JSON.stringify({
        logPid: this.data.reqData.logPid,
        v1: e.target.dataset.v1,
        v2: e.target.dataset.v2,
        id: e.target.dataset.id,
        otherTypename: e.target.dataset.name,
        index: e.target.dataset.index,
        uuid: e.target.dataset.uuid
      }))
    wx.navigateTo({
      url: '/pages/contact/contact?i=1&isChoose=true'
    })
  }
})