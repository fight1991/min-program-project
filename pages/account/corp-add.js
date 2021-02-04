var app = getApp()
Page({
  data: {
    adapterSource: [],
    bindSource: [],
    corpName: '',
  },
  onLoad: function(options) {
    var that = this
    that.getData()
  },
  onReady: function() {

  },
  onShow: function() {

  },
  getData: function() {
    var that = this
    app.platformApi.commonApi("/corp/getCorpByCondAssignProp", {
      "corpName": "",
      "sccCode": "",
      "cusCorpName": "",
      "returnProps": [
        "corpId", "corpName"
      ],
      "tradeCode": ""
    }, function(data) {
      if (data.code == '0000') {
        that.setData({
          adapterSource: data.result
        })
      }
    })
  },
  bindData: function(e) {
    this.setData({
      corpName: e.detail.value.trim()
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
    var corpName = e.currentTarget.dataset.corpname.trim()
    this.setData({
      corpName: corpName,
      bindSource: []
    })
  },
  add: function() {
    var that = this
    if (that.data.corpName.length == 0) {
      wx.showToast({
        title: '请输入企业名称',
        icon: 'none'
      })
    } else {
      app.platformApi.commonApi("/corp/addSelectCorpBindUser", {
        "corpId": "",
        "corpName": that.data.corpName,
        "defaulCorp": "",
        "registerClient": "2",
        "registerSource": "004"
      }, function(data) {
        if (data.code == "0000") {
          wx.showToast({
            icon: "none",
            title: "绑定成功，请等待企业审核",
            duration: 2000
          })
          wx.navigateBack({
            delta: 1,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: data.message,
            duration: 2000
          })
        }
      })
    }
  }
})