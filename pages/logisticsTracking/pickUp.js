var app = getApp()
Page({
  data: {
    datas: [''],
    evalList: [{
      tempFilePaths: [],
    }],
    imgList: [],
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
          }],
          datas: obj.logisticsNodeInfoVO.facContainerInfo
        })
      }
    }
  },
  onReady: function() {

  },
  onShow: function() {},
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
          url: 'tailor?imageSrc=' + res.tempFilePaths[0] +'&index=' + e.currentTarget.dataset.index,
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
    var docUrls = []
    var oldUrls = []
    var newUrls = []

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
    that.setData({
      disabled: 'disabled'
    })
    that.data.reqData.factoryContainerInfo = that.data.datas
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
      })
    } else {
      oldUrls = that.data.evalList[0].tempFilePaths
      that.data.reqData.docUrls = oldUrls
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
  }
})