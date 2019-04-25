var app = getApp()
Page({
  data: {
    searchModel: {
      name: '',
      code: ''
    },
    list: []
  },
  onLoad: function(options) {
    var that = this
    that.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    this.getCodeImg()
    const query = wx.createSelectorQuery()
    query.select('#myContainer').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      console.log(res)
      console.log(res[0].height)
      res[0].top // #the-id节点的上边界坐标
      res[1].scrollTop // 显示区域的竖直滚动位置
    })
    this.getCodeImg()
  },
  onReady: function() {

  },
  onShow: function() {
   
  },
  showDetails: function(e) {
    wx.navigateTo({
      url: 'creditList?seqNo=' + e.currentTarget.dataset.seqno + '&saicSysNo=' + e.currentTarget.dataset.saicsysno + '&CorpName=' + e.currentTarget.dataset.corpname,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.searchModel[id] = e.detail.value
  },
  search: function() {
    var that = this
    //
    if (that.data.searchModel.name.trim().length<2) {
      wx.showToast({
        icon: 'none',
        title: '企业名称或社会信用代码不能为空且长度大于2',
      })
      return
    }
    if (that.data.searchModel.code.trim() == '') {
      wx.showToast({
        icon: 'none',
        title: '验证码不能为空',
      })
      return
    }
    wx.showLoading({
      title: '加载中...',
    })
    app.httpUtils.post('CreditApi', {
      type: '002',
      user_id: app.globalData.cms_user.userName,
      corpName: that.data.searchModel.name,
      code: that.data.searchModel.code
    }, function(data) {
      that.getCodeImg()
      wx.hideLoading()
      if (data.Success) {
        that.setData({
          list: [],
        })
        that.data.searchModel.code = ''
        that.setData({
          list: data.Data5,
          searchModel: that.data.searchModel
        })
      } else {
        wx.showToast({
          title: '验证码不正确',
          icon: 'none'
        })
      }
    })
  },
  getCodeImg: function() {
    var that = this
    app.httpUtils.post('CreditApi', {
      type: '001',
      user_id: app.globalData.cms_user.userName
    }, function(data) {
      that.setData({
        imgUrl: app.globalData.cms_user.host +"/"+ data.Data1
      })
    })
  }
})