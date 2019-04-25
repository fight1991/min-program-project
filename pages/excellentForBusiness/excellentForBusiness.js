var app = getApp()
Page({
  data: {
    outStanding:'1',
    reqData: {},
    corpLogo: '',
    len: 0,
    len1: 0,
    stories: [{
      corpId: '',
      description: '',
      happpenDate: '',
      len: 0
    }, {
      corpId: '',
      description: '',
      happpenDate: '',
      len: 0
    }, {
      corpId: '',
      description: '',
      happpenDate: '',
      len: 0
    }]
  },
  onLoad: function(options) {
    var that = this
    var isGood = wx.getStorageSync("CorpIsGood", '1')
    that.setData({
      outStanding: isGood
    })

    wx.removeStorageSync('reqData')
    wx.removeStorageSync('reqData4Details')
    app.platformApi.commonApi("/user/getUserDefaultCorp", {}, function(data) {
      if (data.code == '0000') { 
        that.data.reqData.corpId = data.result.corpId
        that.data.reqData.corpName = data.result.corpName
        that.setData({
          reqData: that.data.reqData
        })
        app.platformApi.commonApi("/declarantCorp/getCorpInfo", {}, function(datas) {
          if (datas.result != null) {

            wx.setStorageSync('reqData4Details', datas.result)
          } 

          var histories = []
          if (datas.result !== null) {
            datas.result.histories.forEach(function(val, index) {
              val.len = val.description.length
              histories.push(val)
            })
            that.setData({
              reqData: {
                corpId: that.data.reqData.corpId,
                corpName: datas.result.corpName,
                corpDesc: datas.result.corpDesc,
              },
              stories: histories,
              corpLogo: datas.result.corpLogo,
              len: datas.result.corpName.length,
              len1: datas.result.corpDesc.length,
            })
          }
        })
      }
    })

  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.reqData[id] = e.detail.value
    if (typeof this.data.reqData.corpName != 'undefined' && this.data.reqData.corpName != null) {
      this.setData({
        len: this.data.reqData.corpName.length,
      })
    }
    if (this.data.reqData.corpDesc != 'undefined' && this.data.reqData.corpDesc != null) {
      this.setData({
        len1: this.data.reqData.corpDesc.length,
      })
    }
  },
  bindData4Stories: function(e) {
    var that = this
    var index = e.currentTarget.dataset.indexs
    var stories = []
    stories = that.data.stories
    stories[index].description = e.detail.value
    stories[index].len = e.detail.value.length
    that.setData({
      stories: stories
    })
  },
  bindDateChange: function(e) {
    var that = this
    that.data.stories[e.currentTarget.dataset.index].happpenDate = e.detail.value
    this.setData({
      happpenDate: e.detail.value,
      stories: that.data.stories
    })
  },
  addStories: function() {
    var that = this
    that.data.stories.push({
      corpId: '',
      description: '',
      happpenDate: '',
      len: 0
    })
    that.setData({
      stories: that.data.stories
    })
  },
  delStories: function(e) {
    var that = this
    that.data.stories.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      stories: that.data.stories
    })
  },
  uploadImg: function(e) {
    var that = this
    app.platformApi.uploadApi(function(data) {
      var data = JSON.parse(data)
      if (data.code == '0000') {
        wx.showToast({
          title: '上传成功！',
        })
        that.setData({
          corpLogo: data.result.url
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '上传失败！',
        })
      }
    })
  },
  colseImg: function() {
    var that = this
    that.setData({
      corpLogo: ''
    })
  },
  nextstep: function() {
    var that = this
    if (that.data.corpLogo == '' || typeof that.data.reqData.corpName == 'undefined' || that.data.reqData.corpName.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '企业信息填写不玩整',
      })
      return false
    }
    if (typeof that.data.reqData.corpDesc == 'undefined' || that.data.reqData.corpDesc.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '企业简介填写不玩整',
      })
      return false
    }
    var l = ''
    that.data.stories.forEach(function(val, index) {
      if (val.description == '' || val.happpenDate == '') {
        l += (index + 1) + ','
      }
    })
    if (l != '') {
      wx.showToast({
        icon: 'none',
        title: '发展历程填写不完整！',
      })
      return false
    }
    if (that.data.stories.length < 3) {
      wx.showToast({
        icon: 'none',
        title: '发展历程不少于3条！',
      })
      return false
    }
    that.data.reqData.corpLogo = that.data.corpLogo
    that.data.reqData.histories = that.data.stories
    that.data.reqData.histories.forEach(function(val, index) {
      that.data.reqData.histories[index].happpenDate = val.happpenDate + '-01'
    })
    wx.setStorageSync('reqData', that.data.reqData)
    wx.redirectTo({
      url: 'excellentForBusinessS2',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  showImg: function(e) {
    var url = e.currentTarget.dataset.url
    app.httpUtils.preview(url, ".jpg")
  }
})