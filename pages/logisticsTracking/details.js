var app = getApp()
Page({
  data: {
    isshowDialog: false,
    searchNone: false,
    arr_index: 0,
    a_index: 0,
    b_index: 0,
    currentTab: '',
    searchModel: {},
    isShow: true,
    isShow4Status: false,
    isShow4UserInfo: false,
    logPid: '',
    trackingNo: '',
    transMode: '',
    trafMode: '',
    iEFlag: '',
    obj: {},
    participants: [],
    logisticsDocVO: [],
    nodeList: [],
    logData: [],
    length: '',
    nodeLength: 0,
    date: "",
    time: "",
    btnName: '',
    nodeNo: '',
    modalHidden: true,
    isOperation: false,
    isFirst: true,
    entryStatus: '',
    types: ''
  },
  scrollTop: function(e) {
    var that = this
    app.utils.scrollTop(that, e)
  },
  goTop: function(e) {
    var that = this
    app.utils.goTop(that)
  },
  onLoad: function(e) {
    var that = this
    var invitation = wx.getStorageSync("invitation")
    wx.removeStorageSync("invitation")
    if (invitation) {
      invitation = JSON.parse(invitation)
    }
    that.data.logPid = invitation.logPid
    that.data.invitation = invitation
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
    var da = new Date();
    var dates = app.utils.formatDateTime(da).split(' ')
    var date = dates[0]
    var time = dates[1].substring(0, dates[1].lastIndexOf(':'))
    this.setData({
      date: date,
      time: time,
    })
  },
  onShow: function() {
    this.setData({
      isShowCount: 10000
    })
    this.initData()
  },
  bindChange: function(e) {
    var that = this
    that.setData({
      currentTab: e.detail.current
    })
    this.onShow()
  },
  swichNav: function(e) {
    var that = this
    if (this.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  show: function(e) {
    var tr = e.currentTarget.dataset.tr
    var td = e.currentTarget.dataset.td
    app.httpUtils.preview("https://51aeo.com/APi/File/" + this.data.files[tr][td]["SEQ_NO"], this.data.files[tr][td]["FILE_TYPE"])
  },
  hide: function() {
    this.setData({
      showModalStatus: false
    })
  },
  initAnimation: function(rotate) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animation.rotateZ(rotate).step();
    this.setData({
      animationMenu: animation
    })
  },
  util: function() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation
    animation.opacity(0).rotateX(-100).step()
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function() {
      animation.opacity(1).rotateX(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    this.setData({
      showModalStatus: true
    })
  },
  initData: function() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    app.platformApi.logistics("/logistics/getLogistics", {
      logPid: that.data.invitation.logPid,
      roleList: that.data.invitation.roleList
    }, function(data) {

      if (data.code == '0000') {
        var nodeList = []
        if (data.result.sParticipantVO != null && data.result.sParticipantVO.windowStatus == '1') {
          if (that.data.isFirst) {
            that.myDialog = that.selectComponent("#myDialog")
            that.myDialog.showDialog()
          }
        }
        if (data.result.logisticsTrackingNodeVO.length == 0 || (data.result.sParticipantVO != null && data.result.sParticipantVO.btnStatus == '1')) {
          if (that.data.isFirst) {
            that.setData({
              currentTab: 1,
              isFirst: false
            })
          }
        }
        if (data.result.logisticsTrackingNodeVO.length != 0) {

          data.result.logisticsTrackingNodeVO.forEach(function(val, index) {
            if (val.nodeFirstTime == '' || val.nodeFirstTime == null) {
              val.date = ''
              val.time = ''
            } else {
              console.log()
              val.date = val.nodeFirstTime.split(' ')[0].substring(val.nodeFirstTime.split(' ')[0].indexOf('-') + 1)
              val.time = val.nodeFirstTime.split(' ')[1].substring(0, val.nodeFirstTime.split(' ')[1].lastIndexOf(':'))
              val.createTime = val.createTime.substring(0, val.createTime.lastIndexOf(':'))
            }
            nodeList.push(val)
          })
          if (that.data.isFirst) {
            that.setData({
              currentTab: 0,
              isFirst: false
            })
          }
        }
        if (data.result.trackingTime != null && data.result.trackingTime != '') {
          data.result.trackingTime = data.result.trackingTime.substring(0, data.result.trackingTime.lastIndexOf(':'))
        }
        that.setData({
          obj: data.result,
          fparticipants: data.result.fParticipantVO,
          participants: data.result.sParticipantVO,
          nodeList: nodeList,
          nodeLength: data.result.logisticsTrackingNodeVO.length,
          logisticsDocVO: data.result.logisticsDocVO,
          logPid: data.result.logPid,
          trackingNo: data.result.trackingNo,
          transMode: data.result.transMode,
          trafMode: data.result.trafMode,
          iEFlag: data.result.iEFlag,
        })

      }
      wx.hideLoading()
    })
  },
  editNode: function() {
    wx.setStorageSync("invitation", JSON.stringify({
      logPid: this.data.invitation.logPid,
      roleList: this.data.invitation.roleList
    }))
    wx.navigateTo({
      url: '/pages/invitation/assignRoles',
    })
  },
  click: function(e) {
    var that = this
    var type = e.currentTarget.dataset.type
    var detailsType = e.currentTarget.dataset.detailtype
    var indexs = e.currentTarget.dataset.indexs
    var indexss = e.currentTarget.dataset.indexss
    var isDetails = false
    that.setData({
      currindexs: indexs
    })
    var isOperation = that.data.nodeList[indexs].logisticsNodeBtnVO[indexss].controlFlag == null ? true : that.data.nodeList[indexs].logisticsNodeBtnVO[indexss].controlFlag
    that.setData({
      nodeNo: e.currentTarget.dataset.nodeno,
      isOperation: isOperation
    })
    // if (!isOperation && type == '7' && that.data.obj.role != '货主') {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '无权操作！',
    //   })
    //   return
    // }
    if (type == '5' || (type == '7' && detailsType == '5')) {
      if (type == '7') {
        isDetails = true
        var dates = that.data.nodeList[indexs].createTime.split(' ')
        var date = dates[0]
        var time = dates[1]
        that.setData({
          date: date,
          time: time,
        })
      }
      that.chooseDateTime()
    } else if (type == '4' || (type == '7' && detailsType == '4')) {
      if (type == '7') {
        isDetails = true
      }
      //预告信息
      wx.navigateTo({
        url: 'predictionInfo?logPid=' + that.data.logPid + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&iEFlag=' + that.data.iEFlag + '&transMode=' + that.data.transMode + '&trafMode=' + that.data.trafMode + '&nodeName=' + e.currentTarget.dataset.nodename + '&trackingNo=' + that.data.trackingNo + '&uploadNodeId=' + e.currentTarget.dataset.trackingnodepid + '&isDetails=' + isDetails + '&obj=' + JSON.stringify(that.data.obj) + '&indexs=' + indexs + '&isOperation=' + isOperation,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (type == '0' || (type == '7' && detailsType == '0')) {
      if ((that.data.iEFlag == 'I' && (that.data.trafMode == '5' || that.data.trafMode == '2') && 'CIF、C&F、CPT、CIP、DAT'.indexOf(that.data.transMode) >= 0)) {
        wx.showToast({
          icon: 'none',
          title: '当前物流暂不支持此功能',
          duration: 1500
        })
      } else {
        if (type == '7') {
          isDetails = true
        }

        wx.navigateTo({
          url: 'bookingInfo?logPid=' + that.data.logPid + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&iEFlag=' + that.data.iEFlag + '&transMode=' + that.data.transMode + '&trafMode=' + that.data.trafMode + '&isDetails=' + isDetails + '&obj=' + JSON.stringify(that.data.obj) + '&indexs=' + indexs + '&isOperation=' + isOperation,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    } else if (type == '1') {

      that.setData({
        btnName: e.currentTarget.dataset.btnname,
        nodeNo: e.currentTarget.dataset.nodeno,
      })
      that.bindViewTap()
    } else if (type == '2' || (type == '7' && detailsType == '2')) {
      if (type == '7') {
        isDetails = true
      }
      wx.navigateTo({
        url: 'uploader?logPid=' + that.data.logPid + '&nodeName=' + e.currentTarget.dataset.nodename + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&trackingNo=' + that.data.trackingNo + '&uploadNodeId=' + e.currentTarget.dataset.trackingnodepid + '&btnName=' + e.currentTarget.dataset.btnname + '&isDetails=' + isDetails + '&obj=' + JSON.stringify(that.data.obj) + '&indexs=' + indexs + '&isOperation=' + isOperation,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (type == '3' || (type == '7' && detailsType == '3')) {
      if (type == '7') {
        isDetails = true
      }
      wx.navigateTo({
        url: 'noInfo?logPid=' + that.data.logPid + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&entryId=' + that.data.obj.logisticsNodeInfoVO.entryId + '&isDetails=' + isDetails + '&isOperation=' + isOperation,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (type == '6') {
      if (type == '7') {
        isDetails = true
      }

      wx.navigateTo({
        url: 'noteException?logPid=' + that.data.logPid + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&trackingNo=' + that.data.obj.trackingNo + '&nodeName=' + e.currentTarget.dataset.nodename + '&users=' + that.data.nodeList[indexs].roleUserId + '&isDetails=' + isDetails,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (type == '8') {
      app.platformApi.logistics("/logistics/getLogs", {
        logPid: that.data.logPid,
        nodeNo: e.currentTarget.dataset.nodeno
      }, function(data) {
        if (data.code == '0000') {
          that.setData({
            logData: data.result
          })
        }
      })
      that.chooseLog()
    } else if (type == '10') {
      var that = this
      if (that.data.obj.logisticsNodeInfoVO.entryId == null || that.data.obj.logisticsNodeInfoVO.entryId == '') {
        wx.showToast({
          icon: 'none',
          title: '暂无数据可查',
        })
        return
      }
      that.setData({
        isShow4Status: true
      })
      wx.showLoading({
        title: '加载中...',
      })
      app.httpUtils.get('CustomsState', {
        entry_id: that.data.obj.logisticsNodeInfoVO.entryId,
      }, function(data) {
        wx.hideLoading()
        if (data.Data5.ok) {
          if (data.Data5.ENTRY_WORKFLOW[0].length == 0) {
            that.setData({
              entryStatus: '查无数据',
            })
          } else {
            that.setData({
              entryStatus: data.Data5.ENTRY_WORKFLOW[0].ENTRY_STATE,
            })
          }
        } else {
          that.setData({
            entryStatus: '查无数据',
          })
        }
      })
    } else if (type == '13' || type == '14' || (type == '7' && detailsType == '13') || (type == '7' && detailsType == '14')) {
      if (type == '7') {
        isDetails = true
      }
      that.setData({
        currnodeno: e.currentTarget.dataset.nodeno,
        currnodename: e.currentTarget.dataset.nodename,
        currisDetails: isDetails,
        currindexs: indexs,
        currisOperation: isOperation,
        currtype: type,
        currdetailsType: detailsType
      })
      if (detailsType == '13' || detailsType == '14') {
        wx.navigateTo({
          url: 'check?logPid=' + that.data.logPid + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&nodeName=' + e.currentTarget.dataset.nodename + '&isDetails=' + isDetails + '&obj=' + JSON.stringify(that.data.obj) + '&indexs=' + indexs + '&isOperation=' + isOperation + '&type=' + type + '&detailsType=' + detailsType,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      } else {
        that.myDialog4Check = that.selectComponent("#myDialog4Check")
        that.myDialog4Check.showDialog()
      }
    } else if (type == '15' || (type == '7' && detailsType == '15')) {
      if (type == '7') {
        isDetails = true
      }
      wx.navigateTo({
        url: 'taxPayment?logPid=' + that.data.logPid + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&nodeName=' + e.currentTarget.dataset.nodename + '&isDetails=' + isDetails + '&obj=' + JSON.stringify(that.data.obj) + '&indexs=' + indexs + '&isOperation=' + isOperation,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      // }
    } else if (type == '16' || (type == '7' && detailsType == '16')) {
      if (type == '7') {
        isDetails = true
      }
      wx.navigateTo({
        url: 'vehicleDelivery?logPid=' + that.data.logPid + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&nodeName=' + e.currentTarget.dataset.nodename + '&isDetails=' + isDetails + '&obj=' + JSON.stringify(that.data.obj) + '&indexs=' + indexs + '&isOperation=' + isOperation,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      // }
    } else if (type == '17' || (type == '7' && detailsType == '17')) {
      if (type == '7') {
        isDetails = true
      }
      //货物签收
      wx.navigateTo({
        url: 'goodsReceipt?logPid=' + that.data.logPid + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&nodeName=' + e.currentTarget.dataset.nodename + '&isDetails=' + isDetails + '&obj=' + JSON.stringify(that.data.obj) + '&indexs=' + indexs + '&isOperation=' + isOperation,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      // }
    } else if (type == '18' || (type == '7' && detailsType == '18')) {
      var urls = that.data.nodeList[indexs].docUrls
      if (type == '7') {
        isDetails = true
      }
      wx.navigateTo({
        url: 'docInfo?btnName=' + e.currentTarget.dataset.btnname + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&logPid=' + that.data.logPid + '&urls=' + urls.join(',') + '&isDetails=' + isDetails + '&obj=' + JSON.stringify(that.data.obj) + '&isOperation=' + isOperation,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (type == '19') {
      that.setData({
        isshowDialog: true
      })
    } else if (type == '20' || (type == '7' && detailsType == '20')) {
      if (type == '7') {
        isDetails = true
      }
      wx.navigateTo({
        url: 'pickUp?logPid=' + that.data.logPid + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&nodeName=' + e.currentTarget.dataset.nodename + '&isDetails=' + isDetails + '&obj=' + JSON.stringify(that.data.obj) + '&indexs=' + indexs + '&isOperation=' + isOperation,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (type == '21' || (type == '7' && detailsType == '21')) {
      var types = type
      if (type == '7') {
        types = detailsType
        isDetails = true
      }
      that.setData({
        types: types
      })
      wx.navigateTo({
        url: 'releContainer?logPid=' + that.data.logPid + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&nodeName=' + e.currentTarget.dataset.nodename + '&isDetails=' + isDetails + '&obj=' + JSON.stringify(that.data.obj) + '&indexs=' + indexs + '&isOperation=' + isOperation + '&type=' + types,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (type == '22') {
      if (that.data.trafMode == '2' || that.data.trafMode == '5') {
        wx.navigateTo({
          url: '../aeronaval/search?isFromLogisticsTracking=' + true + '&trafMode=' + that.data.trafMode + '&iEFlag=' + that.data.iEFlag + '&billNo=' + that.data.obj.logisticsNodeInfoVO.billNo + '&customMaster=' + that.data.obj.logisticsNodeInfoVO.customMaster + '&mawbNo=' + that.data.obj.logisticsNodeInfoVO.mawbNo + '&voyFlightNo=' + that.data.obj.logisticsNodeInfoVO.voyFlightNo,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      } else if (that.data.trafMode == '4') {
        wx.navigateTo({
          url: '../manifestInfo/search?isFromLogisticsTracking=' + true + '&billNo=' + that.data.obj.logisticsNodeInfoVO.billNo,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    } else if (type == '23') {
      wx.showLoading({
        title: '加载中...',
      })
      app.platformApi.decApi("exportFiles", {
        entryIds: [that.data.obj.logisticsNodeInfoVO.entryId],
        operationType: 'PDF'
      }, function(data) {
        wx.hideLoading()
        if (data.code == '0000') {
          if (data.result.length == 0) {
            wx.showToast({
              title: '无数据预览',
              icon: 'none'
            })
          } else {
            wx.downloadFile({
              url: data.result[0],
              success(res) {
                wx.openDocument({
                  filePath: res.tempFilePath,
                  fileType: 'pdf',
                  success: '',
                  fail: '',
                  complete: '',
                })
              }
            })
          }
        } else {
          wx.showToast({
            title: '预览失败',
            icon: 'none'
          })
        }
      })
    } else if (type == '24') {
      if (that.data.trafMode == '2' || that.data.trafMode == '5') {
        if (that.data.types == '21') {
          wx.navigateTo({
            url: '../aeronaval/search?isFromLogisticsTracking=' + true + '&trafMode=' + that.data.trafMode + '&iEFlag=' + that.data.iEFlag + '&billNo=' + that.data.obj.logisticsNodeInfoVO.linkHawbNo + '&customMaster=' + that.data.obj.logisticsNodeInfoVO.linkCustomMaster + '&mawbNo=' + that.data.obj.logisticsNodeInfoVO.linkMawbNo,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }else{
          wx.navigateTo({
            url: '../aeronaval/search?isFromLogisticsTracking=' + true + '&trafMode=' + that.data.trafMode + '&iEFlag=' + that.data.iEFlag + '&billNo=' + that.data.obj.logisticsNodeInfoVO.iairHawbNo + '&customMaster=' + that.data.obj.logisticsNodeInfoVO.iairCustomMaster + '&mawbNo=' + that.data.obj.logisticsNodeInfoVO.iairMawbNo,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      } else if (that.data.trafMode == '4') {
        wx.navigateTo({
          url: '../manifestInfo/search?isFromLogisticsTracking=' + true + '&billNo=' + that.data.obj.logisticsNodeInfoVO.linkHawbNo,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    } else if (type == '25') {
      that.setData({
        user: that.data.obj.logisticsTrackingNodeVO[indexs].roleContact,
        tel: that.data.obj.logisticsTrackingNodeVO[indexs].roleMobile,
        isShow4UserInfo: true,
      })
    } else if (type == '26' || (type == '7' && detailsType == '26')) {
      var types = type
      if (type == '7') {
        types = detailsType
        isDetails = true
      }
      that.setData({
        types: types
      })
      wx.navigateTo({
        url: 'releContainer?logPid=' + that.data.logPid + '&nodeNo=' + e.currentTarget.dataset.nodeno + '&nodeName=' + e.currentTarget.dataset.nodename + '&isDetails=' + isDetails + '&obj=' + JSON.stringify(that.data.obj) + '&indexs=' + indexs + '&isOperation=' + isOperation + '&type=' + types,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  closeStatusModel: function() {
    var that = this
    that.setData({
      isShow4Status: false
    })
  },
  closeUserInfo: function() {
    var that = this
    that.setData({
      isShow4UserInfo: false
    })
  },
  util1: function(currentStatu) {
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
    setTimeout(function() {
      animation.opacity(1).rotateX(0).step()
      this.setData({
        animationData: animation
      })
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        })
      } else if (currentStatu == "close4Log") {
        this.setData({
          showModalStatus4Log: false
        })
      }
    }.bind(this), 200)
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      })
    } else if (currentStatu == "open4Log") {
      this.setData({
        showModalStatus4Log: true
      })
    }
  },
  chooseDateTime: function(e) {
    var that = this
    var currentStatu = ''
    if (typeof e == 'undefined') {
      currentStatu = 'open'
    } else {
      currentStatu = e.currentTarget.dataset.statu
    }
    this.util1(currentStatu)
  },
  chooseLog: function(e) {
    var that = this
    var currentStatu = ''
    if (typeof e == 'undefined') {
      currentStatu = 'open4Log'
    } else {
      currentStatu = e.currentTarget.dataset.statu
    }
    this.util1(currentStatu)
  },
  initAnimation: function(rotate) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animation.rotateZ(rotate).step()
    this.setData({
      animationMenu: animation
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },

  bindViewTap: function() {
    this.setData({
      modalHidden: !this.data.modalHidden
    })

  },
  modalBindaconfirm: function() {
    var that = this
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
    app.platformApi.logistics("/logistics/conformNode", {
      logPid: that.data.logPid,
      nodeNo: that.data.nodeNo
    }, function(data) {
      if (data.code == '0000') {
        wx.showToast({
          title: data.result,
        })
        that.onShow();
      }
    })
  },
  modalBindcancel: function() {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
  },
  selectContact: function(e) {
    console.log(e)
    var roleUserId = e.currentTarget.dataset.roleuserid
    var roleType = e.currentTarget.dataset.roletype
    var otherPid = e.currentTarget.dataset.otherpid
    var status = e.currentTarget.dataset.status
    console.log(status)
    if (status == "4") {
      return
    }
    var logdata = {
      trackingNo: this.data.trackingNo,
      logPid: this.data.logPid,
      otherPid: otherPid,
      roleUserId: roleUserId,
      roleType: roleType
    }
    console.log(logdata)
    wx.setStorageSync("logdata", JSON.stringify(logdata))
    wx.navigateTo({
      url: '/pages/contact/contact?i=3&isChoose=' + true,
    })
  },
  comfirm: function() {
    var that = this
    var index = that.data.currindexs
    var nodeName = that.data.obj.logisticsTrackingNodeVO[index].nodeName
    var dateTime = that.data.date + ' ' + that.data.time + ':00'
    if (nodeName == '实际货物出发时间（ATD）') {
      var ata = that.data.obj.logisticsTrackingNodeVO[index - 1].createTime
      if (ata != null) {
        if (ata <= dateTime) {
          wx.showToast({
            icon: 'none',
            title: 'ATD要早于ATA',
          })
        } else {
          app.platformApi.logistics("/logistics/conformTimeNode", {
            date: dateTime,
            logPid: that.data.logPid,
            nodeNo: that.data.nodeNo,
          }, function(data) {
            that.hide()
            if (data.code == '0000') {
              that.onShow()
              wx.showToast({
                title: '选择成功',
              })
            }
          })
        }
      } else {
        app.platformApi.logistics("/logistics/conformTimeNode", {
          date: dateTime,
          logPid: that.data.logPid,
          nodeNo: that.data.nodeNo,
        }, function(data) {
          that.hide()
          if (data.code == '0000') {
            that.onShow()
            wx.showToast({
              title: '选择成功',
            })
          }
        })
      }
    } else if (nodeName == '实际货物到达时间（ATA）') {
      var atd = that.data.obj.logisticsTrackingNodeVO[index + 1].createTime
      if (dateTime <= atd) {
        wx.showToast({
          icon: 'none',
          title: 'ATA要晚于ATD',
        })
      } else {
        app.platformApi.logistics("/logistics/conformTimeNode", {
          date: dateTime,
          logPid: that.data.logPid,
          nodeNo: that.data.nodeNo,
        }, function(data) {
          that.hide()
          if (data.code == '0000') {
            that.onShow()
            wx.showToast({
              title: '选择成功',
            })
          }
        })
      }
    } else {
      app.platformApi.logistics("/logistics/conformTimeNode", {
        date: dateTime,
        logPid: that.data.logPid,
        nodeNo: that.data.nodeNo,
      }, function(data) {
        that.hide()
        if (data.code == '0000') {
          that.onShow()
          wx.showToast({
            title: '选择成功',
          })
        }
      })
    }

  },
  showImg: function(e) {
    var src = e.currentTarget.dataset.src
    console.log(src)

    wx.previewImage({
      current: src,
      urls: this.data.logisticsDocVO.docUrls
    })
  },
  //查看附件
  checkAccessory: function(e) {
    var ids = e.currentTarget.dataset.ids.join(',')
    var that = this
    wx.navigateTo({
      url: 'uploader?isCheck=' + true + '&ids=' + ids,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  closeLog: function() {
    this.setData({
      showModalStatus4Log: false
    })
  },
  callPhone: function(e) {
    app.utils.phoneCall(this.data.obj.mobileNo)
  },
  callPhone4User: function(e) {
    app.utils.phoneCall(e.currentTarget.dataset.usertel)
  },
  showMore: function() {
    this.setData({
      isShowCount: 15
    })
  },
  pickUp: function() {
    this.setData({
      isShowCount: 8
    })
  },
  confirmEvent: function() {
    var that = this
    this.myDialog.hideDialog();
  },
  cancelEvent: function() {
    var that = this
    that.myDialog.hideDialog();
    that.editNode()
  },
  confirmEvent4Check: function() {
    var that = this
    app.platformApi.logistics("/logistics/skipNode", {
      logPid: that.data.logPid,
      nodeNo: that.data.currnodeno
    }, function(data) {
      if (data.code == '0000') {
        wx.showToast({
          title: '操作成功',
        })
        that.onShow()
      } else {
        wx.showToast({
          icon: 'none',
          title: '操作失败',
        })
      }
    })
    this.myDialog4Check.hideDialog();

  },
  cancelEvent4Check: function() {
    var that = this
    that.myDialog4Check.hideDialog();
    wx.navigateTo({
      url: 'check?logPid=' + that.data.logPid + '&nodeNo=' + that.data.currnodeno + '&nodeName=' + that.data.currnodename + '&isDetails=' + that.data.currisDetails + '&obj=' + JSON.stringify(that.data.obj) + '&indexs=' + that.data.currindexs + '&isOperation=' + that.data.currisOperation + '&type=' + that.data.currtype + '&detailsType=' + that.data.currdetailsType,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toggleDialog() {
    this.setData({
      isshowDialog: !this.data.isshowDialog
    });
  },
  radioChange: function(e) {
    var that = this
    app.platformApi.logistics("/logistics/changeNode", {
      logPid: that.data.logPid,
      nodeNo: that.data.nodeNo,
      roleType: e.detail.value,
    }, function(data) {
      that.setData({
        isshowDialog: false,
      })
      if (data.code == '0000') {
        that.onShow()
        wx.showToast({
          title: '选择成功',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '选择成功',
        })
      }
    })
  }
})