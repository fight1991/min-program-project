var app = getApp()
Page({
  data: {
    datas: [''],
    isOperation: 'true',
    disabled: ''
  },
  onLoad: function(options) {
    var that = this
    var isOperation = options.isOperation
    app.getUserInfo(function(userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    that.setData({
      type: options.type,
      isOperation: isOperation,
      reqData: {
        logPid: options.logPid,
        nodeNo: options.nodeNo,
      },
      reqDatas: {
        logPid: options.logPid,
        nodeNo: options.nodeNo,
      },
    })
    var obj = {}
    if (typeof options.obj != 'undefined') {

      var reqData = that.data.reqData
      obj = JSON.parse(options.obj)
      that.setData({
        obj: obj
      })
      if (options.isDetails == 'false') {
        reqData.linkCustomMaster = obj.logisticsNodeInfoVO.customMaster
      } else {
        if (options.type == '21') {
          reqData.linkCustomMaster = obj.logisticsNodeInfoVO.linkCustomMaster
        } else {
          reqData.linkCustomMaster = obj.logisticsNodeInfoVO.iairCustomMaster
        }
      }
      if (options.isDetails == 'true') {
        if (options.type == '21') {
          reqData.linkHawbNo = obj.logisticsNodeInfoVO.linkHawbNo
          reqData.linkMawbNo = obj.logisticsNodeInfoVO.linkMawbNo
        } else {
          reqData.linkHawbNo = obj.logisticsNodeInfoVO.iairHawbNo
          reqData.linkMawbNo = obj.logisticsNodeInfoVO.iairMawbNo
        }
        that.setData({
          datas: obj.logisticsNodeInfoVO.lkContainerInfo
        })
      }
      that.setData({
        reqData: reqData,
      })
    }

  },
  onReady: function() {

  },
  onShow: function() {

  },
  identify: function(e) {
    this.joinPicture1(e)
  },
  joinPicture1: function(e) {
    var that = this;
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage1("album", e);
          } else if (res.tapIndex == 1) {
            that.chooseWxImage1("camera", e);
          }
        }
      }
    })
  },
  chooseWxImage1: function(type, e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: function(res) {
        wx.navigateTo({
          url: 'tailor?imageSrc=' + res.tempFilePaths[0] + '&index=' + e.currentTarget.dataset.index,
        })
      },
    })
  },
  addContainer: function() {
    var that = this
    that.data.datas.push('')
    that.setData({
      datas: that.data.datas
    })
  },
  delContainer: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.data.datas.splice(index, 1)
    that.setData({
      datas: that.data.datas
    })
  },
  bindData: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var datas = []
    datas = that.data.datas
    datas[index] = e.detail.value.trim()
    that.setData({
      datas: datas
    })
  },
  bindData1: function(e) {
    var id = e.currentTarget.id
    this.data.reqData[id] = e.detail.value
  },
  confirm: function() {
    var that = this
    var l = true
    that.data.datas.forEach(function(val) {
      if (val.trim() == '') {
        l = false
      }
    })
    if (!l && that.data.type == '21') {
      wx.showToast({
        icon: 'none',
        title: '集装箱号不能为空',
      })
      return
    }
    if ((that.data.reqData.linkHawbNo == null || that.data.reqData.linkHawbNo.trim() == '') && (that.data.reqData.linkMawbNo == null || that.data.reqData.linkMawbNo.trim() == '')) {
      wx.showToast({
        icon: 'none',
        title: '请填写提运单号或总提运单号',
      })
      return
    }
    if (typeof that.data.reqData.linkCustomMaster == 'undefined' || that.data.reqData.linkCustomMaster.trim() == '' || that.data.reqData.linkCustomMaster.trim().length != 4) {
      wx.showToast({
        icon: 'none',
        title: '请输入4位关区代码',
      })
      return false
    }
    that.setData({
      disabled: 'disabled'
    })

    that.data.reqData.linkContainerInfo = that.data.datas
    if (that.data.type == '26') {
      that.data.reqDatas.iairCustomMaster = that.data.reqData.linkCustomMaster
      that.data.reqDatas.iairHawbNo = that.data.reqData.linkHawbNo
      that.data.reqDatas.iairMawbNo = that.data.reqData.linkMawbNo
      that.data.reqData = that.data.reqDatas
    }
    app.platformApi.logistics("/logistics/editeNode",
      that.data.reqData,
      function(data) {
        wx.hideLoading()
        if (data.code == '0000') {
          wx.showToast({
            title: '录入成功',
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)

        } else {
          that.setData({
            disabled: ''
          })
          wx.showToast({
            title: '录入失败',
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        }
      })
  }
})