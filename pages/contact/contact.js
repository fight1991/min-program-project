var app = getApp()
Page({
  data: {
    // 当前选择的导航字母
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: '',
    // 导航字母
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z', '#'
    ],
    groups: [],
    orgGroups: [],
    isChoose: false,
    i: 0,
    isUnread: false,
    unReadCount: ''
  },
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.hideShareMenu()
    if (typeof options.isChoose != undefined) {
      var logdata = {}
      if (wx.getStorageSync("logdata")) {
        logdata = JSON.parse(wx.getStorageSync("logdata"))
      }
      this.setData({
        isChoose: options.isChoose,
        i: options.i,
        logdata: logdata
      })
    }
    const res = wx.getSystemInfoSync(),
      letters = this.data.letters;
    this.setData({
      windowHeight: res.windowHeight,
      windowWidth: res.windowWidth,
      pixelRatio: res.pixelRatio
    })

    const navHeight = this.data.windowHeight * 0.94, // 
      eachLetterHeight = navHeight / 26,
      comTop = (this.data.windowHeight - navHeight) / 2,
      temp = [];

    this.setData({
      eachLetterHeight: eachLetterHeight
    });
    for (let i = 0, len = letters.length; i < len; i++) {
      const x = this.data.windowWidth - (10 + 50) / this.data.pixelRatio,
        y = comTop + (i * eachLetterHeight);
      temp.push([x, y]);
    }
    this.setData({
      lettersPosition: temp
    })
    this.myCard = this.selectComponent("#myCard")
    var that = this
    app.getUserInfo(function(userInfo) {
      that.data.userInfo = userInfo
      that.setData({
        user: userInfo
      })
    })

  },
  onShow: function() {
    var that = this
    that.getUnReadCount()
    wx.showLoading({
      title: '加载中...',
    })
    app.platformApi.commonApi("/user/getUserContacts", {
      "userId": "",
      "userName": ""
    }, function(data) {
      wx.hideLoading()
      if (data.code == "0000") {
        that.setData({
          groups: data.result,
          orgGroups: data.result
        })
      } else {
        wx.showToast({
          icon: "none",
          title: data.message
        })
      }
      console.log(data)
    })
  },
  tabLetter(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selected: index,
      scrollIntoView: index
    })

    this.cleanAcitvedStatus();
  },
  cleanAcitvedStatus() {
    setTimeout(() => {
      this.setData({
        selected: 0
      })
    }, 500);
  },
  touchmove(e) {
    const x = e.touches[0].clientX,
      y = e.touches[0].clientY,
      lettersPosition = this.data.lettersPosition,
      eachLetterHeight = this.data.eachLetterHeight,
      letters = this.data.letters;
    console.log(y);
    // 判断触摸点是否在字母导航栏上
    if (x >= lettersPosition[0][0]) {
      for (let i = 0, len = lettersPosition.length; i < len; i++) {
        // 判断落在哪个字母区域，取出对应字母所在数组的索引，根据索引更新selected及scroll-into-view的值
        const _y = lettersPosition[i][1], // 单个字母所处高度
          __y = _y + eachLetterHeight; // 单个字母最大高度取值范围， 50为字母高50rpx
        if (y >= _y && y <= __y) {
          this.setData({
            selected: letters[i],
            scrollIntoView: letters[i]
          });
          break;
        }
      }
    }
  },
  touchend(e) {
    this.cleanAcitvedStatus();
  },
  showNewContact: function() {
    wx.navigateTo({
      url: 'add-contact'
    })
  },
  showMyCard: function() {
    var that = this
    app.httpUtils.get("User", {
      scene: "10000",
      user_id: that.data.userInfo.userName
    }, function(res) {
      if (res.Success) {
        var urlPath = app.globalData.cms_user.host + res.Data5.replace(/\\/g, '/')
        console.log(urlPath)
        that.myCard.setImgSource(urlPath)
        that.myCard.show()
      }
    })

  },
  showContactInfo: function(e) {
    var that = this
    var userId = e.currentTarget.dataset.id
    console.log(userId)
    if (this.data.isChoose) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]
      var contactModel = prevPage.data.contactModel
      app.platformApi.commonApi("/user/getUserDetail", {
        "userId": userId,
        "userName": ""
      }, function(data) {
        if (data.code != "0000" || data.result.length == 0) {
          return
        }
        if (that.data.i == 1) {
          if (that.data.logdata.id == "4") {
            var temp = prevPage.data.role
            var index = that.data.logdata.index
            temp[index][that.data.logdata.v1] = data.result[0].userName
            temp[index][that.data.logdata.v2] = data.result[0].mobile
            temp[index][that.data.logdata.uuid] = userId
            console.log(temp)
            prevPage.setData({
              role: temp
            })
          } else {
            var temp = prevPage.data.reqData
            console.log(temp)
            temp[that.data.logdata.v1] = data.result[0].userName
            temp[that.data.logdata.v2] = data.result[0].mobile
            temp[that.data.logdata.uuid] = userId
            console.log(temp)
            prevPage.setData({
              reqData: temp
            })
          }
          wx.navigateBack({
            delta: 1
          })
        } else if (that.data.i == 2) {
          prevPage.setData({
            isFromContact: true,
            contactModel: {
              wechat: false,
              name: data.result[0].userName,
              mobile: data.result[0].mobile,
              userId: userId
            },

            // corpId: corpData.corpId,
            // corpName: corpData.corpName,
          })
          app.platformApi.commonApi("/user/getUserDefaultCorp", {}, function(data) {
            if (data.code == '0000') {
              prevPage.setData({
                corpId: data.result == null ? '' : data.result.corpId,
                corpName: data.result == null ? '' : data.result.corpName
              })
            }

          })
          wx.navigateBack({
            delta: 1
          })
        } else if (that.data.i == 3) {
          that.updateParticipant(data)
        } else {
          var address = ''
          if (data.result[0].corps.length == 1) {
            if (data.result[0].corps[0].contactWay.length == 1) {
              address = data.result[0].corps[0].contactWay[0].address
            }
          }
          if (data.result[0].corps.length > 1) {
            wx.navigateTo({
              url: '/pages/account/address-select?userId=' + userId + '&isFromContact=' + true,
            })
            return
          }
          prevPage.setData({
            isFromContact: true,
            address: address,
            contactModel: {
              name: data.result[0].userName,
              mobile: data.result[0].mobile,
              userId: userId,
            }
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../contact/detail?userId=' + userId
      })
    }
  },
  updateParticipant: function(userData) {

    var that = this
    that.data.logdata.roleContact = userData.result[0].userName
    that.data.logdata.roleMobile = userData.result[0].mobile
    that.data.logdata.newUserId = userData.result[0].userId
    app.platformApi.logistics("/logistics/updateParticipant", that.data.logdata, function(data) {
      if (data.code == '0000') {
        wx.showToast({
          title: '操作成功',
          icon: "none"
        })

        var _roleType = 7
        if (that.data.logdata.roleType == 1) {
          _roleType = 5
        } else if (that.data.logdata.roleType == 2) {
          _roleType = 6
        }

        wx.request({
          url: app.globalData.cms_user.host + "/wechat/SendMsg",
          data: {
            logPid: that.data.logdata.logPid,
            users: [{
              userId: that.data.logdata.newUserId,
              name: that.data.logdata.roleContact,
              roleId: _roleType,
            }],
            unionid: wx.getStorageSync("unionid"),
            trackingNo: that.data.logdata.trackingNo
          },
          method: "POST",
          dataType: "json",
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res.data)
          }
        })

        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: "none"
        })
      }
    })
  },
  download: function() {
    this.myCard.hide()
  },
  search: function(e) {
    var key = e.detail.value.trim()
    var tmp = []
    if (key.length == 0) {
      tmp = this.data.orgGroups
    } else {
      this.data.orgGroups.forEach(function(group) {
        var users = []
        group.users.forEach(function(usr) {
          if (usr.userName.indexOf(key) > -1) {
            users.push(usr)
          }
        })
        if (users.length > 0) {
          tmp.push({
            groupName: group.groupName,
            users: users
          })
        }
      })
    }
    this.setData({
      groups: tmp
    })
  },
  onShareAppMessage: function(res) {
    if (res.target.dataset.sence) {
      return this.invitation()
    } else {
      this.myCard.hide()
      return {
        title: '我的名片',
        path: '/pages/accountBind/accountBind?scene=' + this.data.userInfo.userName,
        imageUrl: "https://51baoguan.cn/content/images/themes/A/addFirends.jpg",
      }
    }
  },
  invitation: function() {
    var that = this
    var uuid = app.utils.getGuid()
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]
    setTimeout(function() {
      if (that.data.i == 1) {
        if (that.data.logdata.id == "4") {
          var temp = prevPage.data.role
          var index = that.data.logdata.index
          temp[index][that.data.logdata.v1] = "微信已邀请"
          temp[index][that.data.logdata.v2] = ""
          temp[index][that.data.logdata.uuid] = uuid
          console.log(temp)
          prevPage.setData({
            role: temp
          })
        } else {
          var temp = prevPage.data.reqData
          console.log(temp)
          temp[that.data.logdata.v1] = "微信已邀请"
          temp[that.data.logdata.v2] = ""
          temp[that.data.logdata.uuid] = uuid
          console.log(temp)
          prevPage.setData({
            reqData: temp
          })
        }
        wx.navigateBack({
          delta: 1
        })
      } else if (that.data.i == 2) {
        prevPage.setData({
          isFromContact: true,
          contactModel: {
            wechat: true,
            userId: uuid,
            name: "微信已邀请"
          }
        })
        wx.navigateBack({
          delta: 1
        })
      } else if (that.data.i == 3) {
        var data = {
          result: []
        }
        data.result.push({
          userName: "微信已邀请",
          mobile: "",
          userId: uuid,
        })
        that.updateParticipant(data)
      }
    }, 1000)

    console.log('/pages/invitation/invitation?logPid=' + that.data.logdata.logPid + '&roleList=' + uuid)
    return {
      title: '委托邀请',
      path: '/pages/invitation/invitation?logPid=' + that.data.logdata.logPid + '&roleList=' + uuid,
      imageUrl: "https://51baoguan.cn/content/images/themes/A/invite.jpg",
      // success: function(result) {
      //   console.log("微信已邀请")
      //   // let pages = getCurrentPages();
      //   // let prevPage = pages[pages.length - 2]
      //   // if (that.data.i == 1) {
      //   //   if (that.data.logdata.id == "4") {
      //   //     var temp = prevPage.data.role
      //   //     var index = that.data.logdata.index
      //   //     temp[index][that.data.logdata.v1] = "微信已邀请"
      //   //     temp[index][that.data.logdata.v2] = ""
      //   //     temp[index][that.data.logdata.uuid] = uuid
      //   //     console.log(temp)
      //   //     prevPage.setData({
      //   //       role: temp
      //   //     })
      //   //   } else {
      //   //     var temp = prevPage.data.reqData
      //   //     console.log(temp)
      //   //     temp[that.data.logdata.v1] = "微信已邀请"
      //   //     temp[that.data.logdata.v2] = ""
      //   //     temp[that.data.logdata.uuid] = uuid
      //   //     console.log(temp)
      //   //     prevPage.setData({
      //   //       reqData: temp
      //   //     })
      //   //   }
      //   //   wx.navigateBack({
      //   //     delta: 1
      //   //   })
      //   // } else if (that.data.i == 2) {
      //   //   prevPage.setData({
      //   //     isFromContact: true,
      //   //     contactModel: {
      //   //       wechat: true,
      //   //       userId: uuid,
      //   //       name: "微信已邀请"
      //   //     }
      //   //   })
      //   //   wx.navigateBack({
      //   //     delta: 1
      //   //   })
      //   // } else if (that.data.i == 3) {
      //   //   var data = {
      //   //     result: []
      //   //   }
      //   //   data.result.push({
      //   //     userName: "微信已邀请",
      //   //     mobile: "",
      //   //     userId: uuid,
      //   //   })
      //   //   that.updateParticipant(data)
      //   // }
      // },
      // fail: function(result) {
      //   console.log("转发失败")
      // }
    }
  },
  getNewContact: function() {
    var that = this
    app.platformApi.commonApi("/user/getNewContacts", {}, function(data) {
      if (data.code == "0000") {
        if (data.result.length > 0) {
          for (var i = 0; i < data.result.length; i++) {
            if (data.result[i].status != 'agree') {
              that.setData({
                isUnread: true
              })
              break
            }
          }
        }
      }
    })
  },
  getUnReadCount() {
    var that = this
    app.platformApi.commonApi("/user/getUnreadApplyCount", {}, function(data) {
      if (data.result > 0) {
        if (data.result >= 100) {
          that.setData({
            unReadCount: '●●'
          })

        } else {
          that.setData({
            unReadCount: data.result
          })
        }

      } else {
        that.setData({
          unReadCount: ''
        })
      }
    })
  }
})