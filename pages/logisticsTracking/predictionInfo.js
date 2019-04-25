var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isJudge: false,
    datas: [''],
    evalList: [{
      tempFilePaths: [],
    }],
    imgList: [],
    reqData: {},
    reqData4Upload: {},
    iEFlag: '',
    trafMode: '',
    transMode: '',
    isShow: {
      isShowBillNo: false,
      isShowVoyFlightNo: false,
      isShowDate: false,
      isContainerNo: false,
      title1: false,
      title2: false,
      title3: false,
    },
    isOperation: 'true',
    disabled: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
    app.getUserInfo(function(userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    this.setData({
      date1: date,
      time1: time,
      date2: date,
      time2: time,
      date3: date,
      time3: time,
    })

    this.setData({
      isOperation: isOperation,
      iEFlag: options.iEFlag, //I:进口 E:出口
      trafMode: options.trafMode, //2:海运 4:陆运 5:空运
      transMode: options.transMode,
      reqData: {
        logPid: options.logPid,
        nodeNo: options.nodeNo,
      },
      reqData4Upload: {
        'logPid': options.logPid,
        'nodeName': options.nodeName,
        'nodeNo': options.nodeNo,
        'trackingNo': options.trackingNo,
        'uploadNodeId': options.uploadNodeId,
      }

    })
    if (iEFlag == 'E' && trafMode == '2' && 'CIF、C&F、CPT、CIP、DAT、DDP、DAP、FOB、FCA、FAS'.indexOf(transMode) >= 0) {
      isShow = {
        isShowBillNo: true,
        isShowVoyFlightNo: true,
        isShowDate: true,
        isContainerNo: false,
        isShowMawbNo: true,
        title1: false,
        title2: true,
        title3: false,
      }
    } else if (iEFlag == 'I' && trafMode == '2' && 'EXW、FCA、FOB、FAS'.indexOf(transMode) >= 0) {
      that.setData({
        isJudge: true
      })
      isShow = {
        isShowBillNo: true,
        isShowVoyFlightNo: true,
        isShowDate: true,
        isContainerNo: true,
        isShowMawbNo: true,
        title1: false,
        title2: true,
        title3: false,
      }
    } else if ((iEFlag == 'E' && trafMode == '4' && 'DAT、CIP、CPT、FCA、DDP、DAP'.indexOf(transMode) >= 0) || (iEFlag == 'I' && trafMode == '4' && 'CPT、CIP、DAT、EXW、FCA'.indexOf(transMode) >= 0)) {
      isShow = {
        isShowBillNo: false,
        isShowVoyFlightNo: true,
        isShowDate: false,
        isContainerNo: false,
        isShowMawbNo: false,
        title1: false,
        title2: false,
        title3: true,
      }
    } else if ((iEFlag == 'E' && trafMode == '5' && 'CIF、C&F、CPT、CIP、DAT、DDP、DAP、FOB、FCA、FAS'.indexOf(transMode) >= 0) || (iEFlag == 'I' && trafMode == '5' && 'EXW、FCA、FOB、FAS'.indexOf(transMode) >= 0)) {
      isShow = {
        isShowBillNo: true,
        isShowVoyFlightNo: true,
        isShowDate: true,
        isContainerNo: false,
        isShowMawbNo: true,
        title1: true,
        title2: false,
        title3: false,
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
      if (options.isDetails == 'true') {
        that.setData({
          datas: obj.logisticsNodeInfoVO.pContainerInfo,
          evalList: [{
            tempFilePaths: obj.logisticsTrackingNodeVO[options.indexs].docUrls
          }]
        })
      }
      if (obj.logisticsNodeInfoVO.eta != null) {
        var dates1 = obj.logisticsNodeInfoVO.etd.split(' ')
        var date1 = dates1[0]
        var time1 = dates1[1].substring(0, dates1[1].lastIndexOf(':'))
      } else {
        var date1 = date
        var time1 = time
      }
      if (obj.logisticsNodeInfoVO.eta != null) {
        var dates2 = obj.logisticsNodeInfoVO.eta.split(' ')
        var date2 = dates2[0]
        var time2 = dates2[1].substring(0, dates2[1].lastIndexOf(':'))
      } else {
        var date2 = date
        var time2 = time
      }
      reqData.billNo = obj.logisticsNodeInfoVO.billNo
      reqData.voyFlightNo = obj.logisticsNodeInfoVO.voyFlightNo
      reqData.containerInfo = obj.logisticsNodeInfoVO.containerInfo
      reqData.mawbNo = obj.logisticsNodeInfoVO.mawbNo
      if (options.isDetails) {
        reqData.customMaster = obj.logisticsNodeInfoVO.customMaster
      } else {
        reqData.customMaster = obj.customMaster
      }
      if (obj.logisticsNodeInfoVO.preShippingFlightDate != null) {
        var dates3 = obj.logisticsNodeInfoVO.preShippingFlightDate.split(' ')
        var date3 = dates3[0]
        var time3 = dates3[1].substring(0, dates3[1].lastIndexOf(':'))
      } else {
        var date3 = date
        var time3 = time
      }
      that.setData({
        date1: date1,
        time1: time1,
        date2: date2,
        time2: time2,
        date3: date3,
        time3: time3,
        reqData: reqData
      })
    }
  },

  bindDateChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    //this.data.reqData.etd = e.detail.value
    this.setData({
      date1: e.detail.value
    })
  },
  bindDateChange2: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    //this.data.reqData.eta = e.detail.value
    this.setData({
      date2: e.detail.value
    })
  },
  bindDateChange3: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    //this.data.reqData.preShippingFlightDate = e.detail.value
    this.setData({
      date3: e.detail.value
    })
  },
  bindTimeChange1: function(e) {
    this.setData({
      time1: e.detail.value
    })
  },
  bindTimeChange2: function(e) {
    this.setData({
      time2: e.detail.value
    })
  },
  bindTimeChange3: function(e) {
    this.setData({
      time3: e.detail.value
    })
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.reqData[id] = e.detail.value
  },

  //添加图片
  joinPicture: function(e) {
    var index = e.currentTarget.dataset.index;
    var evalList = this.data.evalList;
    var that = this;
    var imgNumber = evalList[index].tempFilePaths;
    if (imgNumber.length >= 15) {
      wx.showModal({
        title: '',
        content: '最多上传十五张图片',
        showCancel: false,
      })
      return;
    }
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage("album", imgNumber);
          } else if (res.tapIndex == 1) {
            that.chooseWxImage("camera", imgNumber);
          }
        }
      }
    })
  },
  chooseWxImage: function(type, list) {
    var img = list;
    var len = img.length;
    var that = this;
    var evalList = this.data.evalList;
    wx.chooseImage({
      count: 15,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: function(res) {
        var addImg = res.tempFilePaths;
        var addLen = addImg.length;
        if ((len + addLen) > 15) {
          for (var i = 0; i < (addLen - len); i++) {
            img.push(addImg[i]);
          }
        } else {
          for (var j = 0; j < addLen; j++) {
            img.push(addImg[j]);
          }
        }
        that.setData({
          evalList: evalList,
          imgList: img
        })
      },
    })
  },

  //删除图片
  clearImg: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var evalList = this.data.evalList
    var img = evalList[0].tempFilePaths
    img.splice(index, 1)
    this.setData({
      evalList: evalList,
      imgList: img
    })
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
    if ((that.data.reqData.billNo == null || that.data.reqData.billNo.trim() == '') && (that.data.reqData.mawbNo == null || that.data.reqData.mawbNo.trim() == '')) {
      wx.showToast({
        icon: 'none',
        title: '请填写提运单号或总提运单号',
      })
      return
    }
    if (typeof that.data.reqData.customMaster == 'undefined'|| that.data.reqData.customMaster.trim() == '' || that.data.reqData.customMaster.trim().length != 4) {
      wx.showToast({
        icon: 'none',
        title: '请输入4位关区代码',
      })
      return false
    }
    if (that.data.isJudge) {
      var l = true
      that.data.datas.forEach(function(val) {
        if (val.trim() == '') {
          l = false
        }
      })
      if (!l) {
        wx.showToast({
          icon: 'none',
          title: '集装箱号不能为空',
        })
        return
      }
    }

    var docUrls = []
    var oldUrls = []
    var newUrls = []
    that.data.reqData.etd = that.data.date1 + ' ' + that.data.time1 + ':00'
    that.data.reqData.eta = that.data.date2 + ' ' + that.data.time2 + ':00'
    that.data.reqData.preContainerInfo = that.data.datas
    if (that.data.reqData.eta > that.data.reqData.etd) {
      if (that.data.isShow.isShowDate) {
        that.data.reqData.preShippingFlightDate = that.data.date3 + ' ' + that.data.time3 + ':00'
      }
      that.setData({
        disabled: 'disabled'
      })
      that.data.imgList.forEach(function(value) {
        if (value.indexOf('test.5itrade.cn') >= 0 || value.indexOf('www.5itrade.cn') >= 0 || value.indexOf('http://116.62.67.13:8084') >= 0) {
          oldUrls.push(value)
        } else {
          newUrls.push(value)
        }
      })
      if (newUrls.length > 0) {
        newUrls.forEach(function(value) {
          app.platformApi.uploadFile(value, function(data) {
            var data = JSON.parse(data)
            docUrls.push(data.result.url)
            if (docUrls.length == newUrls.length) {
              that.data.reqData.docUrls = oldUrls.concat(docUrls)
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
        })
      } else {
        oldUrls = that.data.evalList[0].tempFilePaths
        that.data.reqData.docUrls = oldUrls
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
                disabled: 'disabled'
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
    } else {
      wx.showToast({
        icon: 'none',
        title: 'ETA要晚于ETD',
      })
    }

  },
  showImg: function(e) {
    var url = e.currentTarget.dataset.url
    app.httpUtils.preview(url, ".jpg")
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
  bindData4Container: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var datas = []
    datas = that.data.datas
    datas[index] = e.detail.value.trim()
    that.setData({
      datas: datas
    })
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
})