var app = getApp()
Page({
  data: {
    array: ['请选择分类'],
    qurls: [],
    index: 0,
    searchModel: {},
    actionType: 'Create',
    obj: {},
    id: "",
    urls: {
      imgUrl1: "",
      imgUrl2: "",
      imgUrl3: ""
    },
    disabled:'',
    isPost: false
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function (options) {


    var that = this
    that.setData({
      question_type: options.question_type
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo
      })
    })
    that.setData({
      question_id: options.question_id
    })
    app.getWechatUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
        theme: userInfo.theme
      })
    })
    that.data.searchModel.SHOW_YN = 1
    that.initData()
  },
  onReady: function () {

  },
  initData: function () {
    var that = this
    app.httpUtils.get('Questions', { question_id: that.data.question_id }, function (data) {
      if (data.Success) {
        console.log(data.Data5)
        that.setData({
          obj: data.Data5.Data,
          qurls: data.Data5.Urls
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
    })
    app.httpUtils.get('Questions', { userName: this.data.currentUser.userName, type: "01" }, function (data) {

      wx.hideLoading()
      if (data.Success) {
        var temp = that.data.array
        data.Data5.forEach(function (val, index) {
          if (val != "全部") {
            temp.push(val)
          }
        })
        that.setData(
          {
            array: temp,
          })
      }
      if (that.data.question_type != "") {
        that.setData({
          index: that.data.array.indexOf(that.data.question_type),
          disabled:'disabled'
        })
      }
    })


  },
  onShow: function () {

  },
  checkboxChange: function (e) {
    console.log(e)
  },
  openChange: function (e) {
    if (e.detail.value.length == 0) {
      this.data.searchModel.SHOW_YN = 0
    }
    else {
      this.data.searchModel.SHOW_YN = 1
    }
  },

  jxChange: function (e) {
    if (e.detail.value.length == 0) {
      this.data.searchModel.CHOICENESS_YN = 0
    }
    else {
      this.data.searchModel.CHOICENESS_YN = 5
    }
  },
  uploadImg: function (e) {
    var key = e.currentTarget.id
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.data.urls[key] = res.tempFilePaths[0]
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
    if (typeof that.data.searchModel.ANSWER_NOTE == 'undefined' || that.data.searchModel.ANSWER_NOTE.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写描述内容',
      })
    } else if (that.data.index == '0') {
      wx.showToast({
        icon: 'none',
        title: '请选择分类',
      })
    } else {
      that.data.searchModel.QUESTION_TYPE = that.data.array[that.data.index]
      that.data.searchModel.actionType = "Create"
      that.data.searchModel.QUESTION_ID = that.data.question_id
      that.data.searchModel.ANSWER_USER = app.globalData.cms_user.userName
      that.data.searchModel.NIKE_NAME = that.data.userInfo.nickName
      that.data.searchModel.QUESTION_STATUS = '1'
      that.data.searchModel.USER_IMG = that.data.userInfo.avatarUrl
      wx.showLoading({
        title: '提交中...',
      })
      that.data.isPost = true
      app.httpUtils.post('Answers', that.data.searchModel, function (data) {
        that.data.searchModel.ANSWER_ID = data.Data1
        if (data.Success) {
          if (that.data.urls.imgUrl1 != "") {
            that.uoloadImg(that.data.urls.imgUrl1)
          }
          if (that.data.urls.imgUrl2 != "") {
            that.uoloadImg(that.data.urls.imgUrl2)
          }
          if (that.data.imgUrl3 != "") {
            that.uoloadImg(that.data.urls.imgUrl3)
          }
          setTimeout(function () {
            that.data.isPost = false
            wx.hideLoading()
            wx.navigateBack({ delta: 2 })
          }, 1500)
        }
      })
    }
  },
  uoloadImg: function (imgUrl) {
    var that = this
    var arr = []
    arr.push(imgUrl)
    app.httpUtils.uploadFile("https://51baoguan.cn/APi/File", arr, 0, { "bill_no": that.data.searchModel.ANSWER_ID, "bill_type": "ANSW", "site": app.globalData.cms_user.site }, function () {
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 2000
      })
    })
  },
})