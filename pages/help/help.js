var app = getApp()
Page({
  data: {
    titles: ["搜索", "所有问题", "推荐文章", "请选择问题类型", "请描述具体问题信息", "时间", "补充内容", "未填写", "联系方式", "电话", "选填，方便我们与您联系", "提交", "全部问题", "快捷帮助", "意见反馈", "确认", "取消"],
    titless: {},
    currentTab: 0,
    showModalStatus: false,
    searchModel: {
      enable: true,
      PageIndex: 1,
      PageSize: 15,
      title: "",
      ref_1: "0"
    },
    datas: [],
    datas2: [],
    checks: [
      { name: app.translater('数据问题'), value: '3', checked: 'true' },
      { name: app.translater('系统优化'), value: '4', checked: 'false' },
      { name: app.translater('系统BUG'), value: '5', checked: 'false' },
      { name: app.translater('其他'), value: '6', checked: 'false' },
    ],
    date: app.utils.dateTimeFormatter(new Date()),
    style: "back",
    note: "",
    imgUrl: "",
    files: ["help-1.png", "help-2.png", "help-3.png", "help-4.png", "help-5.png", "help-6.png", "help-7.png"],
    currentUser: {},
    seq_no: "",
    status_flag: false,
  },
  loadMore: function () {
    if (!this.data.searchModel.enable) {
      this.setData({
        showflag: 1
      })
      return
    }
    this.initData()
  },
  bindChange: function (e) {
    var that = this
    that.setData({
      currentTab: e.detail.current
    })
    this.setData({
      datas: []
    })
    this.data.searchModel.ref_1 = this.data.currentTab
    this.data.searchModel.PageIndex = 1
    this.data.searchModel.title = ""
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
    })
    this.initData()

  },
  checkboxChange: function (e) {
    for (var i = 0; i < this.data.checks.length; i++) {
      this.data.checks[i]["checked"] = false
    }
    this.data.checks[e.currentTarget.id]["checked"] = "true"
    var checks = this.data.checks
    this.setData({
      checks: checks
    })
    console.log('checkbox发生change事件，携带value值为：', e.target.value)
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
  details: function (e) {
    var obj = this.data.datas[e.currentTarget.id]
    this.setData({
      obj: obj
    })
    wx.navigateTo({
      url: 'details?seq_no=' + this.data.datas[e.currentTarget.id].SEQ_NO
    })
  },
  search: function (e) {
    this.data.searchModel.title = e.detail.value.title
    this.data.searchModel.type = ""
    this.data.searchModel.PageIndex = 1
    enable: true,
      this.data.datas = []
    this.initData()
  },
  loadMore: function () {
    if (!this.data.searchModel.enable) {
      return
    }
    this.initData()
  },
  initData: function () {
    var that = this
    if (that.data.status_flag) {
      return
    }
    wx.showLoading({
      title: '加载中...',
    })
    that.data.status_flag = true
    app.httpUtils.get('Help', that.data.searchModel, function (data) {
      if (data.Success) {
        var datas = that.data.datas
        data.Data5.rows.forEach(function (val, index) {
          datas.push(val)
        })
        that.data.searchModel.PageIndex += 1
        if (data.Data5.total <= datas.length) {
          that.data.searchModel.enable = false
        } else {
          that.data.searchModel.enable = true
        }
        that.setData({
          datas: datas
        })
        if (datas.length == 0) {
          that.setData({
            showflag: 2
          })
        }
        else if (datas.length > 0) {
          that.setData({
            showflag: 0
          })
        }
        wx.hideLoading()
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
      that.data.status_flag = false
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.translater('帮助与反馈'),
    })
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    app.authorize()
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo,
        theme: userInfo.theme
      })
    })
  },
  onShow: function () {
    this.initData()
  },
  helpSubmit: function (e) {
    var that = this
    wx.showLoading({
      title: '提交中',
    })
    var seq_no = new Date().getTime() + (Math.random() * 1000).toString().split('.')[0]
    e.detail.value.seq_no = seq_no
    that.setData({
      seq_no: seq_no
    })
    app.httpUtils.post('Help', e.detail.value, function (data) {
      if (data.Success) {
        if (that.data.imgUrl != "") {
          that.uoloadImg()
        }
        setTimeout(function () {
          wx.hideLoading()
          wx.navigateTo({
            url: 'help'
          })
        }, 1500)
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
    })
  },
  questionOk: function (e) {
    var currentStatu = e.detail.target.dataset.statu
    this.setData({
      note: e.detail.value.note
    })
    this.util(currentStatu)
    this.onShow()
  },
  question: function (e) {
    var currentStatu = e.currentTarget.dataset.statu
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.opacity(0).rotateX(-100).step()
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step()
      this.setData({
        animationData: animation
      })
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        )
      }
    }.bind(this), 200)
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      )
    }
  },
  upload: function () {
    this.initAnimation(180)
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中...',
        })
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        that.setData({
          imgUrl: tempFilePaths
        })
      },
      fail: function (res) {
        that.initAnimation(0)
      }
    })
  },
  uoloadImg: function () {
    var that = this
    app.httpUtils.uploadFile("https://51baoguan.cn/APi/File", that.data.imgUrl, 0, { "bill_no": that.data.seq_no, "bill_type": "HELP", "site": that.data.currentUser.site }, function () {
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 2000
      })
    })
  },
  initAnimation: function (rotate) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animation.rotateZ(rotate).step()
    this.setData({
      animationMenu: animation
    })
  },
})