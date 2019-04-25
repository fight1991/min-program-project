var app = getApp()
Page({
  data: {
    inputValue: '',
    adapterSource: [],
    bindSource: [],
    disable: false,
    customList: [],
    corp_index: 0,
    index: 0,
    corp: {
      corpId: "",
      corpName: "",
      customsCode: "",
      customsName: ""
    }
  },
  onLoad: function(options) {
    var that = this
    wx.hideShareMenu()
    this.getCorpInfo(function(isOk) {
      that.getAllCorps(isOk)
      that.getAllCustoms(isOk)
    })

  },
  corpsChange: function(e) {
    var that = this
    console.log(e.detail.value)
    var tmp = that.data.corp
    tmp.corpId = that.data.corps[e.detail.value].corpId
    tmp.corpName = that.data.corps[e.detail.value].corpName
    console.log(tmp)
    this.setData({
      corp_index: e.detail.value,
      corp: tmp
    })
  },
  bindPickerChange: function(e) {
    var that = this
    console.log(e.detail.value)
    var tmp = this.data.corp
    tmp.customsCode = that.data.customList[e.detail.value].code
    tmp.customsName = that.data.customList[e.detail.value].name
    this.setData({
      customList_index: e.detail.value,
      corp: tmp
    })
  },
  getCorpInfo: function(cb) {
    var that = this
    app.platformApi.commonApi("/customs-rate/getDeclaredCorp", {}, function(data) {
      if (data.code == "0000") {
        that.setData({
          corp: data.result,
          disable: true
        })
        cb(true)
      } else {
        cb(false)
      }
    })
  },
  getAllCorps: function(isOk) {
    var that = this
    app.platformApi.commonApi("/customs-rate/getAllCorp", {}, function(data) {
      if (data.code == "0000") {
        that.setData({
          corps: data.result,
          adapterSource: data.result
        })
      } else {}
    })
  },
  getAllCustoms: function(isOk) {
    var that = this
    app.platformApi.commonApi("/customs-rate/getCustoms", {}, function(data) {
      if (data.code == "0000") {
        that.setData({
          customList: data.result
        })
        if (data.result.length > 0) {
          var tmp = that.data.corp
          var _index = 0
          if (tmp.customsCode.length > 0) {
            for (var i = 0; i < data.result.length - 1; i++) {
              if (data.result[i].code == tmp.customsCode) {
                _index = i
              }
            }
          } else {
            tmp.customsCode = data.result[0].code
            tmp.customsName = data.result[0].name
          }
          that.setData({
            customList_index: _index,
            corp: tmp
          })
        }
      }
    })
  },
  bindData: function(e) {
    console.log(e)
    var tmp = this.data.corp
    tmp.corpId = ''
    tmp.corpName = e.detail.value
    this.setData({
      corp: tmp
    })
    var prefix = e.detail.value
    var newSource = []
    if (prefix != "") {
      this.data.adapterSource.forEach(function(ss) {
        if (ss != null && ss.corpName != null && ss.corpName.indexOf(prefix) != -1) {
          newSource.push(ss)
        }
      })
    }
    if (newSource.length != 0) {
      this.setData({
        bindSource: newSource
      })
    } else {
      this.setData({
        bindSource: []
      })
    }

  },
  itemtap: function(e) {
    var corp = this.data.corp
    corp.corpName = e.currentTarget.dataset.corpname
    corp.corpId = e.target.id

    this.setData({
      corp: corp,
      bindSource: []
    })
  },
  onShareAppMessage: function(res) {
    var uuid = app.utils.getGuid()
    var that = this
    var url = "/customs-rate/share"
    if (that.data.corp.corpId.length == 0) {
      that.data.corp.corpId = uuid
      url = "/customs-rate/shareNewCorp"
    }
    console.log(this.data.corp)
    return {
      title: '我是' + this.data.corp.corpName,
      path: '/pages/otherActivity/rating/rating?corp=' + that.data.corp.corpId + "_" + that.data.corp.corpName + "&custom=" + that.data.corp.customsCode + "_" + that.data.corp.customsName,
      imageUrl: "https://51baoguan.cn/content/images/themes/A/latiao.jpg",
      success: function(result) {
        console.log("微信已邀请")
        app.platformApi.commonApi(url, that.data.corp, function(data) {
          console.log(data)
        })
      }
    }
  },
  closeSelect: function() {
    this.setData({
      bindSource: []
    })
  },
  log:function(){
    console.log("2312332")
  }
})