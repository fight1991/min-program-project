var app = getApp()
Page({
  data: {
    customList: [{
      code: 'xxxx',
      name: '请选择关区'
    }],
    index: -1,
    businessList: [{
      corpId: '',
      corpName: '请选择报关企业',
      customsCode: '',
      customsName: ''
    }],
    index1: -1,
    len: 0,
    flag1: 0,
    flag2: 0,
    flag3: 0,
    flag4: 0,
    content: "",
    info: {},
    fromShared: false
  },

  onLoad: function(options) {
    var that = this
    if (options.hasOwnProperty('corp')) {
      var corp = options.corp.split('_')
      var custom = options.custom.split('_')
      this.setData({
        fromShared: true,
        info: {
          corpId: corp[0],
          corpName: corp[1],
          code: custom[0],
          name: custom[1]
        }
      })
      console.log("待评价的企业信息")
      console.log(this.data.info)
    }

    app.getUserInfo(function(data) {
      if (!data.hasOwnProperty("token")) {
        data = null
      }
      app.init(data, function() {
        if (!that.data.fromShared) {
          that.getAllCustoms()
        }
      })
    })
  },
  onShow: function() {

  },
  getAllCustoms: function() {
    var that = this
    app.platformApi.commonApi("/customs-rate/getCustoms", {}, function(data) {
      if (data.code == "0000") {
        that.setData({
          customList: that.data.customList.concat(data.result)
        })
        if (data.result.length > 0) {
          that.setData({
            index: 0
          })
          that.getDeclaredCorpByCustoms(that.data.customList[0].code)
        }
      }
    })
  },
  getDeclaredCorpByCustoms: function(code, name) {
    var that = this
    app.platformApi.commonApi("/customs-rate/getDeclaredCorpByCustoms", {
      code: code
    }, function(data) {
      console.log(data)
      if (data.code == "0000") {
        that.setData({
          businessList: that.data.businessList.concat(data.result),
          index1: 0
        })
      }
    })
  },
  bindPickerChange: function(e) {
    var that = this
    console.log(e)
    this.setData({
      index: e.detail.value,
      custom_selected: true
    })
    that.getDeclaredCorpByCustoms(this.data.customList[e.detail.value].code)
  },
  bindPickerChange1: function(e) {
    this.setData({
      index1: e.detail.value
    })
  },
  inputs: function(e) {
    this.setData({
      len: e.detail.value.trim().length,
      content: e.detail.value.trim()
    })
  },
  changeColor11: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag1: 1
    });
  },
  changeColor12: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag1: 2
    });
  },
  changeColor13: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag1: 3
    });
  },
  changeColor14: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag1: 4
    });
  },
  changeColor15: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag1: 5
    });
  },
  changeColor21: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag2: 1
    });
  },
  changeColor22: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag2: 2
    });
  },
  changeColor23: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag2: 3
    });
  },
  changeColor24: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag2: 4
    });
  },
  changeColor25: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag2: 5
    });
  },
  changeColor31: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag3: 1
    });
  },
  changeColor32: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag3: 2
    });
  },
  changeColor33: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag3: 3
    });
  },
  changeColor34: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag3: 4
    });
  },
  changeColor35: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag3: 5
    });
  },
  changeColor41: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag4: 1
    });
  },
  changeColor42: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag4: 2
    });
  },
  changeColor43: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag4: 3
    });
  },
  changeColor44: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag4: 4
    });
  },
  changeColor45: function() {
    wx.vibrateShort()
    var that = this;
    that.setData({
      flag4: 5
    });
  },
  nextStep: function() {
    if (this.check()) {
      var rateData = {
        code: "",
        corpName: "",
        professional: this.data.flag1,
        efficiency: this.data.flag2,
        economy: this.data.flag3,
        service: this.data.flag4,
        evaluate: this.data.content,
        mobile: "",
        openId: "",
        surveyId: 0,
        userName: ""
      }
      if (this.data.fromShared) {
        rateData.corpId = this.data.info.corpId,
          rateData.customsCode = this.data.info.code
      } else {
        rateData.corpId = this.data.businessList[this.data.index1].corpId,
          rateData.customsCode = this.data.businessList[this.data.index1].customsCode
      }
      console.log(rateData)
      wx.setStorageSync("rateData", JSON.stringify(rateData))
      wx.navigateTo({
        url: 'verify'
      })
    }
  },
  check: function() {
    var that = this
    if (!that.data.fromShared && (that.data.index == -1 || that.data.index == 0)) {
      wx.showToast({
        icon: 'none',
        title: '请选择关区',
      })
      return
    }
    if (!that.data.fromShared && (that.data.index1 == -1 || that.data.index1 == 0)) {
      wx.showToast({
        icon: 'none',
        title: '请选择报关企业',
      })
      return
    }
    if (that.data.content.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '评价内容不能为空',
      })
      return
    }
    if (this.data.flag1 == 0) {
      wx.showToast({
        icon: 'none',
        title: '【专业水平】请打分',
      })
      return
    }
    if (this.data.flag2 == 0) {
      wx.showToast({
        icon: 'none',
        title: '【工作效率】请打分',
      })
      return
    }
    if (this.data.flag3 == 0) {
      wx.showToast({
        icon: 'none',
        title: '【廉洁自律】请打分',
      })
      return
    }
    if (this.data.flag4 == 0) {
      wx.showToast({
        icon: 'none',
        title: '【服务态度】请打分',
      })
      return
    }
    return true
  }
})