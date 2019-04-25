var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modifyFlag: 0,
    items: [],
    allTotal: 0,
    selectTotal: 0,
    isAllSelected: false,
    checkNodes: [],
    contactModel: {
      wechat: false,
      name: "",
      mobile: "",
      userId: ""
    },
    corpId: '',
    corpName: '',
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var roleVo = wx.getStorageSync("roleVo")
    wx.removeStorageSync("roleVo")
    if (roleVo) {
      roleVo = JSON.parse(roleVo)
    }
    if (options.roleTypeStr == '货代作业') {
      roleVo.roleTypeStr = '货代'
    } else if (options.roleTypeStr == '报关作业') {
      roleVo.roleTypeStr = '报关行'
    } else {
      roleVo.roleTypeStr = options.roleTypeStr.split('作业')[0]
    }
    this.setData({
      i: options.i,
      roleVo: roleVo
    })
    console.log(roleVo)
    if (roleVo.roleUserId) {
      if (roleVo.roleUserId.length == 37) {
        that.setData({
          modifyFlag: 1,
          contactModel: {
            wechat: true,
            name: "微信已邀请",
            mobile: "",
            userId: roleVo.roleUserId
          }
        })
      } else {
        this.getUser(roleVo.roleUserId, function(contactModel) {
          that.setData({
            contactModel: contactModel,
            modifyFlag: 1
          })
        })
      }
    }
    this.getNodes()
  },
  onShow: function() {
    console.log(this.data.contactModel)
  },
  getNodes: function() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    app.platformApi.logistics("/logistics/queryNodes", {
      "logPid": this.data.roleVo.logPid,
      "roleType": this.data.roleVo.roleType,
      "roleUserId": this.data.roleVo.roleUserId
    }, function(data) {
      wx.hideLoading()
      if (data.code == '0000') {
        var temp = []
        data.result.nodeList.forEach(function(item) {
          var status = item.nodeDataStatus
          var checked = false
          var disabled = ''
          if (status == "1") {
            checked = true
            disabled = 'disabled'
          } else if (status == "4") {
            checked = true
            that.data.checkNodes.push(item.nodeNo)
          }
          temp.push({
            trackingNodePid: item.trackingNodePid,
            nodeId: item.nodeNo,
            nodeName: item.nodeName,
            checked: checked,
            disabled: disabled
          })
        })
        that.setData({
          items: temp,
        })
        that.getTotal()
      }
    })
  },
  getUser: function(userId, cb) {
    if (app.globalData.cms_user.userName == userId) {
      userId = ''
    }
    app.platformApi.commonApi("/user/getUserDetail", {
      "userId": userId,
      "userName": ""
    }, function(data) {
      if (data.code == "0000") {
        if (data.result.length > 0) {
          var contactModel = {
            wechat: false,
            name: data.result[0].userName,
            mobile: data.result[0].mobile,
            userId: data.result[0].userId
          }
          cb(contactModel)
        }
      }
    })
  },
  listenCheckboxChange: function(e) {
    var that = this
    var indexs = e.currentTarget.dataset.index
    if (that.data.items[indexs].disabled == 'disabled') {
      return
    }
    var nodeId = e.currentTarget.id
    var name = e.detail.value
    var index = this.data.checkNodes.indexOf(nodeId)
    that.data.items[indexs].checked = !that.data.items[indexs].checked


    if (index > -1) {
      this.data.checkNodes.splice(index, 1)
    } else {
      this.data.checkNodes.push(nodeId)
    }
    that.getTotal()
    that.setData({
      items: that.data.items,
    })
    if (that.data.checkNodes.length == that.data.allTotal) {
      that.setData({
        isAllSelected: true
      })
    } else {
      that.setData({
        isAllSelected: false
      })
    }
  },
  chooseContact: function(e) {
    if (this.data.modifyFlag == 1) {
      return
    }
    var logdata = {
      logPid: this.data.roleVo.logPid
    }
    wx.setStorageSync("logdata", JSON.stringify(logdata))
    wx.navigateTo({
      url: '/pages/contact/contact?i=2&isChoose=' + true,
    })
  },
  add: function(e) {
    var that = this
    console.log(this.data.checkNodes)
    if (!this.data.contactModel.wechat && this.data.contactModel.name.trim().length == 0) {
      wx.showToast({
        title: '请选择操作人',
        icon: "none"
      })
      return
    }
    this.data.roleVo.nodes = this.data.checkNodes
    this.data.roleVo.roleContact = this.data.contactModel.name
    this.data.roleVo.roleUserId = this.data.contactModel.userId
    this.data.roleVo.corpId = this.data.corpId
    this.data.roleVo.corpName = this.data.corpName
    if (!this.data.contactModel.wechat) {
      this.data.roleVo.roleMobile = this.data.contactModel.mobile
    }
    wx.showLoading({
      title: '处理中...',
    })
    app.platformApi.logistics("/logistics/addRole", {
      "roleVO": this.data.roleVo
    }, function(data) {
      if (data.code == '0000') {
        wx.showToast({
          title: '操作成功',
          icon: 'none'
        })

        if (that.data.modifyFlag == 0) {
          //新增参与用户 发送系统消息
          var _roleType = 7
          if (that.data.roleVo.roleType == 1) {
            _roleType = 5
          } else if (that.data.roleVo.roleType == 2) {
            _roleType = 6
          }

          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2]
          prevPage.data.msg_users.push({
            userId: that.data.roleVo.roleUserId,
            name: that.data.roleVo.roleContact,
            roleId: _roleType + '-' + that.data.roleVo.roleUserId
          })
        }
        wx.navigateBack()
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
      wx.hideLoading()
    })
  },
  selectAll: function() {
    var that = this
    var checkNodes = []
    if (!that.data.isAllSelected) {
      that.data.items.forEach(function(val, index) {
        if (val.disabled != 'disabled') {
          val.checked = true
          checkNodes.push(val.nodeId)
        }
      })
    } else {
      checkNodes = []
      that.data.items.forEach(function(val, index) {
        if (val.disabled != 'disabled') {
          val.checked = false
        }
      })
    }
    that.setData({
      checkNodes: checkNodes,
      items: that.data.items,
      isAllSelected: !that.data.isAllSelected
    })
    that.getTotal()
  },
  getTotal: function() {
    var that = this
    var allTotalData = []
    var selectTotalData = []
    that.data.items.forEach(function(val, index) {
      if (val.disabled != 'disabled') {
        allTotalData.push(val)
        if (val.checked) {
          selectTotalData.push(val)
        }
      }
    })
    that.setData({
      allTotal: allTotalData.length,
      selectTotal: selectTotalData.length
    })
  },
  chooseRoles: function() {
    var that = this
    wx.navigateTo({
      url: 'chooseRoles?roleTypeStr=' + that.data.roleVo.roleTypeStr + '&logPid=' + that.data.roleVo.logPid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})