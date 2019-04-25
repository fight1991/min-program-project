var app = getApp()
var WxParse = require('../../content/libs/wxParse/wxParse.js')
Page({
  data: {
    searchModel: {
      PageIndex: 1,
      PageSize: 10,
      question_id: "",
    },
    tempName: "",
    isShow: true,
    current_re_id: "",
    isLoading: true
  },
  onLoad: function (options) {
    this.data.searchModel.question_id = options.id
    this.data.current_re_id = options.id
    this.initData()
    this.searchFiles()
    this.setData({
      iSpecialist: options.iSpecialist,
      status: options.status
    })
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo
      })
    })
  },
  searchFiles: function () {
    var that = this
    app.httpUtils.get('SysDoc', { "PageIndex": 1, "PageSize": 50, "site": "", "bill_no": that.data.searchModel.question_id, "bill_type": "QUES" }, function (data) {
      if (data.Success) {
        var files = data.Data5.rows
        var s = Math.ceil(data.Data5.rows.length / 3)
        var table = []
        for (var i = 0; i < s; i++) {
          var length = (i + 1) * 3
          if (length > data.Data5.rows.length) {
            length = data.Data5.rows.length
          }
          table[i] = []
          for (var j = i * 3; j < length; j++) {
            table[i][j % 3] = files[j]
          }
        }
        files.forEach(function (val, index) {
          files[index]["FULL_NAME"] = "https://51baoguan.cn/APi/File/" + files[index]["SEQ_NO"]
        })

        that.setData({
          files: table
        })
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
    })
  },
  copy:function(e){
    var content = e.currentTarget.dataset.content
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon:"none"
        })
      }
    })
  },
  show: function (e) {
    var tr = e.currentTarget.dataset.tr
    var td = e.currentTarget.dataset.td
    app.httpUtils.preview("https://51baoguan.cn/APi/File/" + this.data.files[tr][td]["SEQ_NO"], this.data.files[tr][td]["FILE_TYPE"])
  },
  searchAnswer: function () {
    var that = this;
    app.httpUtils.get('Answers', searchModel, function (data) {
      if (data.Success) {
        if (data.Data5.rows.length > 0) {
          that.setData({
            answerData: data.Data5.rows,
            isShow: true
          })
        } else {
          that.setData({
            answerData: data.Data5.rows
          })
          isShow: false
        }
      }
    })
  },
  unsolved: function (e) {
    this.isSolved(e.currentTarget.dataset.id,'2')
  },
  solved: function (e) {
    this.isSolved(e.currentTarget.dataset.id,'3')
  },
  isSolved: function (answer_id,flag) {
    wx.showLoading({
      title: '处理中...',
    })
    app.httpUtils.post('Questions', { actionType: 'IsSolved', isSolved: flag, question_id: this.data.searchModel.question_id, answer_id: answer_id }, function (data) {
      wx.hideLoading()
      if (data.Success) {
        wx.navigateBack()
      } else {
        wx.showToast({
          title: '设置失败！',
        })
      }
    })
  },
  handlerName: function (val) {
    if (val.length == 11) {
      val = val.substring(0, 3) + "****" + val.substring(7, 11)
    }
    return val
  },
  initData: function () {
    var that = this
    var datas = []
    wx.showLoading({
      title: '加载中...',
    })
    app.httpUtils.get('QA', { question_id: this.data.searchModel.question_id, type: '02' }, function (data) {
      wx.hideLoading()
      if (data.Success) {
        if (data.Data5.Question) {
          data.Data5.Question.QUESTION_TIME = app.utils.dateTimeFormatter4TZ(data.Data5.Question.QUESTION_TIME)
          var tmp = that.handlerName(data.Data5.Question.QUESTION_USER)
          if (data.Data5.Question.NIKE_NAME) {
            tmp = data.Data5.Question.NIKE_NAME
          }
          data.Data5.Answers.forEach(function (val, index) {
            val.ANSWER_TIME = app.utils.dateTimeFormatter4TZ(val.ANSWER_TIME)
            datas.push(val)
          })
          that.setData({
            questionData: data.Data5.Question,
            answerData: datas,
            tempName: tmp,
            isLoading: false
          })
        } else {
          wx.showToast({
            title: '该问题不存在，正在返回',
            icon: "none",
            duration: 3000
          })
          setTimeout(function () {
            wx.navigateBack()
          }, 3000)
        }

      } else {
        wx.showToast({
          title: '系统异常，正在返回',
          icon: "none",
          duration: 3000
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 2000)
      }
    })
  },
  answer: function (e) {
    wx.navigateTo({
      url: '../answer/answer?question_id=' + this.data.searchModel.question_id + '&question_type=' + e.currentTarget.dataset.question_type,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  del: function () {
    var that = this
    wx.showModal({
      title: '删除确认',
      content: '您确认要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '处理中...',
          })
          app.httpUtils.post('Questions', { actionType: 'Del', question_id: that.data.current_re_id }, function (data) {
            wx.hideLoading()
            if (data.Success) {
              wx.navigateBack()
            } else {
              wx.showToast({
                title: '删除失败！',
              })
            }
          })
        }
      }
    })
  },
  alter: function () {
    var that = this
    wx.redirectTo({
      url: 'alter?question_id=' + that.data.searchModel.question_id + '&files=' + JSON.stringify(that.data.files) + '&QUESTION_NOTE=' + that.data.questionData.QUESTION_NOTE,
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
        that.setData({
          urls: tmp
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  alterAnswer:function(e){

    var question_id = e.currentTarget.dataset.question_id
    var answer_id = e.currentTarget.dataset.answer_id
    wx.navigateTo({
      url: '../answer/alter?question_id=' + question_id + '&answer_id=' + answer_id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})