var app = getApp()
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
    isCheck: false,
    accessoryData: [],
    isOperation: 'true',
    disabled: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var isOperation = options.isOperation
    var obj = {}
    if (typeof options.obj != 'undefined') {
      obj = JSON.parse(options.obj)
    }
    that.setData({
      isOperation: isOperation,
      obj: obj
    })
    if (options.isDetails == 'true') {
      that.setData({
        evalList: [{
          tempFilePaths: obj.logisticsTrackingNodeVO[options.indexs].docUrls
        }],
      })
    }
    if (typeof options.isCheck != 'undefined') {
      that.setData({
        isCheck: options.isCheck
      })
      wx.setNavigationBarTitle({
        title: '附件查看',
      })
      app.platformApi.logistics("/logistics/exceptionAttachment", {
        ids: options.ids.split(','),
      }, function(data) {
        if (data.code == '0000') {
          that.setData({
            accessoryData: data.result
          })
        }
      })
    }
    this.setData({
      reqData: {
        'logPid': options.logPid,
        'nodeName': options.nodeName,
        'nodeNo': options.nodeNo,
        'trackingNo': options.trackingNo,
        'uploadNodeId': options.uploadNodeId,
      }
    })
    wx.setNavigationBarTitle({
      title: options.btnName
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
  confirm: function() {
    var that = this
    that.setData({
      disabled: 'disabled'
    })
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
            app.platformApi.logistics("/logistics/nodeUpload",
              that.data.reqData,
              function(data) {
                if (data.code == '0000') {
                  wx.showToast({
                    title: data.result,
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
                    title: '上传失败',
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
      app.platformApi.logistics("/logistics/nodeUpload",
        that.data.reqData,
        function(data) {
          if (data.code == '0000') {
            wx.showToast({
              title: data.result,
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
              title: '上传失败',
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
          }
        })
    }

  },
  showImg: function(e) {
    var url = e.currentTarget.dataset.url
    app.httpUtils.preview(url, ".jpg")
  }
})