Page({
  data: {

  },
  onLoad: function (options) {
    var pages = getCurrentPages()    //获取加载的页面
    console.log(pages) 
  },
  onUnload: function () {
    if (getCurrentPages().length > 2) { 
      var pages = getCurrentPages() 
      var nextPage = pages[pages.length - 2]; 
      console.log(nextPage)
      nextPage.setData({ 'is_back': true });
    }
  },
  tocustoms: function () {
    wx.navigateTo({
      url: 'customs',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toems: function () {
    wx.navigateTo({
      url: '../../pages/processTrade/processTrade',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})