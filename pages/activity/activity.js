var app = getApp()
Page({
 
  data: {
    url:""
  },
 
  onLoad: function (options) {  
    var title = wx.getStorageSync("activity_title")
    var url = wx.getStorageSync("activity_url")
    wx.setNavigationBarTitle({
      title: title,
    })
    console.log(title) 
    var that =this
    app.getUserInfo(function (userInfo) { 
      if(url.indexOf('?')>-1){
        url = url + "&user_id=" + userInfo.userName
      }else{
        url = url + "?user_id=" + userInfo.userName
      }
      console.log(url)
      that.setData({
        theme: userInfo.theme,
        userInfo: userInfo,
        url: url
      })
    }) 
  }
})