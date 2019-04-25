// accountInfo.js
var app = getApp()
Page({
  data: { 
    index: '',
    userInfo: {},
    currentUser: {}, 
    showArray: [],
  },
  onLoad: function () {
    var da = new Date()
    var currHour = da.getHours()
    console.log(currHour)
    if (6 < currHour && currHour< 18) {
      this.setData({
        isDayTime: true
      })
    } else {
      this.setData({
        isDayTime: false
      })
    } 
    wx.setNavigationBarTitle({
      title: app.translater("我的账户")
    })
    app.authorize()
    var that = this
    app.utils.getSystemInfo(that)
  },
  onShow:function(){
    var that = this 
    app.getWechatUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo,
        site: userInfo.site,
        theme: userInfo.theme
      })
      console.log(that.data.currentUser.sites)
    })
    var sites = that.data.currentUser.sites
    for (var i = 0; i < sites.length; i++) {
      if (that.data.site == sites[i]) {
        console.log("下标为：" + i + ",值为：" + sites[i])
        that.setData({
          index: i
        })
      }
    }
  },
  showWin:function(){
    if (this.data.currentUser.sites.length<2){
      return
    }
    var currentStatu = "open"
    this.util(currentStatu)
  },
  chooseSite: function (e) {
    var item = e.currentTarget.id
    this.setData({
      site: item
    })
    var user = this.data.currentUser
    user.site = item
    app.setUserInfo(user)
    var currentStatu = "close"
    this.util(currentStatu)
  },
  enterItem: function (e) {
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },
  unBind: function () {
    var that = this
    app.httpUtils.unbind(that.data.currentUser.host, that.data.currentUser, function (data) {
      if (data.Success) {
        wx.reLaunch({
          url: '../accountBind/accountBind',
        })
      } else {
        wx.showToast({
          title: '操作失败:' + data.ErrorMessage,
        })
      }
    }, function () { 
    }) 
  },
  closeBox: function (e) {
    console.log(e) 
    var currentStatu = e.currentTarget.dataset.statu
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    var that = this
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.opacity(0).rotateX(-100).step()
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step()
      this.setData({
        animationData: animation
      })
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false,
            scroll: true
          }
        )
      }
    }.bind(this), 200)
    if (currentStatu == "open") {
      that.setData({
        scroll: false,
        showModalStatus: true
      })
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: '智慧通关服务',
      path: '/pages/accountBind/accountBind'
    }
  },
  shared: function () {
    app.httpUtils.preview("https://51baoguan.cn/content/images/themes/A/share_code.jpg", '.png')
  },
  touchStart: function (e) {
    this.setData({
      touchStart: e.touches[0].clientY,
      touchX: e.touches[0].clientX
    })
  },
  touchMove: function (e) {
    var that = this
    app.utils.tarBarTouchMove(that, e)
  },
  touchEnd: function () {
    var that = this
    var url_left = '../index/index'
    var url_right = '../home/home'
    app.utils.tarBarTouchEnd(that, url_left, url_right)
  },
  showActivity: function (e) {
    var title =  e.currentTarget.dataset.title
    var url = e.currentTarget.dataset.url+'?id=2522'
    wx.setStorageSync("activity_title", title)
    wx.setStorageSync("activity_url", url)
    wx.navigateTo({
      url: '../../pages/activity/activity',
    })
  },
})