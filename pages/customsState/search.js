var app = getApp()
Page({
  data: {
    datas: [],
    style: "back",
    isShow: false,
    disabled: '',
    j: 1,
    isVoice: false,
    isSpeaking: false,
    decStatus: {},
  },
  onLoad: function(options) {
    app.authorize()
    if (options.from == "home") {
      this.setData({
        from: options.from,
        showBackTo: false
      })
    } else {
      this.setData({
        showBackTo: true
      })
    }
    this.data.searchModel = app.searchModel
    //显示上一次查询数据
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
    })
    var that = this
    app.getUserInfo(function(userInfo) {
      that.data.searchModel.site = userInfo.site
      var bg1 = userInfo.theme + "/newsearch.png"
      that.setData({
        theme: userInfo.theme,
        bg: bg1
      })
    })
  },
  onShow: function() {
    wx.setStorageSync('fromDetailsToList', 'false')
    wx.setStorageSync('load', 'false')
  },
  bindData: function(e) {
    var that = this
    app.utils.bindData(that, e)
  },
  search: function(e) {
    var that = this
    that.setData({
      disabled: 'disabled',
      searchModel: that.data.searchModel
    })
    var that = this
    var entry_id = that.data.searchModel.entry_id
    if (typeof entry_id == "undefined" || entry_id == "" || entry_id.length != 18) {
      wx.showToast({
        icon: 'none',
        title: '报关单号格式不正确',
      })
      that.setData({
        disabled: ''
      })
    } else {
      var that = this
      var path = "ConnectState"
      wx.showLoading({
        title: '加载中',
      })
      app.httpUtils.get(path, {
        entry_id: that.data.searchModel.entry_id,
        accessName: '通关状态查询'
      }, function(data) {
        wx.hideLoading()
        if (data.Data5.isOk) {
          console.log('***************')
          console.log(data.Data5.data)
          console.log('***************')
          that.setData({
            decStatus: data.Data5.data.decStatus,
          })
          if (data.Data5.data.decStatus == null) {
            wx.showToast({
              icon: 'none',
              title: '查无数据',
            })
            that.setData({
              isShow: false,
            })
          } else {
            that.setData({
              isShow: true,
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '查无数据',
          })
          that.setData({
            isShow: false,
          })
        }
        that.setData({
          disabled: ''
        })
      })
    }

  },
  scanCode: function(e) {
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scanCode(function(data) {
      that.data.searchModel[key] = data.replace(/\*/g, "")
      var searchModel = that.data.searchModel
      that.setData({
        searchModel: searchModel
      })
      that.search()
    })
  },
  reset: function() {
    this.data.searchModel.entry_id = ""
    var searchModel = this.data.searchModel
    this.setData({
      searchModel: searchModel
    })
  },
  backTo: function() {
    app.utils.backTo()
  },
  touchBegin: function() {
    var that = this
    app.utils.touchBegin(that)
  },
  touchOver: function() {
    var that = this
    app.utils.touchOver(that)
  },
  touchdown: function() {
    console.log("new date : " + new Date)
    var _this = this;
    speaking.call(this);
    this.setData({
      isSpeaking: true
    })
    //开始录音
    wx.startRecord({
      success: function(res) {
        var tempFilePath = res.tempFilePath
        console.log("tempFilePath: " + tempFilePath)
      },
      fail: function(res) {
        //录音失败
        wx.showModal({
          title: '提示',
          content: '录音的姿势不对!',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              return
            }
          }
        })
      }
    })
  },
  touchup: function() {
    this.setData({
      isSpeaking: false,
    })
    clearInterval(this.timer)
    wx.stopRecord()
  }
})
function speaking() {
  var _this = this;
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 4;
    _this.setData({
      j: i
    })
  }, 200);
}
