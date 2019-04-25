var app = getApp()
Page({
  data: {
    searchModel: {},
    actionType: 'Create',
    urls: {
      imgUrl1: "",
      imgUrl2: "",
      imgUrl3: ""
    },
    isPost: false

  },
  onLoad: function (options) {
    var that = this
    app.getWechatUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
        theme: userInfo.theme
      })
    })
  },
  uploadImg: function (e) {
    var key = e.currentTarget.id
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log(res)
        that.data.urls[key] = tempFilePaths[0]
        var tmp = that.data.urls
        console.log(tmp)
        that.setData({
          urls: tmp
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  colseImg: function (e) {
    var key = e.currentTarget.id
    this.data.urls[key] = ""
    var tmp = this.data.urls
    this.setData({
      urls: tmp
    })
  },
  bindData: function (e) {
    var that = this
    app.utils.bindData(that, e)
  },
  submit: function () { 
    var that = this
    if (that.data.isPost) {
      console.log("is posting")
      return
    }
    if (typeof that.data.searchModel.QUESTION_NOTE == 'undefined' || that.data.searchModel.QUESTION_NOTE.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写提问内容',
      })

    } else {
      that.data.searchModel.QUESTION_USER = app.globalData.cms_user.userName
      that.data.searchModel.QUESTION_STATUS = '0'
      that.data.searchModel.USER_IMG = that.data.userInfo.avatarUrl
      that.data.searchModel.NIKE_NAME = that.data.userInfo.nickName
      that.data.searchModel.actionType = "Create"
      that.data.searchModel.isSolved = ""
      wx.showLoading({
        title: '提交中...',
      })
      that.data.isPost = true
      app.httpUtils.post('Questions', that.data.searchModel, function (data) {
        that.data.searchModel.question_id = data.Data1
        if (data.Success) {
          if (that.data.urls.imgUrl1 != "") {
            that.uoloadImg(that.data.urls.imgUrl1)
          }
          if (that.data.urls.imgUrl2 != "") {
            that.uoloadImg(that.data.urls.imgUrl2)
          }
          if (that.data.urls.imgUrl3 != "") {
            that.uoloadImg(that.data.urls.imgUrl3)
          }
          setTimeout(function () {
            that.data.isPost = false
            wx.hideLoading()
            wx.navigateBack()
          }, 1500)
        }
      })
    }

  },
  uoloadImg: function (imgUrl) {
    var that = this
    var arr = []
    arr.push(imgUrl)
    app.httpUtils.uploadFile("https://51baoguan.cn/APi/File", arr, 0, { "bill_no": that.data.searchModel.question_id, "bill_type": "QUES", "site": app.globalData.cms_user.site }, function () {
      wx.showToast({
        title: '上传成功',
      })
    })
  },
})