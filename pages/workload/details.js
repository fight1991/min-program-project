var app = getApp()
Page({
  data: {
    obj: {},
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  onLoad: function(e) {
    app.authorize()
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function(userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    app.getUserInfo(function(userInfo) {
      that.setData({
        currentUser: userInfo
      })
    })
    that.setData({
      searchModel: {
        begin_date: e.begin_date,
        end_date: e.end_date,
        user_id: e.user_id,
        site: e.site,
        type: 'search4tab3',
        accessName: '工作量统计表详情查询'
      }
    })
    that.initData()
  },
  onShow: function() {
    wx.setStorageSync('fromDetailsToList', 'false')
  },
  initData: function() {
    var that = this
    app.httpUtils.get('Workload', that.data.searchModel, function(data) {
      if (data.Success) {
        if (data.Data5 == null) {
          that.setData({
            searchNone: true,
          })
        } else {
          that.setData({
            searchNone: false,
            obj: data.Data5,
          })
        }
      }
    })
  }
})