var app = getApp()
Page({
  data: {
    isShowContent: true,
    isShowImg: true,
    userName: '',
    userId: '',
    reqData: {},
    len: 0,
    len1: 0,
    headPhoto: '',
    gender: '',
    oldStories: [{
      picDescription: '',
      picType: '',
      picUrl: '',
      userId: '',
      len: 0
    }, {
      picDescription: '',
      picType: '',
      picUrl: '',
      userId: '',
      len: 0
    }, {
      picDescription: '',
      picType: '',
      picUrl: '',
      userId: '',
      len: 0
    }],
    stories: [{
      picDescription: '',
      picType: '',
      picUrl: '',
      userId: '',
      len: 0
    }, {
      picDescription: '',
      picType: '',
      picUrl: '',
      userId: '',
      len: 0
    }, {
      picDescription: '',
      picType: '',
      picUrl: '',
      userId: '',
      len: 0
    }]
  },
  onLoad: function(options) {
    var that = this

    app.getWechatUserInfo(function(userInfo) {
      that.setData({
        gender: userInfo.gender
      })
    })
    app.getUserInfo(function(userInfo) {
      that.setData({
        userName: userInfo.name,
        userId: userInfo.userName
      })
    })
    wx.showLoading({
      title: '加载中...',
    })
    app.platformApi.commonApi("/declarant/getDeclarantInfo", {}, function(data) {
      wx.hideLoading()
      var stories = []
      if (data.code == '0000') {
        if (data.result.stories.length >= 4) {
          data.result.stories.forEach(function(val, index) {
            if (val.picType == 'S') {
              if (val.picDescription == null) {
                val.picDescription = ''
              }
              val.len = val.picDescription.length
              stories.push(val)
              if (index + 1 == data.result.stories.length && data.result.stories.length < 11) {
                stories.push({
                  picDescription: '',
                  picType: '',
                  picUrl: '',
                  userId: '',
                  len: 0
                })
              }
            }
          })
        } else {
          stories = that.data.stories
        }
        that.setData({
          userName: data.result.userName,
          userId: data.result.userName,
          reqData: {
            introduction: data.result.introduction,
            signContent: data.result.signContent,
          },
          stories: stories,
          oldStories: stories,
          len: data.result.signContent == null ? 0 : data.result.signContent.length,
          len1: data.result.introduction == null ? 0 : data.result.introduction.length,
          headPhoto: data.result.headPhoto,
          gender: data.result.sex == 'M' ? '1' : '0',
        })
      }
    })
  },
  onReady: function() {

  },
  onShow: function() {
    var that = this
    that.setData({
      isShowImg: true,
    })
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.reqData[id] = e.detail.value
    if (typeof this.data.reqData.signContent != 'undefined' && this.data.reqData.signContent != null) {
      this.setData({
        len: this.data.reqData.signContent.length,
      })
    }
    if (this.data.reqData.introduction != 'undefined' && this.data.reqData.introduction != null) {
      this.setData({
        len1: this.data.reqData.introduction.length,
      })
    }
  },
  uploadImg: function(e) {
    var that = this
    app.platformApi.uploadApi(function(data) {
      var data = JSON.parse(data)
      if (data.code == '0000') {
        wx.showToast({
          title: '上传成功！',
        })
        that.setData({
          headPhoto: data.result.url
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '上传失败！',
        })
      }
    })
  },
  uploadImg4Stories: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var stories = []
    stories = that.data.stories
    if (index != 0 && that.data.stories[index - 1].picUrl == '') {
      wx.showToast({
        icon: 'none',
        title: '请依次上传图片',
      })
      return
    }
    app.platformApi.uploadApi(function(data) {
      var data = JSON.parse(data)
      if (data.code == '0000') {
        wx.showToast({
          title: '上传成功！',
        })
        if (stories.length - 1 == index && stories.length < 10) {
          stories.push({
            picDescription: '',
            picType: '',
            picUrl: '',
            userId: '',
            len: 0
          })
        }
        stories[index].picUrl = data.result.url
        that.setData({
          oldStories: stories,
          stories: stories
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '上传失败！',
        })
      }
    })
  },
  colseImg: function() {
    var that = this
    that.setData({
      headPhoto: ''
    })
  },
  colseImg4Stories: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var stories = []
    stories = that.data.stories
    stories[index].picUrl = ''
    that.setData({
      oldStories: stories,
      stories: stories
    })
  },
  bindData4Stories: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var stories = []
    stories = that.data.stories
    stories[index].picDescription = e.detail.value
    stories[index].len = e.detail.value.length
    that.setData({
      stories: stories
    })
  },
  confirm: function(callback) {
    var that = this
    var reqData = {}
    if (that.data.headPhoto == '' || that.data.headPhoto == null) {
      wx.showToast({
        icon: 'none',
        title: '请上传头像',
      })
      return false
    }

    if (typeof that.data.reqData.signContent == 'undefined' || that.data.reqData.signContent == null || that.data.reqData.signContent.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写个性签名',
      })
      return false
    }
    if (typeof that.data.reqData.introduction == 'undefined' || that.data.reqData.introduction == null || that.data.reqData.introduction.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写个人简介',
      })
      return false
    }
    if (that.data.stories[0].picUrl == '' || that.data.stories[1].picUrl == '' || that.data.stories[2].picUrl == '') {
      wx.showToast({
        icon: 'none',
        title: '前三张照片为必填项',
      })
      return false
    }

    that.data.reqData.corpName = ''
    that.data.reqData.headPhoto = that.data.headPhoto
    that.data.reqData.sex = that.data.gender == '1' ? 'M' : 'F'
    that.data.reqData.userName = that.data.userName
    that.data.reqData.userId = that.data.userId
    that.data.reqData.stories = that.data.stories
    if (that.data.oldStories.length - 1 == that.data.reqData.stories.length) {
      that.data.reqData.stories.pop()
    }
    var l = ''
    that.data.reqData.stories.forEach(function(val, index) {
      if (val.picDescription == '' && val.picUrl != '') {
        l += (index + 1) + ','
      }
    })
    if (l != '') {
      wx.showToast({
        icon: 'none',
        title: '故事内容不能为空！',
      })
      return false
    }
    wx.showLoading({
      title: '提交中...',
    })
    app.platformApi.commonApi("/declarant/saveDeclarantInfo", that.data.reqData, function(data) {
      wx.hideLoading()
      if (data.code == '0000') {
        if (that.data.isShowImg) {
          that.setData({
            url: data.result,
            isShowContent: false,
            isShow: true
          })
        }
        if (callback) {
          callback()
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '保存失败，无法预览',
        })
      }
    })
  },
  preview: function() {
    var that = this
    that.setData({
      isShowImg: false
    })
    that.confirm(function() {
      wx.navigateTo({
        url: 'preview',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    })
  },
  download: function() {
    var img_url = this.data.url
    wx.downloadFile({
      url: img_url,
      success: function(res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                icon: 'none',
                title: "保存成功"
              })
            }
          })
        }
      }
    })
  },
  showImg: function(e) {
    var url = e.currentTarget.dataset.url
    app.httpUtils.preview(url, ".jpg")
  }
})