var app = getApp()
Page({
  data: {
    reqData: {},
    isOperation: 'true',
    disabled: ''
  },
  onLoad: function(options) {
    var that = this
    var isOperation = options.isOperation
    var da = new Date();
    var dates = app.utils.formatDateTime(da).split(' ')
    var date = dates[0]
    var time = dates[1].substring(0, dates[1].lastIndexOf(':'))
    this.setData({
      isOperation: isOperation,
      type: options.type,
      detailsType: options.detailsType,
      date: date,
      time: time,
      reqData: {
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
      var note1 = ''
      if (that.data.type == '13' || that.data.detailsType == '13') {
        if (obj.logisticsNodeInfoVO.inspection1Time != null) {
          reqData.note1 = obj.logisticsNodeInfoVO.inspection1Address
          var dates = obj.logisticsNodeInfoVO.inspection1Time.split(' ')
          var date = dates[0]
          var time = dates[1].substring(0, dates[1].lastIndexOf(':'))
        } else {
          var date = date
          var time = time
        }
      } else {
        if (obj.logisticsNodeInfoVO.inspection2Time != null) {
          reqData.note1 = obj.logisticsNodeInfoVO.inspection2Address
          var dates = obj.logisticsNodeInfoVO.inspection2Time.split(' ')
          var date = dates[0]
          var time = dates[1].substring(0, dates[1].lastIndexOf(':'))
        } else {
          var date = date
          var time = time
        }
      }

      that.setData({
        date: date,
        time: time,
        reqData: reqData
      })
    }
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
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.reqData[id] = e.detail.value
  },
  confirm: function() {
    var that = this
    that.setData({
      disabled: 'disabled'
    })
    if (that.data.type == '13' || that.data.detailsType == '13') {
      that.data.reqData.inspection1Time = that.data.date + ' ' + that.data.time + ':00'
      that.data.reqData.inspection1Address = that.data.reqData.note1
    } else if (that.data.type == '14' || that.data.detailsType == '14') {
      that.data.reqData.inspection2Time = that.data.date + ' ' + that.data.time + ':00'
      that.data.reqData.inspection2Address = that.data.reqData.note1
    }
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
  }
})