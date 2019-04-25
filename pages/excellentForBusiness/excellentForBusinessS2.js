var app = getApp()
Page({
  data: {
    outStanding: '1',
    reqData: {},
    data1: [{
      corpId: '',
      description: '',
      picUrl: '',
      len: 0
    }],
    data2: [{
      corpId: '',
      description: '',
      picUrl: '',
      len: 0
    }],
    data3: [{
      corpId: '',
      description: '',
      picUrl: '',
      len: 0
    }]
  },
  onLoad: function(options) {
    var that = this
    var isGood = wx.getStorageSync("CorpIsGood", '1')
    that.setData({
      outStanding: isGood
    })
    this.data.reqData = wx.getStorageSync('reqData')
    var reqData4Details = wx.getStorageSync('reqData4Details')
    if (reqData4Details != '' && reqData4Details != null) {
      var teamIntroductions = []
      var envs = []
      var honors = []
      reqData4Details.teamIntroductions.forEach(function(val, index) {
        val.len = val.description.length
        teamIntroductions.push(val)
      })
      reqData4Details.envs.forEach(function(val, index) {
        val.len = val.description.length
        envs.push(val)
      })
      reqData4Details.honors.forEach(function(val, index) {
        val.len = val.description.length
        honors.push(val)
      })
      that.setData({
        data1: teamIntroductions,
        data2: envs,
        data3: honors,
      })
    }
  },
  bindData4Data1: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var data1 = []
    data1 = that.data.data1
    data1[index].description = e.detail.value
    data1[index].len = e.detail.value.length
    that.setData({
      data1: data1
    })
  },
  bindData4Data2: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var data2 = []
    data2 = that.data.data2
    data2[index].description = e.detail.value
    data2[index].len = e.detail.value.length
    that.setData({
      data2: data2
    })
  },
  bindData4Data3: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var data3 = []
    data3 = that.data.data3
    data3[index].description = e.detail.value
    data3[index].len = e.detail.value.length
    that.setData({
      data3: data3
    })
  },
  addData1: function() {
    var that = this
    that.data.data1.push({
      corpId: '',
      description: '',
      picUrl: '',
      len: 0
    })
    that.setData({
      data1: that.data.data1
    })
  },
  addData2: function() {
    var that = this
    that.data.data2.push({
      corpId: '',
      description: '',
      picUrl: '',
      len: 0
    })
    that.setData({
      data2: that.data.data2
    })
  },
  addData3: function() {
    var that = this
    that.data.data3.push({
      corpId: '',
      description: '',
      picUrl: '',
      len: 0
    })
    that.setData({
      data3: that.data.data3
    })
  },
  delData1: function(e) {
    var that = this
    that.data.data1.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      data1: that.data.data1
    })
  },
  delData2: function(e) {
    var that = this
    that.data.data2.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      data2: that.data.data2
    })
  },
  delData3: function(e) {
    var that = this
    that.data.data3.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      data3: that.data.data3
    })
  },
  uploadImg4Data1: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var data1 = []
    data1 = that.data.data1
    if (index != 0 && that.data.data1[index - 1].picUrl == '') {
      wx.showToast({
        icon: 'none',
        title: '请依次上传图片',
      })
      return
    }
    app.platformApi.uploadApi(function(data) {
      var data = JSON.parse(data)
      if (data.code == '0000') {
        wx.showToast({
          title: '上传成功！',
        })
        data1[index].picUrl = data.result.url
        that.setData({
          data1: data1
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '上传失败！',
        })
      }
    })
  },
  uploadImg4Data2: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var data2 = []
    data2 = that.data.data2
    if (index != 0 && that.data.data2[index - 1].picUrl == '') {
      wx.showToast({
        icon: 'none',
        title: '请依次上传图片',
      })
      return
    }
    app.platformApi.uploadApi(function(data) {
      var data = JSON.parse(data)
      if (data.code == '0000') {
        wx.showToast({
          title: '上传成功！',
        })
        data2[index].picUrl = data.result.url
        that.setData({
          data2: data2
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '上传失败！',
        })
      }
    })
  },
  uploadImg4Data3: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var data3 = []
    data3 = that.data.data3
    if (index != 0 && that.data.data3[index - 1].picUrl == '') {
      wx.showToast({
        icon: 'none',
        title: '请依次上传图片',
      })
      return
    }
    app.platformApi.uploadApi(function(data) {
      var data = JSON.parse(data)
      if (data.code == '0000') {
        wx.showToast({
          title: '上传成功！',
        })
        data3[index].picUrl = data.result.url
        that.setData({
          data3: data3
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '上传失败！',
        })
      }
    })
  },
  colseImg4Data1: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var data1 = []
    data1 = that.data.data1
    data1[index].picUrl = ''
    that.setData({
      data1: data1
    })
  },
  colseImg4Data2: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var data2 = []
    data2 = that.data.data2
    data2[index].picUrl = ''
    that.setData({
      data2: data2
    })
  },
  colseImg4Data3: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var data3 = []
    data3 = that.data.data3
    data3[index].picUrl = ''
    that.setData({
      data3: data3
    })
  },
  showImg: function(e) {
    var url = e.currentTarget.dataset.url
    app.httpUtils.preview(url, ".jpg")
  },
  nextStep: function() {
    var that = this
    var l1 = ''
    var l2 = ''
    var l3 = ''
    that.data.data1.forEach(function(val, index) {
      if (val.description == '' || val.picUrl == '') {
        l1 += (index + 1) + ','
      }
    })
    if (l1 != '') {
      wx.showToast({
        icon: 'none',
        title: '团队介绍填写不完整！',
      })
      return false
    }
    that.data.data2.forEach(function(val, index) {
      if (val.description == '' || val.picUrl == '') {
        l1 += (index + 1) + ','
      }
    })
    if (l1 != '') {
      wx.showToast({
        icon: 'none',
        title: '公司环境填写不完整！',
      })
      return false
    }
    that.data.data3.forEach(function(val, index) {
      if (val.description == '' || val.picUrl == '') {
        l1 += (index + 1) + ','
      }
    })
    if (l1 != '') {
      wx.showToast({
        icon: 'none',
        title: '企业荣誉填写不完整！',
      })
      return false
    }
    that.data.reqData.teamIntroductions = that.data.data1
    that.data.reqData.envs = that.data.data2
    that.data.reqData.honors = that.data.data3
    wx.setStorageSync('reqData', that.data.reqData)
    wx.redirectTo({
      url: 'excellentForBusinessS3',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})