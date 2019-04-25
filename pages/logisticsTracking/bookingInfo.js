var app = getApp()
Page({

  data: {
    reqData: {},
    iEFlag: '',
    trafMode: '',
    transMode: '',
    isShow: {
      isShowPackNo: false,
      isShowGrossWt: false,
      isShowVolume: false,
      isShowGName: false,
      isShowDate: false,
      isShowNote: false,
      isShowContainerInfo: false,
      title1: false,
      title2: false,
      title3: false,
    },
    isOperation: 'true',
    disabled: ''
  },

  onLoad: function(options) {
    var that = this
    var isOperation = options.isOperation
    var iEFlag = options.iEFlag
    var trafMode = options.trafMode
    var transMode = options.transMode
    var isShow = this.data.isShow
    var da = new Date();
    var dates = app.utils.formatDateTime(da).split(' ')
    var date = dates[0]
    var time = dates[1].substring(0, dates[1].lastIndexOf(':'))
    this.setData({
      isOperation: isOperation,
      date: date,
      time: time,
    })

    this.setData({
      iEFlag: options.iEFlag, //I:进口 E:出口
      trafMode: options.trafMode, //2:海运 4:陆运 5:空运
      transMode: options.transMode,
      reqData: {
        logPid: options.logPid,
        nodeNo: options.nodeNo,
      }
    })
    if (iEFlag == 'E' && trafMode == '5' && 'CIF、C&F、CPT、CIP、DAT、DDP、DAP、FOB、FCA、FAS'.indexOf(transMode) >= 0) {
      isShow = {
        isShowPackNo: true,
        isShowGrossWt: true,
        isShowVolume: true,
        isShowGName: true,
        isShowDate: true,
        isShowNote: true,
        isShowContainerInfo: false,
        title1: true,
        title2: false,
        title3: false,
      }
    } else if (iEFlag == 'I' && trafMode == '5' && 'EXW、FCA、FOB、FAS'.indexOf(transMode) >= 0) {
      isShow = {
        isShowPackNo: true,
        isShowGrossWt: true,
        isShowVolume: true,
        isShowGName: true,
        isShowDate: true,
        isShowNote: true,
        isShowContainerInfo: false,
        title1: true,
        title2: false,
        title3: false,
      }
    } else if (iEFlag == 'E' && trafMode == '2' && 'CIF、C&F、CPT、CIP、DAT、DDP、DAP、FOB、FCA、FAS'.indexOf(transMode) >= 0) {
      isShow = {
        isShowPackNo: true,
        isShowGrossWt: true,
        isShowVolume: true,
        isShowGName: true,
        isShowDate: true,
        isShowNote: true,
        isShowContainerInfo: false,
        title1: false,
        title2: true,
        title3: false,
      }
    } else if (iEFlag == 'I' && trafMode == '2' && 'EXW、FCA、FOB、FAS'.indexOf(transMode) >= 0) {
      isShow = {
        isShowPackNo: true,
        isShowGrossWt: true,
        isShowVolume: true,
        isShowGName: true,
        isShowDate: true,
        isShowNote: true,
        isShowContainerInfo: true,
        title1: false,
        title2: true,
        title3: false,
      }
    } else if ((iEFlag == 'E' && trafMode == '4' && 'DAT、CIP、CPT、FCA、DDP、DAP'.indexOf(transMode) >= 0) || (iEFlag == 'I' && trafMode == '4' && 'CPT、CIP、DAT、EXW、FCA'.indexOf(transMode) >= 0)) {
      isShow = {
        isShowPackNo: true,
        isShowGrossWt: true,
        isShowVolume: true,
        isShowGName: true,
        isShowDate: true,
        isShowNote: true,
        isShowContainerInfo: false,
        title1: false,
        title2: false,
        title3: true,
      }
    }
    this.setData({
      isShow: isShow
    })
    var obj = {}
    if (typeof options.obj != 'undefined') {
      var reqData = that.data.reqData
      obj = JSON.parse(options.obj)
      that.setData({
        obj: obj
      })
      if (obj.logisticsNodeInfoVO.needDate != null) {
        var dates = obj.logisticsNodeInfoVO.needDate.split(' ')
        date = dates[0]
        if (typeof dates[1] == 'undefined') {
          time = '00:00'
        } else {
          time = dates[1].substring(0, dates[1].lastIndexOf(':'))

        }
      } else {
        date: that.data.reqData.date
        time: that.data.reqData.time
      }
      reqData.packNo = obj.logisticsNodeInfoVO.packNo
      reqData.grossWt = obj.logisticsNodeInfoVO.grossWt
      reqData.volume = obj.logisticsNodeInfoVO.volume
      reqData.gName = obj.logisticsNodeInfoVO.gName
      reqData.note1 = obj.logisticsNodeInfoVO.note1
      reqData.containerInfo = obj.logisticsNodeInfoVO.containerInfo
      that.setData({
        date: date,
        time: time,
        reqData: reqData
      })
    }
  },

  onReady: function() {

  },

  onShow: function() {

  },

  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.reqData[id] = e.detail.value
  },
  confirm: function() {
    var that = this
    if (that.data.isOperation == 'false') {
      wx.showToast({
        icon: 'none',
        title: '无权操作！',
      })
      return
    }
    if (that.data.reqData.packNo == null || that.data.reqData.packNo.toString().trim()==''){
      that.showErrorModel('件数不为空')
      return
    }
    if (that.data.reqData.grossWt == null || that.data.reqData.grossWt.toString().trim() == ''){
      that.showErrorModel('毛重不为空')
      return
    }
    if (that.data.reqData.volume == null || that.data.reqData.volume.toString().trim() == '') {
      that.showErrorModel('体积不为空')
      return
    }
    if (that.data.reqData.gName == null || that.data.reqData.gName.trim() == '') {
      that.showErrorModel('品名不为空')
      return
    }
    that.setData({
      disabled: 'disabled'
    })
    that.data.reqData.needDate = that.data.date + ' ' + that.data.time + ':00'
    app.platformApi.logistics("/logistics/editeNode",
      that.data.reqData,
      function(data) {
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

  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  showErrorModel: function(message) {
    wx.showToast({
      icon: 'none',
      title: message,
    })
  }
})