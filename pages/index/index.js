//index.js
//获取应用实例
var app = getApp()
var flag = true
var color = ""
Page({
  //传送的参数
  data: {
    timer: '',
    animation:'',
    searchModel: {
      enable: true,
      PageIndex: 1,
      PageSize: 3,
      category: "",
    },
    animationData:{},
    winHeight: app.globalData.winHeight,
    winWidth:app.globalData.winWidth,
    status: false,
    activitys: [],
    datas1: [],
    datas2: [],
    datas3: [],
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    theme: "",
    table: []
  },
  onLoad: function(options) {
    wx.getSystemInfo({
      success(res) {
        console.log(res)
      }
    })
    app.authorize()
    var that = this
    app.getUserInfo(function(userInfo) {
      that.setData({
        theme: userInfo.theme,
        userInfo: userInfo
      })
    })
    app.utils.getSystemInfo(that)
    that.sceneLoad()
  },
  // 设置动画
  getAnimation() {
    let that = this
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '50% 50% 0'
    })
    // 横向的最大距离
    let maxX = this.data.winWidth
    // 竖直方向的最大距离
    let maxY = 200
    animation.translate(-maxX/2 + 45, -100).step({ duration: 3000 })
    animation.translate(maxX/2, -200).step({ duration: 3000 })
    animation.translate(22, 0).step({ duration: 3000 })
    that.setData({
      animationData: animation.export()
    })
    this.data.timer = setInterval(() => {
      // 横向的最大距离
      let maxX = this.data.winWidth
      // 竖直方向的最大距离
      let maxY = 200
      animation.translate(-maxX/2 + 45, -100).step({ duration: 3000 })
      animation.translate(maxX/2, -200).step({ duration: 3000 })
      animation.translate(22, 0).step({ duration: 3000 })
      that.setData({
        animationData: animation.export()
      })
    },9000)
  },
  // 获取首页轮播图
  getBannerList () {
    wx.ajax({
      url:'API@plat-manager/carouselManager/showCarousel',
      data:{
        "code": 'CONFIG:WX_SY_PAGE'
      },
      success:res => {
        console.log(res)
        if(res.result) {
          this.setData({
            activitys:res.result
          })
        }else {
          this.setData({
            activitys:[]
          })
        }
      }
    })
  },
  sceneLoad: function() {
    if (wx.getStorageSync("invitation")) {
      var invitation = JSON.parse(wx.getStorageSync("invitation"))
      var roleList = invitation.roleList.join(',')
      wx.navigateTo({
        url: '/pages/invitation/invitation?roleList=' + roleList + '&logPid=' + invitation.logPid + '&sence=' + 'logged',
      })
      wx.removeStorageSync("invitation")
    }
    var that = this
    if (wx.getStorageSync("addContact")) {
      var user_id = wx.getStorageSync("addContact")
      app.platformApi.commonApi("/user/getUserName", {
        userId: user_id
      }, function(data) {
        if (data.code == "0000") {
          user_id = data.result.userName
        }
        user_id = '是否申请添加【' + user_id + '】为好友？'
        that.setData({
          newContactName: user_id
        })
        that.myDialog = that.selectComponent("#myDialog")
        that.myDialog.showDialog()

      })
    }
  },
  reject: function(invitation) {
    app.platformApi.logistics("/logistics/refuseLogistics", {
      "logPid": invitation.logPid,
      "roleList": invitation.roleList
    }, function(data) {
      if (data.code == '0000') {
        wx.showToast({
          title: '拒接成功',
          icon: "none"
        })
      }
      wx.removeStorageSync("invitation")
    })
  },
  accept: function(invitation) {
    app.platformApi.logistics("/logistics/takingLogistics", {
      logPid: invitation.logPid,
      roleList: invitation.roleList
    }, function(data) {
      if (data.code == '0000') {
        wx.showToast({
          title: '接单成功',
          "icon": "none"
        })
        if (data.result == "1") {
          wx.navigateTo({
            url: '/pages/invitation/assignRoles'
          })
        } else {
          wx.removeStorageSync("invitation")
          wx.navigateTo({
            url: '/pages/logisticsTracking/logisticsTracking'
          })
        }
      } else {
        wx.showToast({
          title: data,
          "icon": "none"
        })
        wx.removeStorageSync("invitation")
      }
    })
  },
  addNewContactCheck: function() {
    var that = this
    app.platformApi.commonApi("/user/saveUserContact", {
      "userId": wx.getStorageSync("addContact"),
      "userName": ""
    }, function(data) {
      if (data.code == "0000") {
        wx.showToast({
          icon: "none",
          title: "已发送好友申请",
          duration: 2000
        })
      } else {
        wx.showToast({
          icon: "none",
          title: data.message
        })
      }
      console.log(data)
      that.cancleAddContact()
    })

  },
  cancleAddContact: function() {
    wx.removeStorageSync("addContact")
    this.myDialog.hideDialog()
  },
  onShow: function() {
    if(!this.data.timer) {
      this.getAnimation()
    }
    this.getShotcutMenu()
    var path = "Information"
    var that = this
    this.initData(that, 'PolicyLaw', path)
    this.initData(that, 'Information', path)
    this.initData(that, 'IndustryNews', path)
    // this.initActivityData()
    this.getBannerList()
    this.getStatus()
    console.log(app.utils.formatDateTime(new Date()) + ": app index-page show")
  },
  onHide: function() {
    clearInterval(this.data.timer)
    this.data.timer = 0
    this.setData({
      animationData: {}
    })
    // this.data.animation.translate(0, 0).step({duration:3000})
  },
  enterItem: function(e) {
    var url = e.currentTarget.dataset.url
    var title = e.currentTarget.dataset.title

    if (url.length == 0) {
      return
    }
    wx.navigateTo({
      url: url + "?title=" + title,
    })
  },
  goCurrentUrl(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url:'/'+url
    })
  },
  details: function(e) {
    var activity = e.currentTarget.dataset.activity
    var _type = e.currentTarget.dataset.type
    var isNavigateTo = true
    if (activity == '../excellent/excellent') {
      app.platformApi.commonApi("/declarant/getDeclarantInfo", {}, function(data) {
        if (data.code == '0001') {
          wx.navigateTo({
            url: '../../pages/excellent/unexcellent',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        } else {
          if (_type == 2) {
            wx.navigateTo({
              url: activity
            })
          } else {
            var title = e.currentTarget.dataset.title
            var url = e.currentTarget.dataset.url
            console.log(title)
            console.log(url)
            wx.setStorageSync("activity_title", title)
            wx.setStorageSync("activity_url", url)
            wx.navigateTo({
              url: '../../pages/activity/activity'
            })
          }
        }
      })
    } else if (activity == '../excellentForBusiness/excellentForBusiness') {
      app.platformApi.commonApi("/declarantCorp/checkCorp", {}, function(data) {
        if (data.result == 'false') {
          wx.setStorageSync("CorpIsGood", '0')
          app.platformApi.commonApi("/declarantCorp/checkCorp", {}, function(data) {
            if (data.result == 'false') {
              wx.navigateTo({
                url: '../../pages/excellentForBusiness/unexcellent',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            } else {
              wx.setStorageSync("CorpIsGood", '1')
              if (_type == 2) {
                wx.navigateTo({
                  url: activity
                })
              } else {
                var title = e.currentTarget.dataset.title
                var url = e.currentTarget.dataset.url
                console.log(title)
                console.log(url)
                wx.setStorageSync("activity_title", title)
                wx.setStorageSync("activity_url", url)
                wx.navigateTo({
                  url: '../../pages/activity/activity'
                })
              }
            }
          })
        } else {
          if (_type == 2) {
            wx.navigateTo({
              url: activity
            })
          } else {
            var title = e.currentTarget.dataset.title
            var url = e.currentTarget.dataset.url
            console.log(title)
            console.log(url)
            wx.setStorageSync("activity_title", title)
            wx.setStorageSync("activity_url", url)
            wx.navigateTo({
              url: '../../pages/activity/activity'
            })
          }
        }
      })
    } else {
      if (_type == 2) {
        wx.navigateTo({
          url: activity
        })
      } else {
        var title = e.currentTarget.dataset.title
        var url = e.currentTarget.dataset.url
        console.log(title)
        console.log(url)
        wx.setStorageSync("activity_title", title)
        wx.setStorageSync("activity_url", url)
        wx.navigateTo({
          url: '../../pages/activity/activity'
        })
      }
    }
  },
  pressing: function(e) {},
  touchBegin: function(e) {
    var that = this
    app.utils.touchBegin(that, e)
  },
  othertouchBegin: function(e) {
    var that = this
    app.utils.othertouchBegin(that, e)
  },
  touchOver: function(e) {
    var that = this
    app.utils.touchOver(that, e)
  },
  othertouchOver: function(e) {
    var that = this
    app.utils.othertouchOver(that, e)
  },
  touchStart: function(e) {
    this.setData({
      touchStart: e.touches[0].clientY,
      touchX: e.touches[0].clientX
    })
  },
  touchMove: function(e) {
    var that = this
    app.utils.tarBarTouchMove(that, e)
  },
  touchEnd: function() {
    var that = this
    var url_left = '../pubpara/pubpara'
    var url_right = '../account/account'
    app.utils.tarBarTouchEnd(that, url_left, url_right)
  },
  initData: function(that, flag, path) {
    var that = this
    that.data.searchModel.category = flag
    wx.showLoading({
      title: '加载中...',
    })
    app.httpUtils.get(path, that.data.searchModel, function(data) {
      if (data.Success) {
        that.setData({
          datas: []
        })
        var datas = that.data.datas
        data.Data5.rows.forEach(function(val, index) {
          val.EditTime = app.utils.dateFormatter(val.EditTime)
          datas.push(val)
        })
        if (flag == "Information") {
          that.setData({
            datas1: datas,
          })
        } else if (flag == "PolicyLaw") {
          that.setData({
            datas2: datas,
          })
        } else if (flag == "IndustryNews") {
          that.setData({
            datas3: datas,
          })
        }
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
      wx.hideLoading()
    })
  },
  getShotcutMenu: function() {
    var that = this
    app.httpUtils.get("UserMenu", {
      "user_id": this.data.userInfo.userName,
      type: "02"
    }, function(data) {
      if (data.Data5) {
        var tables = []
        var count = Math.ceil(data.Data5.length / 5)
        if (count == 0) {
          var nrow = []
          for (var i = 0; i < 5; i++) {
            if (i == 0) {
              nrow.push({
                id: "noe",
                name: "自定义",
                normal: "index/self-defined.png",
                pressed: "index/self-defined.png",
                state: true,
                url: "../custom/custom"
              })
            } else {
              nrow.push({
                id: "noe",
                name: "",
                normal: "",
                pressed: "",
                state: false,
                url: "",
              })
            }
          }
          tables.push(nrow)
        }
        for (var i = 0; i < count; i++) {
          var total = (i + 1) * 5
          if (total > data.Data5.length) {
            total = data.Data5.length
          }
          var table = []
          for (var j = i * 5; j < total; j++) {
            var item = data.Data5[j]
            var tmpp = {
              id: item["ID"],
              name: item["NAME"],
              normal: item["NORMAL_ICON"],
              pressed: item["PRESSED_ICON"],
              state: true,
              url: ".." + item["URL"],
              PID: item["PID"]
            }
            if (tmpp.name.length > 4) {
              tmpp.name1 = tmpp.name.substring(0, 4)
              tmpp.name2 = tmpp.name.substring(4)
            }
            table.push(tmpp)
          }
          var temp = 5 - table.length
          if (temp == 0 && i == count - 1) {
            tables.push(table)
            var nrow = []
            for (var i = 0; i < 5; i++) {
              if (i == 0) {
                nrow.push({
                  id: "noe",
                  name: "自定义",
                  normal: "index/self-defined.png",
                  pressed: "index/self-defined.png",
                  state: true,
                  url: "../custom/custom"
                })
              } else {
                nrow.push({
                  id: "noe",
                  name: "",
                  normal: "",
                  pressed: "",
                  state: false,
                  url: ""
                })
              }
            }
            tables.push(nrow)
          } else {
            for (var n = 0; n < temp; n++) {
              if (n == 0) {
                table.push({
                  id: "noe",
                  name: "自定义",
                  normal: "index/self-defined.png",
                  pressed: "index/self-defined.png",
                  state: true,
                  url: "../custom/custom"
                })
              } else {
                table.push({
                  id: "noe",
                  name: "",
                  normal: "",
                  pressed: "",
                  state: false,
                  url: ""
                })
              }
            }
            tables.push(table)
          }

        }
        that.setData({
          table: tables
        })
      }
    })
  },
  initActivityData: function() {
    var that = this
    app.httpUtils.get("Activity", {
      role_id: "00000000",
      user_id: that.data.userInfo.userName
    }, function(data) {
      console.log('***************')
      console.log(data.Data5.length)
      console.log('***************')
      that.setData({
        activitys: data.Data5,
      })
    })
  },
  getStatus: function() {
    var that = this
    wx.ajax({
      url: 'API@plat-manager/config/queryConfigList',
      data: {
        condition: 'WX_MSG_SHOW', 
        page: {
          pageSize:10,
          pageIndex: 1
        } },
      success: res => {
        that.setData({
          status: res.result[0].configValue === 'true'
        })
      }
    })
    // app.httpUtils.get("Activity", {
    //   flag: "status",
    //   user_id: that.data.userInfo.userName
    // }, function(data) {
    //   that.setData({
    //     status: data.Data5
    //   })
    // })
  }
})