var app = getApp()
Page({
  data: {
    text: '由于近期政策变更较快，平台内问答仅供参考，具体以当地海关要求为准',
    marqueePace: 0.5,
    marqueeDistance: 0,
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',
    interval: 100,
    array: ['全部'],
    result_array: ['全部', '未回复', '已回复', '未解决', '已解决'],
    arr_index: 0,
    a_index: 0,
    b_index: 0,
    currentTab: 0,
    showflag1: '',
    showflag2: '',
    showflag3: '',
    searchModel: {
      enable: true,
      PageIndex: 1,
      PageSize: 10,
      question_user: "",
      question_type: "",
      question_status: ""
    },
    searchModel2: {
      enable: true,
      PageIndex: 1,
      PageSize: 10,
      question_user: "",
      question_type: "",
      question_status: ""
    },
    searchModel3: {
      enable: true,
      PageIndex: 1,
      PageSize: 10,
      question_user: "",
      question_type: "",
      question_status: "0"
    },
    isShow: true,
    allQuestionData: [],
    allAnswerData: [],
    allQueData: []
  },
  scrollTop: function (e) {
    var that = this
    app.utils.scrollTop(that, e)
  },
  goTop: function (e) {
    var that = this
    app.utils.goTop(that)
  },
  loadAllMore: function () {
    this.initQuestionData("1")
  },
  loadMineMore: function () {
    this.initQueData("1")
  },
  loadMore: function () {
    this.initMyQuestionData("1")
  },
  refresh1: function () {
    this.initQuestionData("0")
  },
  refresh2: function () {
    this.initQueData("0")
  },
  refresh3: function () {
    this.initMyQuestionData("0")
  },
  onLoad: function (e) {
    var that = this
    app.authorize()
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    app.getWechatUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
        theme: userInfo.theme
      })
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo
      })
    }) 
    that.data.searchModel.site = this.data.currentUser.site
  },
  onShow: function () {
    var that = this
    console.log("onShow:" + this.data.currentTab)
    this.refresh1()
    app.httpUtils.get('Questions', { userName: this.data.currentUser.userName, type: "00" }, function (data) {
      if (data.Success) {
        if (data.Data5) {
          that.setData(
            {
              isShow: false,
            })
        }
      }
      that.initQueData("0")
      if (!that.data.isShow) {
        that.initMyQuestionData("0")
      }
    })
    app.httpUtils.get('Questions', { userName: this.data.currentUser.userName, type: "01" }, function (data) {
      // wx.hideLoading()
      if (data.Success) {
        that.setData(
          {
            array: data.Data5,
          })
      }
    })
    var vm = this;
    var length = vm.data.text.length * vm.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    vm.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin
    });
    vm.run1();
    vm.run2();
  },
  searchFiles: function () {
    var that = this
    app.httpUtils.get('SysDoc', { "PageIndex": 1, "PageSize": 50, "site": this.data.searchModel.site, "bill_no": this.data.obj.INNER_NO, "bill_type": "DEC" }, function (data) {
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
          files[index]["FULL_NAME"] = "https://51aeo.com/APi/File/" + files[index]["SEQ_NO"]
        })
        that.setData({
          files: table
        })
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
          duration: 2000
        })
      }
    })
  },
  bindChange: function (e) {
    var that = this
    that.setData({ currentTab: e.detail.current })
  },
  swichNav: function (e) {
    var that = this
    if (this.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  show: function (e) {
    var tr = e.currentTarget.dataset.tr
    var td = e.currentTarget.dataset.td
    app.httpUtils.preview("https://51aeo.com/APi/File/" + this.data.files[tr][td]["SEQ_NO"], this.data.files[tr][td]["FILE_TYPE"])
  },
  hide: function () {
    this.setData(
      {
        showModalStatus: false
      }
    )
  },
  upload: function () {
    var that = this
    this.initAnimation(180)
    wx.showActionSheet({
      itemList: ['上传图片'],
      success: function (res) {
        that.initAnimation(0)
        app.httpUtils.upload("https://51aeo.com/APi/File", { "bill_no": that.data.obj.INNER_NO, "bill_type": "DEC", "site": that.data.searchModel.site }, function () {
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          })
          that.searchFiles()
        }, res.tapIndex)
      },
      fail: function (res) {
        that.initAnimation(0)
      }
    })
  },
  initAnimation: function (rotate) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animation.rotateZ(rotate).step();
    this.setData({
      animationMenu: animation
    })
  },
  showDetails: function (e) {
    wx.navigateTo({
      url: 'details?id=' + e.currentTarget.id + '&status=' + e.currentTarget.dataset.status + '&iSpecialist=' + this.data.isShow,
    })
  },
  util: function () {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step()

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    this.setData(
      {
        showModalStatus: true
      }
    )
  },

  initQuestionData: function (flag) {
    wx.showLoading({
      title: '加载中...',
    })
    var datas = this.data.allQuestionData
    var that = this
    this.data.searchModel.question_user = ""
    if (flag == "0") {
      this.data.searchModel.PageIndex = 1
    }
    app.httpUtils.get('QA', this.data.searchModel, function (data) {
      if (data.Success) { 
        if (data.Data5.rows.length==0){
          wx.hideLoading()
          //没有更多数据
          if (that.data.allQuestionData.length>10){ 
            that.setData({
              showflag1: '1',
            })
          } else{
            that.setData({
              showflag1: '',
            })
          }
          return
        }
        var datas = that.data.allQuestionData
        if (flag == "0") {
          datas = []
        }
        data.Data5.rows.forEach(function (val, index) {
          val.Question.QUESTION_TIME = app.utils.dateTimeFormatter4TZ(val.Question.QUESTION_TIME)
          val.Question.LAST_REPLY_TIME = app.utils.dateTimeFormatter4TZ(val.Question.LAST_REPLY_TIME)
          datas.push(val)
        })
        that.setData(
        {
          allQuestionData: datas,
        })
        that.data.searchModel.PageIndex += 1
        if (data.Data5.total < 10 || data.Data5.total > datas.length) {
          that.setData({
            showflag1: '',
          })
        } else {
          that.setData({
            showflag1: '1',
          })
        }
        wx.hideLoading()
      }
    })

  },

  initQueData: function (flag) {
    //获取用户信息
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    this.data.searchModel2.question_user = app.globalData.cms_user.userName
    this.data.searchModel2.is_expert = "0"
    var datas = []
    if (flag == "0") {
      this.data.searchModel2.PageIndex = 1
    }
    app.httpUtils.get('QA', this.data.searchModel2, function (data) {
      wx.hideLoading()
      if (data.Success) {
        if (data.Data5.rows.length == 0) {
          wx.hideLoading()
          //没有更多数据
          if (that.data.allQueData.length > 10) {
            that.setData({
              showflag2: '1',
            })
          } else {
            that.setData({
              showflag2: '',
            })
          }
          return
        }
        var datas = that.data.allQueData
        if (flag == "0") {
          datas = []
        }
        data.Data5.rows.forEach(function (val, index) {
          val.Question.QUESTION_TIME = app.utils.dateTimeFormatter4TZ(val.Question.QUESTION_TIME)
          datas.push(val)
        })
        that.data.searchModel2.PageIndex += 1
        if (data.Data5.total < 10 || data.Data5.total > datas.length) {
          that.setData({
            showflag2: '',
          })
        } else {
          that.setData({
            showflag2: '1',
          })
        }
        that.setData(
          {
            allQueData: datas,
          })
      }
    })
  },
  initMyQuestionData: function (flag) {
    var that = this
    this.data.searchModel3.question_user = app.globalData.cms_user.userName
    wx.showLoading({
      title: '加载中...',
    })
    this.data.searchModel3.is_expert = "1"
    if (flag == "0") {
      this.data.searchModel3.PageIndex = 1
    }
    app.httpUtils.get('QA', this.data.searchModel3, function (data) {
      wx.hideLoading()
      if (data.Success) {
        if (data.Data5.rows.length == 0) {
          wx.hideLoading()
          //没有更多数据
          if (that.data.allAnswerData.length > 10) {
            that.setData({
              showflag3: '1',
            })
          } else {
            that.setData({
              showflag3: '',
            })
          }
          return
        }
        var datas = [] = that.data.allAnswerData
        if (flag == "0") {
          datas = []
        }
        data.Data5.rows.forEach(function (val, index) {
          val.Question.QUESTION_TIME = app.utils.dateTimeFormatter4TZ(val.Question.QUESTION_TIME)
          datas.push(val)
        })
        that.data.searchModel3.PageIndex += 1
        if (data.Data5.total < 10 || data.Data5.total > datas.length) {
          that.setData({
            showflag3: '',
          })
        } else {
          that.setData({
            showflag3: '1',
          })
        }
        that.setData(
          {
            allAnswerData: datas,
          })
      }
    })
  },
  submitQuestion: function () {
    wx.navigateTo({
      url: 'add',
    })
  },
  answer: function (e) {
    if (e.currentTarget.dataset.status == "0") {
      wx.navigateTo({
        url: '../answer/answer?question_id=' + e.currentTarget.id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请选择待解答问题答疑',
        duration: 2000
      })
    }
  },
  bindCatoryChange: function (e) {
    var that = this
    //问题展示分类
    this.setData({
      arr_index: e.detail.value
    })
    that.data.searchModel.question_type = this.data.array[e.detail.value]
    that.initQuestionData("0")
  },
  bindResultChange: function (e) {
    //我的提问 过滤
    var that = this
    this.setData({
      a_index: e.detail.value
    })
    that.data.searchModel2.question_status = (e.detail.value - 1) == -1 ? "" : (e.detail.value - 1)
    that.initQueData("0")
  },
  bindPickerChange: function (e) {
    //我的解答 过滤
    var that = this
    this.setData({
      b_index: e.detail.value
    })
    that.data.searchModel3.question_status = (e.detail.value - 1) == -1 ? "" : (e.detail.value - 1)
    that.initMyQuestionData("0")
  },
  run1: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance < vm.data.length) {
        vm.setData({
          marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        vm.setData({
          marqueeDistance: vm.data.windowWidth
        });
        vm.run1();
      }
    }, vm.data.interval);
  },
  run2: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance2 < vm.data.length) { 
        vm.setData({
          marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
          marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
        });
      } else {
        if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
          vm.setData({
            marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
          });
          clearInterval(interval);
          vm.run2();
        } else {
          clearInterval(interval);
          vm.setData({
            marqueeDistance2: -vm.data.windowWidth
          });
          vm.run2();
        }
      }
    }, vm.data.interval);
  }
})  