var app = getApp()
Page({
  data: {
    isShow: false,
    searchModel:{}
  },
  onLoad: function (options) {
    var pages = getCurrentPages()    //获取加载的页面
    console.log(pages) 
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo
      })
    }) 
  }, 
  scanCode: function (e) { 
    var key = e.currentTarget.dataset.scan
    var that = this
    app.utils.scan(that, key)
  },
  bindData: function (e) {
    var that = this
    app.utils.bindData(that, e)
  },
  search: function (e) {
    var that = this
    var entry_id = that.data.searchModel.entry_id 
    if (typeof entry_id == "undefined" || entry_id == "" || entry_id.length != 18 || (entry_id.substring(8, 9) != 0 && entry_id.substring(8, 9) != 1))    {
      wx.showToast({
        icon: 'none',
        title: '报关单号格式不正确',
      })
    } else {
      wx.showLoading({
        title: '查询中...',
      })
      var user_id = that.data.currentUser.userName
      app.httpUtils.get('SWInfo', { entry_id: entry_id,user_id:user_id,op:"01"}, function (data) {
        wx.hideLoading()
        if (data.Data5.Success) { 
          that.setData({
            isShow: true,
            item: data.Data5.Data5
          })
        } else {
          wx.showToast({
            title: data.Data5.ErrorMessage,
            icon: 'none',
            duration: 2000
          })
        }
      }) 
    }
  },
  preview:function(e){ 
    console.log(e.currentTarget.dataset)
    var url = this.data.currentUser.host + e.currentTarget.dataset.url
    console.log(url)
    app.httpUtils.preview(url, url.substring(url.lastIndexOf('.')))
  }
})