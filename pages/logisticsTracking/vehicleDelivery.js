var app = getApp()
import WxValidate from '../../utils/WxValidate'
Page({
  data: {
    evalList: [{
      tempFilePaths: [],
    }],
    imgList: [],
    reqData: {},
    reqData4Upload: {},
    isOperation: 'true',
    disabled: ''
  },
  onLoad: function(options) {
    var that = this
    that.initValidate()
    var isOperation = options.isOperation
    that.setData({
      isOperation: isOperation,
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
      if (options.isDetails == 'true') {
        that.setData({
          evalList: [{
            tempFilePaths: obj.logisticsTrackingNodeVO[options.indexs].docUrls
          }]
        })
      }
      reqData.driverName = obj.logisticsNodeInfoVO.driverName
      reqData.truckNo = obj.logisticsNodeInfoVO.truckNo
      reqData.contactInfo = obj.logisticsNodeInfoVO.contactInfo
      that.setData({
        reqData: reqData
      })
    }
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
  confirm: function(e) {
    var that = this
    if (that.data.isOperation == 'false') {
      wx.showToast({
        icon: 'none',
        title: '无权操作！',
      })
      return
    }
    var docUrls = []
    var oldUrls = []
    var newUrls = []
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      that.setData({
        disabled: 'disabled'
      })
      wx.showLoading({
        title: '录入中...',
      })
      that.data.imgList.forEach(function(value) {
        if (value.indexOf('test.5itrade.cn') >= 0 ||value.indexOf('www.5itrade.cn') >= 0 || value.indexOf('http://116.62.67.13:8084') >= 0) {
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
                function (data) {
                  wx.hideLoading()
                  if (data.code == '0000') {
                    wx.showToast({
                      title: '录入成功',
                    })
                    setTimeout(function () {
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
                    setTimeout(function () {
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
          function (data) {
            wx.hideLoading()
            if (data.code == '0000') {
              wx.showToast({
                title: '录入成功',
              })
              setTimeout(function () {
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
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1000)
            }
          })
      }
    }
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      truckNo: {
        required: true,
      },
      driverName: {
        required: true,
      },
      contactInfo: {
        required: true,
        tel: true,
      },
    }
    const messages = {
      truckNo: {
        required: "车牌号不为空",
      },
      driverName: {
        required: "司机不为空",
      },
      contactInfo: {
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
})