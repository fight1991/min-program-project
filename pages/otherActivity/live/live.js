Page({
  data: {
    datas: [{
      title: '【第一期】中国报关协会智慧通关服务平台介绍',
      imgUrl: 'https://51baoguan.cn/content/images/themes/A/cover1.png'
    }, {
      title: '【第二期】通关服务平台-物流跟踪模块详解',
      imgUrl: 'https://51baoguan.cn/content/images/themes/A/cover2.png'
    }, {
      title: '【第三期】智慧通关服务平台-物流费用管理功能详解',
      imgUrl: 'https://51baoguan.cn/content/images/themes/A/cover3.png'
    }],
  },
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowWidth: res.windowWidth,
          heightWidth: res.windowWidth * 0.9 * 0.56
        })

      }
    })
  },
  onReady: function() {

  },
  onShow: function() {

  },
  showDetails: function(e) {
    wx.navigateTo({
      url: 'details?index=' + e.currentTarget.dataset.index,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})