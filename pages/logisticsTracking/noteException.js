var app = getApp()
Page({

  data: {
    reqData: {},
    evalList: [{
      tempFilePaths: [],
    }],
    imgList: [],
    trackingNo: '',
    nodeName:'',
    users: '',
    disabled: ''
  },
  onLoad: function(options) {
    this.setData({
      reqData: {
        'logPid': options.logPid,
        'nodeNo': options.nodeNo,
        'logisticsDocVO': {
          docUrls: []
        },

      },
      trackingNo: options.trackingNo,
      nodeName: options.nodeName,
      users: options.users
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
    var docUrls = []
    that.setData({
      disabled: 'disabled'
    })
    if (that.data.imgList.length > 0) {

      that.data.imgList.forEach(function(value) {
        app.platformApi.uploadFile(value, function(data) {
          var data = JSON.parse(data)
          docUrls.push(data.result.url)
          if (docUrls.length == that.data.imgList.length) {
            that.data.reqData.logisticsDocVO.docUrls = docUrls
            app.platformApi.logistics("/logistics/exceptionNode",
              that.data.reqData,
              function(data) {
                if (data.code == '0000') {
                  wx.request({
                    url: app.globalData.cms_user.host + "/wechat/Warning",
                    data: {
                      trackingNo: that.data.trackingNo,
                      msg: that.data.nodeName+'节点异常：'+that.data.reqData.nodeNote,
                      users: [that.data.users]
                    },
                    method: "POST",
                    dataType: "json",
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function(res) {
                      console.log(res.data)
                    }
                  })
                  wx.showToast({
                    title: '提交成功',
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
                    title: '提交失败',
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
      that.data.reqData.logisticsDocVO.docUrls = docUrls
      app.platformApi.logistics("/logistics/exceptionNode",
        that.data.reqData,
        function(data) {
          if (data.code == '0000') {
            wx.showToast({
              title: '提交成功',
            })
            wx.request({
              url: app.globalData.cms_user.host + "/wechat/Warning",
              data: {
                trackingNo: that.data.trackingNo,
                msg: that.data.nodeName + '节点异常：' + that.data.reqData.nodeNote,
                users: [that.data.users]
              },
              method: "POST",
              dataType: "json",
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data)
              }
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
              title: '提交失败',
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