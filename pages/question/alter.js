var app = getApp()
Page({
  data: {
    searchModel: {
      QUESTION_NOTE: '',
    },

    files: [],
    question_id: '',
    urls: {
      imgUrl1: "",
      imgUrl2: "",
      imgUrl3: ""
    },
    urls_ed: {},
    urls_seq_no_ed: []
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      files: JSON.parse(options.files)[0],
      question_id: options.question_id,
      searchModel: {
        QUESTION_NOTE: options.QUESTION_NOTE,
      },
    })
    
    if (this.data.files != null && typeof this.data.files != 'undefined') {
      this.data.files.forEach(function (val, index) {
        that.data.urls['imgUrl' + (index + 1)] = val.FULL_NAME
        that.data.urls_seq_no_ed.push(val.SEQ_NO)
      })
    }

    this.setData({
      urls: that.data.urls,
      urls_ed: that.data.urls
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
    var seq_no = new Date().getTime() + (Math.random() * 1000).toString().split('.')[0]
    that.setData({
      seq_no: seq_no
    })
    if (typeof that.data.searchModel.QUESTION_NOTE == 'undefined' || that.data.searchModel.QUESTION_NOTE.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写提问内容',
      })

    } else {
      wx.showModal({
        title: '修改确认',
        content: '您确认要修改吗？',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '提交中...',
            })
            that.data.isPost = true
            that.data.searchModel.QUESTION_ID = that.data.question_id
            that.data.searchModel.question_id = that.data.question_id
            that.data.searchModel.actionType = 'Update'
            app.httpUtils.post('Questions', that.data.searchModel, function (data) {
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
                // wx.navigateBack()
                wx.showToast({
                  title: '修改成功',
                })
                wx.redirectTo({
                  url: 'question',
                })
              }
            })
          }
        }
      })
    }
  },
  uoloadImg: function (imgUrl) {
    var that = this
    var arr = []
    arr.push(imgUrl)
    app.httpUtils.uploadFile("https://51baoguan.cn/APi/File", arr, 0, { "bill_no": that.data.question_id, "bill_type": "QUES", "site": app.globalData.cms_user.site }, function () {

    })
  },
  deleteImg: function (seq_no) {
    app.httpUtils.post('SysDoc', { seq_no: seq_no }, function (data) {

    })
  }
})