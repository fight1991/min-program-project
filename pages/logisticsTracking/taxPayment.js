var app = getApp()
import WxValidate from '../../utils/WxValidate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evalList: [{
      tempFilePaths: [],
    }],
    imgList: [],
    reqData: {},
    isOperation: 'true',
    isDetails:'false',
    article: [{
      feeName: '关税(￥)',
      feeValue: 0
    }, {
      feeName: '增值税(￥)',
      feeValue: 0
    }],
    hiddenmodalput: true,
    name: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if(options.isDetails=='true'){
      wx.setNavigationBarTitle({
        title: '详情'
      })
      that.setData({
        isDetails:'true'
      })
    }
    var totalAmount = 0
    that.initValidate()
    var isOperation = options.isOperation
    that.setData({
      isOperation: isOperation,
      totalAmount: totalAmount,
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
          article: obj.logisticsTrackingNodeVO[options.indexs].feeVOs,
          evalList: [{
            tempFilePaths: obj.logisticsTrackingNodeVO[options.indexs].docUrls
          }]
        })
      }
      that.setData({
        reqData: reqData
      })
    }
    this.data.article.forEach(function (val, index) {
      totalAmount += parseFloat(val.feeValue)
    })
    this.setData({
      totalAmount: totalAmount
    })
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    if (e.detail.value == '') {
      this.data.article[id].feeValue = 0
    } else {
      this.data.article[id].feeValue = parseFloat(e.detail.value)
    }
    var totalAmount = 0
    this.data.article.forEach(function(val, index) {
      totalAmount += parseFloat(val.feeValue)
    })
    this.setData({
      totalAmount: totalAmount
    })
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
    this.data.reqData.feeVOs = this.data.article
    var docUrls = []
    var oldUrls = []
    var newUrls = []
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
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
              app.platformApi.logistics("/logistics/editeTaxPayment",
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
        app.platformApi.logistics("/logistics/editeTaxPayment",
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
    }
  },
  initValidate() {
    // 验证字段的规则
    const rules = {

    }
    const messages = {

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
  addArticle: function() {
    this.setData({
      hiddenmodalput: false
    })
  },

  //取消按钮
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    })
  },
  confirms: function(e) {
    var article = this.data.article
    article.push({
      feeName: this.data.name,
      feeValue: 0
    })
    this.setData({
      article: article
    })
    this.setData({
      hiddenmodalput: true
    })
  },
  bindData4Name: function(e) {
    this.data.name = e.detail.value + '(￥)'
  },
  deleteArticle: function(e) {
    var index = e.currentTarget.dataset.index
    this.data.article.splice(index, 1)
    var totalAmount = 0
    this.data.article.forEach(function (val, index) {
      totalAmount += parseFloat(val.feeValue)
    })
    this.setData({
      totalAmount: totalAmount,
      article: this.data.article
    })
  },
  showImg: function (e) {
    var url = e.currentTarget.dataset.url
    app.httpUtils.preview(url, ".jpg")
  }
})