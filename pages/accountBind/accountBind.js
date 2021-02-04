import WxValidate from '../../utils/WxValidate'
const app = getApp()
var interval = null //倒计时函数
Page({
  data: {
    date: '请选择日期',
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 60,
    currentUser: {},
    ischange: false,
    userInfo: {},
    currentUser: {
      userName: 'broker'
    },
    isLoading: true,
    isShow: false,
    error: {
      "isError": false,
      "msg": ""
    },
    isLogin: true,
    flag:''
  },
  initData: function() {
    var that = this
    app.getUserInfo(function(userInfo) {
      that.setData({
        currentUser: userInfo
      })
    })
    app.utils.getSystemInfo(that)
    app.getWechatUserInfo(function(userInfo, isShow) {
      that.setData({
        userInfo: userInfo,
        isShow: isShow
      })
      if (!isShow) {
        that.autoLogin()
      }
    })
  },
  autoLogin: function() {
    console.log(app.utils.formatDateTime(new Date()) + ": app is auto logining")
    var that = this
    app.httpUtils.login(that.data.currentUser.host, 'post', {}, function(data) {
      if (data.Success) {
        console.log(app.utils.formatDateTime(new Date()) + ": app auto login success")
        that.setUserInfo(data.Data5)
         // 跳转到人才招聘详情
            if(that.data.flag === 'resume') {
              wx.reLaunch({
                url: '/pages/jobs/jobDetails?from=zp'
              })
            }else {
              wx.reLaunch({
                url: '../../pages/index/index'
              })
            }
       
      } else {
        that.setData({
          isLoading: false
        })
      }
    }, function() {
      that.setData({
        isLoading: false
      })
    })
  },
  setUserInfo: function(data) {
    var user = this.data.currentUser
    user.host = this.data.currentUser.host
    user.userName = data.UserID
    user.name = data.UserName
    user.email = data.Email
    user.mobile = data.Mobile
    user.company = typeof data.Company == 'undefined' ? '' : data.Company
    user.AccessToken = data.AccessToken
    user.sites = data.Sites
    user.site = data.CurrentSite
    user.token = data.PlatformToken
    user.unionid = data.WechatUnionid
    user.openid = data.WechatOpenid
    user.platformHost = data.PlatformHost
    app.setUserInfo(user) 
    wx.setStorage({
      key: 'unionid',
      data: data.PlatformToken,
    })
    wx.setStorage({
      key:'mobile',
      data: data.Mobile
    })
    wx.setStorage({
      key:'userName',
      data: data.UserName
    })
    wx.setStorage({
      key:'userId',
      data: data.UserID
    })
  },
  onReady: function() {
    //获得impower组件
    this.impower = this.selectComponent("#dialog");
  },
  onLoad: function(options) {
    console.log('---------',options)
    app.init()
    console.log(app.utils.formatDateTime(new Date()) + ": app login-page Load")

    if (this.sceneLoad(options)) {
      return
    }
    // 判断是否从人才招聘过来的
    if(options.flag === 'resume') {
      this.setData({
        flag: 'resume'
      })
    }
    console.log(wx.getStorageSync("logPid"))
    wx.removeStorageSync("logPid")
    console.log(wx.getStorageSync("logPid"))
    this.initValidate()
    var that = this
    app.getUserInfo(function(userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    this.initData()
  },
  sceneLoad: function(options) {
    var that = this
    if (options.scene) {
      if (options.scene == "20181012") {
        app.httpUtils.get("Activity", {
          scene: "20181012"
        }, function(data) {
          console.log()
          wx.setStorageSync("activity_title", data.Data5.activity_title)
          wx.setStorageSync("activity_url", data.Data5.activity_url)
          wx.reLaunch({
            url: '/pages/activity/activity',
          })
        })
        return true
      } else {
        wx.setStorageSync("addContact", options.scene)
      }
    }
    return false
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.currentUser[id] = e.detail.value
  },
  showErr: function(msg) {
    var that = this
    var error = {
      "isError": true,
      "msg": msg
    }
    that.setData({
      error: error
    })
    this.showModal(error)
    setTimeout(function() {
      error = {
        "isError": false,
        "msg": msg
      }
      that.setData({
        error: error
      })
    }, 2000)
  },
  bindInfo: function(e) {
    var that = this
    wx.showLoading({
      title: '登录中...',
    })
    if (that.data.isLogin) {
      let reg = /^[0-9a-zA-Z]{6,8}$/
      if (this.data.ischange) {
        if (!this.data.currentUser.hasOwnProperty("userName") || this.data.currentUser.userName.length == 0) {
          this.showErr('用户名不能为空')
          wx.hideLoading()
          return
        }
        if (!this.data.currentUser.hasOwnProperty("password") || this.data.currentUser.password.length == 0) {
          this.showErr('密码不能为空')
          wx.hideLoading()
          return
        }
        if (!reg.test(this.data.currentUser.password)) {
          this.showErr('请输入6-8位数字或字母的密码')
          wx.hideLoading()
          return
        }
        this.data.currentUser["LoginType"] = "001"
        console.log(this.data.currentUser)
        app.httpUtils.login(that.data.currentUser.host, 'put', this.data.currentUser, function(data) {
          wx.hideLoading()
          if (data.Success) { 
            that.setUserInfo(data.Data5)
            if (data.Data5.Sites.length == 0) {
              that.showErr('企业信息尚未维护') 
            }
            // 跳转到人才招聘详情
            if(that.data.flag === 'resume') {
              wx.reLaunch({
                url: '/pages/jobs/jobDetails?from=zp'
              })
            }else {
              wx.reLaunch({
                url: '../../pages/index/index'
              })
            }
          } else {
            that.showErr(data.ErrorMessage)
          }
        })
      } else {
        var that = this
        if (!this.WxValidate.checkForm(e)) {
          const error = this.WxValidate.errorList[0]
          this.showModal(error)
          return false
        } else {
          this.data.currentUser["userName"] = this.data.currentUser["mobile"]
          this.data.currentUser["LoginType"] = "002"
          this.data.currentUser["Password"] = this.data.currentUser["verificationcode"]
          console.log(this.data.currentUser)
          app.httpUtils.login(that.data.currentUser.host, 'put', this.data.currentUser, function(data) {
            wx.hideLoading()
            if (data.Success) {
              that.setUserInfo(data.Data5)
              if (data.Data5.Sites.length == 0) {
                that.showErr('企业信息尚未维护')
              }
             
            // 跳转到人才招聘详情
            if(that.data.flag === 'resume') {
              wx.reLaunch({
                url: '/pages/jobs/jobDetails?from=zp'
              })
            }else {
              wx.reLaunch({
                url: '../../pages/index/index'
              })
            }
            } else {
              that.showErr(data.ErrorMessage)
            }
          })
        }
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '请勾选服务协议',
      })
    }
  },
  illustration: function() {
    wx.showModal({
      title: app.translater('登录说明'),
      showCancel: false,
      content: app.translater('登录的账号密码即为智慧通关服务平台账号密码'),
    })
  },
  contactUs: function() {
    wx.showModal({
      content: app.translater('客服热线') + '：400-928-2077',
      confirmText: '拨打',
      success: function(res) {
        if (res.confirm) {
          app.utils.phoneCall("400-928-2077")
        }
      }
    })
  },
  changelogin: function() {
    var that = this
    that.data.currentUser.password = ''
    that.data.currentUser.verificationcode = ''

    if (that.data.ischange){
       that.data.currentUser.mobile = that.data.currentUser.userName
    }else{
      that.data.currentUser.userName = that.data.currentUser.mobile
    } 
    that.setData({
      ischange: !that.data.ischange,
      currentUser: that.data.currentUser
    })
  },
  step1: function() {
    wx.navigateTo({
      url: '../../pages/register/register',
    })
  },
  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: that.data.currentTime,
          disabled: false
        })
      }
    }, 1800)
  },
  getVerificationCode() {
    var that = this    
    that.setData({
      disabled: true
    })
    app.httpUtils.get('Register', {
      mobile: that.data.currentUser.mobile,
      sms_type: '002'
    }, function(data) {
      if (data.Data5.Success) {
        that.setData({
          currentTime: 60
        })
        that.getCode();
      } else {
        that.setData({
          currentTime:0
        })
        that.getCode();
        var ErrorMessage = data.Data5.ErrorMessage
        if (ErrorMessage.indexOf('触发') > -1) {
          ErrorMessage = '验证码获取频繁，请稍候再试'
        }
        wx.showToast({
          icon: 'none',
          title: ErrorMessage
        })
      }
    })
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      mobile: {
        required: true,
        tel: true,
      },
      verificationcode: {
        required: true,
      },
    }
    const messages = {
      mobile: {
        required: "手机号码不为空",
      },
      verificationcode: {
        required: "验证码不为空",
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
      duration: 1000
    })
  },
  resetpw: function() {
    wx.navigateTo({
      url: '../resetpw/resetpw',
    })
  },
  openChange: function(e) {
    if (e.detail.value.length == 0) {
      this.data.isLogin = false
    } else {
      this.data.isLogin = true
    }
  },
  showActivity: function(e) {
    var title = e.currentTarget.dataset.title
    var url = e.currentTarget.dataset.url + '?id=2522'
    wx.setStorageSync("activity_title", title)
    wx.setStorageSync("activity_url", url)
    wx.navigateTo({
      url: '../../pages/activity/activity'
    })
  },
})