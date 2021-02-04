var httpUtils = require('/utils/http.js')
var platformApi = require('/utils/PlatformApi.js')
var utils = require('/utils/util.js')
var language = require('/utils/language.js')
//app.js
import {ajax,upload} from './utils/request.js'
// 注册网络请求方法
wx.ajax = ajax
// 注册图片上传方法
wx.upload = upload
App({
  init: function(userInfo, cb) {
    var token = ''
    var platformHost = ''
    if (userInfo) {
      token = userInfo.token
      platformHost = userInfo.platformHost
      platformApi.setHostAndToken(platformHost, token)
      if (cb) {
        cb()
      }
    } else {
      httpUtils.get('SysHost', {
        key: 'PLATFORM_HOST'
      }, function(data) {
        console.log(data.Data5)
        data.Data5 = "https://test.5itrade.cn"
        platformApi.setHostAndToken(data.Data5, token)
        if (cb) {
          cb()
        }
      })
    }
  },
  getWechatUserInfo: function(cb) {
    var that = this
    if (this.globalData.wechat_user) {
      typeof cb == "function" && cb(this.globalData.wechat_user, false)
    } else {
      wx.getUserInfo({
        withCredentials: true,
        success: function(res) {
          that.globalData.wechat_user = res.userInfo
          typeof cb == "function" && cb(res.userInfo, false)
        },
        fail: function(res) {
          typeof cb == "function" && cb({}, true)
        }
      })
    }
  },
  setWechatUserInfo: function(userInfo) {
    this.globalData.wechat_user = userInfo
  },
  getUserInfo: function(cb) {
    typeof cb == "function" && cb(this.globalData.cms_user)
  },
  setUserInfo: function(userInfo) {
    this.globalData.cms_user = userInfo
    httpUtils.setToken(userInfo.AccessToken)
    this.init(userInfo)
  },
  authorize: function() {
  },
  searchModel: {
    enable: true,
    PageIndex: 1,
    pageSize: 10
  },
  globalData: {
    winHeight:400,
    winWidth: '',
    isAllRecord: false,
    language: 'zh_CN',
    wechat_user: null,
    cms_user: {
      userName: '',
      email: '',
      site: '',
      sites: [],
      host: 'https://51baoguan.cn',
      theme: 'https://51baoguan.cn/content/images/themes/A/'
    }
  },
  onLaunch: function() {
    console.log(utils.formatDateTime(new Date())+": app is start")
    this.globalData.cms_user.host = 'https://51baoguan.cn:8091'
    this.globalData.cms_user.theme = 'https://51baoguan.cn:8091/content/images/themes/A/' 
    // this.globalData.cms_user.host = 'http://localhost:33796/'
    httpUtils.setApiUrl(this.globalData.cms_user.host + "/api/Interop/")
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.language = res.language
        that.globalData.winHeight = res.windowHeight
        that.globalData.winWidth = res.windowWidth
      }
    })
  },
  httpUtils: httpUtils,
  utils: utils,
  platformApi: platformApi,
  translater: function(key) {
    if (this.globalData.language == 'zh_CN' || this.globalData.language == 'zh') {
      return key;
    }
    return language.translater(key)
  }
})
