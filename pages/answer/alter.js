var app = getApp()
Page({
  data: {
    array: ['请选择分类'],
    qurls: [],
    qurlsan: [],
    index: 0,
    searchModel: {},
    actionType: 'Create',
    obj: {},
    objan: {},
    id: "",
    urls: {
      imgUrl1: "",
      imgUrl2: "",
      imgUrl3: ""
    },
    urls_ed: {},
    urls_seq_no_ed: [],
    isPost: false
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function (options) {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo
      })
    })
    that.setData({
      question_id: options.question_id,
      answer_id: options.answer_id
    })
    app.getWechatUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
        theme: userInfo.theme
      })
    })
    that.data.searchModel.SHOW_YN = 1
    that.initData()
    that.initAnData()
  },
  onReady: function () {

  },
  initData: function () {
    var that = this
    app.httpUtils.get('Questions', { question_id: that.data.question_id }, function (data) {
      if (data.Success) {
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
    })
  },
  initAnData: function () {
    var that = this
    app.httpUtils.get('Answers', { answer_id: that.data.answer_id, type: '01' }, function (data) {
      if (data.Success) {
        that.setData({
          objan: data.Data5.Data,
          qurlsan: data.Data5.Urls,
          searchModel: {
            ANSWER_NOTE: data.Data5.Data.ANSWER_NOTE,
            SHOW_YN: data.Data5.Data.SHOW_YN,
            CHOICENESS_YN: data.Data5.Data.CHOICENESS_YN,
          },
        })
        that.setData({
          index: that.data.array.indexOf(that.data.objan.QUESTION_TYPE)
        })
        if (that.data.qurlsan != null && typeof that.data.qurlsan != 'undefined' && that.data.qurlsan.length != 0) {
          that.data.qurlsan.forEach(function (val, index) {
            that.data.urls['imgUrl' + (index + 1)] = 'https://51baoguan.cn/APi/File/' + val
            that.data.urls_seq_no_ed.push(val)
          })
          that.setData({
            urls: that.data.urls,
            urls_ed: that.data.urls
          })
        }
        wx.hideLoading()
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
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
    var seq_no = new Date().getTime() + (Math.random() * 1000).toString().split('.')[0]
    that.setData({
      seq_no: seq_no
    })
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
      that.data.searchModel.ANSWER_ID = that.data.answer_id
      that.data.searchModel.QUESTION_TYPE = that.data.array[that.data.index]
      that.data.searchModel.actionType = "Update"
      wx.showLoading({
        title: '提交中...',
      })
      that.data.isPost = true
      app.httpUtils.post('Answers', that.data.searchModel, function (data) {
        if (data.Success) {
          if ((that.data.urls.imgUrl1 != "" && that.data.urls.imgUrl1 != that.data.urls_ed.imgUrl1) || (that.data.urls.imgUrl1 == "" && that.data.urls.imgUrl1 != that.data.urls_ed.imgUrl1)) {
            if (that.data.urls_ed.imgUrl1 != '') {
              that.deleteImg(that.data.urls_seq_no_ed[0])
            }
            that.uoloadImg(that.data.urls.imgUrl1)
          }
          if ((that.data.urls.imgUrl2 != "" && that.data.urls.imgUrl2 != that.data.urls_ed.imgUrl2) || (that.data.urls.imgUrl2 == "" && that.data.urls.imgUrl2 != that.data.urls_ed.imgUrl2)) {
            if (that.data.urls_ed.imgUrl2 != '') {
              that.deleteImg(that.data.urls_seq_no_ed[1])
            }
            that.uoloadImg(that.data.urls.imgUrl2)
          }
          if ((that.data.urls.imgUrl3 != "" && that.data.urls.imgUrl3 != that.data.urls_ed.imgUrl3) || (that.data.urls.imgUrl3 == "" && that.data.urls.imgUrl3 != that.data.urls_ed.imgUrl3)) {
            if (that.data.urls_ed.imgUrl3 != '') {
              that.deleteImg(that.data.urls_seq_no_ed[2])
            }
            that.uoloadImg(that.data.urls.imgUrl3)
          }
          that.data.isPost = false
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
          })
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
    app.httpUtils.uploadFile("https://51baoguan.cn/APi/File", arr, 0, { "bill_no": that.data.answer_id, "bill_type": "ANSW", "site": app.globalData.cms_user.site }, function () {

    })
  },
  deleteImg: function (seq_no) {
    app.httpUtils.post('SysDoc', { seq_no: seq_no }, function (data) {

    })
  }
})