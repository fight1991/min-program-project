var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    sms_code: '45316753454a77413574307770626161526846525a73433975646f3474777a59574342334f4f55785245736c635842712b7949554543386b57704764744c5a314d31384d2b4f6e6176505838da787976785a4c446b2f6848344e755964494d4374',
  }, 
  confirm: function() {
    var info = JSON.parse(wx.getStorageSync("person_info"))
    this.data.mobile = info.mobile
    this.data.name = info.name
    this.data.companyName = info.companyName
    wx.showLoading({
      title: '跳转中...',
    })
    this.regist() 
  },
  regist: function() {
    var that = this
    app.platformApi.commonApi("/login/regist", {
      "callSource": "2",
      "callbackUrl": "",
      "code": this.data.sms_code,
      "mobileCode": this.data.mobile,
      "password": "",
      "sysId": "004"
    }, function(data) {
      if (data.code == "0000") {
        that.setRedirect(data.result.ssoToken,true)
      } else if (data.code == "0003") {
        that.autoLogin() 
      }
    })
  }, 
  autoLogin: function() {
    var that = this
    app.platformApi.commonApi("/login/login", {
      "callSource": "2",
      "callbackUrl": "",
      "code": this.data.sms_code,
      "mobileCode": this.data.mobile,
      "password": "",
      "sysId": "004"
    }, function(data) { 
        if (data.code == "0000") {
          that.setRedirect(data.result.ssoToken,false)
        } else if (data.code == "0003") { 
          wx.reLaunch({
            url: '/pages/accountBind/accountBind',
          })
        } 
    })
  },
  addUserInfo:function(){
    app.platformApi.commonApi("/user/updateUserInfo", {
      countryNo: "",
      emailAddress: "",
      idCard: "",
      sex: "",
      userName: this.data.name,
      userPhoto: ""
      },function(){ 
    })
  },
  addCorpInfo: function () {
    app.platformApi.commonApi("/corp/addSelectCorpBindUser", {
      corpId: 0,
      corpName: this.data.companyName,
      defaulCorp: "",
      registerClient: "2",
      registerSource: "004"
    }, function () {
    })
  },
  setRedirect: function (ssoToken, regist) {
    app.platformApi.setToken(ssoToken)  
    if (regist){
      this.addUserInfo()
      this.addCorpInfo()
    }
    app.httpUtils.get("User", {
      "ssoToken": ssoToken
    }, function(data) {
      if (data.Success) {
        data = data.Data5
        console.log(data)
        var user = app.globalData.cms_user
        user.userName = data.UserID
        user.email = data.Email
        user.mobile = data.Mobile
        user.company = ''
        user.AccessToken = data.AccessToken
        user.sites = data.Sites
        user.site = data.CurrentSite
        user.token = data.PlatformToken
        user.unionid = data.WechatUnionid
        user.openid = data.WechatOpenid
        user.platformHost = data.PlatformHost
        app.setUserInfo(user)
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })
  }
})