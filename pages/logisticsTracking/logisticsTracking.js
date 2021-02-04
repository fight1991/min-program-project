var app = getApp()
Page({
  issearch: 'false',
  data: {
    searchData: {
      end_date: '',
      begin_date: '',
      i_e_flag: '',
      trafMode: '',
      transMode: ''
    },
    btnIsShow: false,
    searchNone: false,
    arr_index: 0,
    a_index: 0,
    b_index: 0,
    currentTab: 0,
    showTitle: "0",
    title1: '全部',
    title2: '在途',
    title3: '待处理',
    showflag1: '',
    showflag2: '',
    showflag3: '',
    searchModel: {},
    searchModel1: {
      inputString: '',
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: ''
      },
      tagIndex: 0
    },
    searchModel2: {
      inputString: '',
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: ''
      },
      tagIndex: 1
    },
    searchModel3: {
      inputString: '',
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: ''
      },
      tagIndex: 2
    },
    isShow: true,
    allData: [],
    allOnorderData: [],
    allPendingData: [],
    logisticsAdviceCount: 0,
    isShow4inform: false,
    isCloseinform: false,
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    showFinish: true,
    datetime_now: ""
  },
  scrollTop: function(e) {
    var that = this
    app.utils.scrollTop(that, e)
  },
  goTop: function(e) {
    var that = this
    app.utils.goTop(that)
  },
  switchBtn() {
    this.setData({
      btnIsShow: !this.data.btnIsShow
    })
  },
  onLoad: function(e) {
    wx.setStorageSync('changeTab', true)
    var that = this
    app.authorize()
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
    var nowDate = new Date()
    var nowDate_0 = app.utils.formatDate(nowDate)
    var nowDate_7 = app.utils.formatDate(new Date(nowDate.setDate(nowDate.getDate() - 7)))
    var nowDate_15 = app.utils.formatDate(new Date(nowDate.setDate(nowDate.getDate() - 15)))
    var nowDate_30 = app.utils.formatDate(new Date(nowDate.setDate(nowDate.getDate() - 30)))
    this.setData({
      nowDate_0: nowDate_0,
      nowDate_7: nowDate_7,
      nowDate_15: nowDate_15,
      nowDate_30: nowDate_30
    })
  },
  onShow: function() {
    this.data.searchModel1.page.pageIndex = 1
    this.data.searchModel2.page.pageIndex = 1
    this.data.searchModel3.page.pageIndex = 1
    this.initAllData("0")
    this.initOnorderData("0")
    this.initPendingData("0")
  },
  searchFiles: function() {
    var that = this
    app.httpUtils.get('SysDoc', {
      "PageIndex": 1,
      "PageSize": 50,
      "site": this.data.searchModel1.site,
      "bill_no": this.data.obj.INNER_NO,
      "bill_type": "DEC"
    }, function(data) {
      if (data.Success) {
        var files = data.Data5.rows
        var s = Math.ceil(data.Data5.rows.length / 3)
        var table = []
        for (var i = 0; i < s; i++) {
          var length = (i + 1) * 3
          if (length > data.Data5.rows.length) {
            length = data.Data5.rows.length
          }
          table[i] = []
          for (var j = i * 3; j < length; j++) {
            table[i][j % 3] = files[j]
          }
        }
        files.forEach(function(val, index) {
          files[index]["FULL_NAME"] = "https://51aeo.com/APi/File/" + files[index]["SEQ_NO"]
        })
        that.setData({
          files: table
        })
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
          duration: 2000
        })
      }
    })
  },
  bindChange: function(e) {
    var that = this
    that.setData({
      currentTab: e.detail.current
    })
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
  upload: function() {
    var that = this
    this.initAnimation(180)
    wx.showActionSheet({
      itemList: ['上传图片'],
      success: function(res) {
        that.initAnimation(0)
        app.httpUtils.upload("https://51aeo.com/APi/File", {
          "bill_no": that.data.obj.INNER_NO,
          "bill_type": "DEC",
          "site": that.data.searchModel1.site
        }, function() {
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          })
          that.searchFiles()
        }, res.tapIndex)
      },
      fail: function(res) {
        that.initAnimation(0)
      }
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
  showDetails: function(e) {
    console.log(e)
    var roleList = e.currentTarget.dataset.roles
    var logPid = e.currentTarget.id
    var invitation = {
      logPid: logPid,
      roleList: roleList
    }
    wx.setStorageSync('changeTab', false)
    wx.setStorageSync("invitation", JSON.stringify(invitation))
    wx.navigateTo({
      url: 'details'
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
  initAllData: function(flag) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    if (flag == "0") {
      that.data.searchModel1.page.pageIndex = 1
    }
    app.platformApi.logistics("/logistics/queryList", that.data.searchModel1, function(data) {
      wx.hideLoading()
      if (data.code == '0000') {

        if (data.result.logisticsAdviceCount > 0) {
          that.setData({
            isShow4inform: true,
            logisticsAdviceCount: data.result.logisticsAdviceCount,
          })
        }
        that.setData({
          margin_top: 0,
          showTitle: "0",
          showFinish: true,
        })
        if (data.result.logisticsListTagData.logisticsList.length == 0) {
          if (flag == '0') {
            that.setData({
              allData: [],
              title1: '全部' + '(' + data.result.logisticsListTagData.count + ')',
            })
          }
          if (that.data.allData.length == 0) {
            that.setData({
              searchNone: true
            })
          }

          if (that.data.allData.length > 10) {
            that.setData({
              showflag1: '1',
            })
          } else {
            that.setData({
              showflag1: '',
            })
          }
          return
        } else {
          that.setData({
            searchNone: false
          })
        }
        var datas = that.data.allData
        if (flag == "0") {
          datas = []
        }
        data.result.logisticsListTagData.logisticsList.forEach(function(val, index) {
          val.completePercent = parseInt(val.completePercent * 100)
          datas.push(val)
        })
        that.setData({
          allData: [],
          allData: datas,
          title1: '全部' + '(' + data.result.logisticsListTagData.count + ')',
        })
        that.data.searchModel1.page.pageIndex += 1
        if (data.result.logisticsListTagData.count < 10 || data.result.logisticsListTagData.count > datas.length) {
          that.setData({
            showflag1: '',
          })
        } else {
          that.setData({
            showflag1: '1',
          })
        }
      }
    })
  },
  initOnorderData: function(flag) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    if (flag == "0") {
      that.data.searchModel2.page.pageIndex = 1
    }
    app.platformApi.logistics("/logistics/queryList", that.data.searchModel2, function(data) {
      wx.hideLoading()
      if (data.code == '0000') {
        that.setData({
          margin_top: 0,
          showTitle: "0",
          showFinish: true,
        })
        if (data.result.logisticsListTagData.logisticsList.length == 0) {
          if (flag == '0') {
            that.setData({
              allOnorderData: [],
              title2: '在途' + '(' + data.result.logisticsListTagData.count + ')',
            })
          }
          if (that.data.allOnorderData.length > 10) {
            that.setData({
              showflag2: '1',
            })
          } else {
            that.setData({
              showflag2: '',
            })
          }
          return
        }
        var datas = that.data.allOnorderData
        if (flag == "0") {
          datas = []
        }
        data.result.logisticsListTagData.logisticsList.forEach(function(val, index) {
          val.completePercent = parseInt(val.completePercent * 100)
          datas.push(val)
        })
        that.setData({
          allOnorderData: [],
          allOnorderData: datas,
          title2: '在途' + '(' + data.result.logisticsListTagData.count + ')',
        })
        that.data.searchModel2.page.pageIndex += 1
        if (data.result.logisticsListTagData.count < 10 || data.result.logisticsListTagData.count > datas.length) {
          that.setData({
            showflag2: '',
          })
        } else {
          that.setData({
            showflag2: '1',
          })
        }
      }
    })
  },
  initPendingData: function(flag) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    if (flag == "0") {
      that.data.searchModel3.page.pageIndex = 1
    }
    app.platformApi.logistics("/logistics/queryList", that.data.searchModel3, function(data) {
      wx.hideLoading()
      if (data.code == '0000') {
        that.setData({
          margin_top: 0,
          showTitle: "0",
          showFinish: true,
        })
        if (data.result.logisticsListTagData.logisticsList.length == 0) {
          if (flag == '0') {
            if (data.result.logisticsListTagData.count > 0 && wx.getStorageSync('changeTab')) {
              that.setData({
                currentTab: 2
              })
            }
            that.setData({
              allPendingData: [],
              title3: '待处理' + '(' + data.result.logisticsListTagData.count + ')',
            })
          }
          if (that.data.allPendingData.length > 10) {
            that.setData({
              showflag3: '1',
            })
          } else {
            that.setData({
              showflag3: '',
            })
          }
          return
        }
        var datas = that.data.allPendingData
        if (flag == "0") {
          datas = []
        }
        data.result.logisticsListTagData.logisticsList.forEach(function(val, index) {
          val.completePercent = parseInt(val.completePercent * 100)
          datas.push(val)
        })
        that.setData({
          allPendingData: [],
          allPendingData: datas,
          title3: '待处理' + '(' + data.result.logisticsListTagData.count + ')',
        })
        if (data.result.logisticsListTagData.count > 0 && wx.getStorageSync('changeTab')) {
          that.setData({
            currentTab: 2
          })
        }
        that.data.searchModel3.page.pageIndex += 1
        if (data.result.logisticsListTagData.count < 10 || data.result.logisticsListTagData.count > datas.length) {
          that.setData({
            showflag3: '',
          })
        } else {
          that.setData({
            showflag3: '1',
          })
        }
      }
    })
  },
  add: function() {
    wx.navigateTo({
      url: 'add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  bindData: function(e) {
    var that = this
    var id = e.currentTarget.id
    this.data.searchModel[id] = e.detail.value
    this.data.searchModel1[id] = e.detail.value
    this.data.searchModel2[id] = e.detail.value
    this.data.searchModel3[id] = e.detail.value
    that.setData({
      searchModel: this.data.searchModel
    })
  },
  searchData: function() {
    this.initAllData("0")
    this.initOnorderData("0")
    this.initPendingData("0")
  },
  confirmTap: function() {
    this.searchData()
  },
  check: function() {
    wx.navigateTo({
      url: 'newInvitation',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  closeRemind: function() {
    wx.removeStorageSync('isShow')
    wx.setStorageSync('isShow', true)
    this.onShow()
  },
  loadAllMore: function() {
    this.initAllData("1")
  },
  loadOnorderMore: function() {
    this.initOnorderData("1")
  },
  loadPendingMore: function() {
    this.initPendingData("1")
  },
  refresh1: function() {
    this.initAllData("0")
  },
  refresh2: function() {
    this.initOnorderData("0")
  },
  refresh3: function() {
    this.initPendingData("0")
  },
  touchStart: function(e) {
    this.setData({
      touchStart: e.touches[0].clientY
    })
  },
  touchMove: function(e) {
    var that = this
    app.utils.touchMove(that, e)
  },
  touchEnd: function(e) {
    var pulltype = e.currentTarget.dataset.pulltype
    var that = this
    if (that.data.touchEndNotExcute == true) {
      that.setData({
        margin_top: 0,
        showTitle: "0"
      });
    } else {
      if (that.data.touchMove == true) {
        that.setData({
          margin_top: 15,
          showTitle: "2",
          showFinish: false,
          scroll: false
        });
        if (pulltype == '1') {

          console.log('11111111111111111111111')
          that.data.searchModel1.enable = true;
          // that.data.searchModel1.PageIndex = 1;
          that.refresh1();
        } else if (pulltype == '2') {

          console.log('2222222222222222222222')
          that.data.searchModel2.enable = true;
          // that.data.searchModel2.PageIndex = 1;
          that.refresh2();
        } else if (pulltype == '3') {

          console.log('3333333333333333333333')
          that.data.searchModel3.enable = true;
          // that.data.searchModel3.PageIndex = 1;
          that.refresh3();
        }
      }
    }
    that.data.touchMove = false;
    that.data.touchEndNotExcute = false;
  },
  showSearchContent: function() {
    var that = this
    var status = !this.data.filter_show
    var right = -this.data.winWidth * 0.8
    if (!status) {
      console.log(23232)
      var ind = setInterval(function() {
        that.data.right = that.data.right - 60;
        if (that.data.right < right) {
          that.setData({
            filter_show: status,
            right: 0
          })
          clearInterval(ind)
          return
        }
        that.setData({
          right: that.data.right
        })
      }, 80)
    } else {
      this.setData({
        filter_show: status,
        right: -this.data.winWidth * 0.8
      })
      var ind = setInterval(function() {
        that.data.right = that.data.right + 60;
        console.log(that.data.right)
        if (that.data.right > 0) {
          that.setData({
            right: 0
          })
          clearInterval(ind)
          return
        }
        that.setData({
          right: that.data.right
        })
      }, 80)
    }
    if (that.data.issearch == 'true') {
      that.data.searchModel1.startCreateTime = that.data.searchData.begin_date
      that.data.searchModel2.startCreateTime = that.data.searchData.begin_date
      that.data.searchModel3.startCreateTime = that.data.searchData.begin_date

      that.data.searchModel1.endCreateTime = that.data.searchData.end_date
      that.data.searchModel2.endCreateTime = that.data.searchData.end_date
      that.data.searchModel3.endCreateTime = that.data.searchData.end_date

      that.data.searchModel1.iEFlag = that.data.searchData.i_e_flag
      that.data.searchModel2.iEFlag = that.data.searchData.i_e_flag
      that.data.searchModel3.iEFlag = that.data.searchData.i_e_flag

      that.data.searchModel1.trafMode = that.data.searchData.trafMode
      that.data.searchModel2.trafMode = that.data.searchData.trafMode
      that.data.searchModel3.trafMode = that.data.searchData.trafMode

      that.data.searchModel1.transMode = that.data.searchData.transMode
      that.data.searchModel2.transMode = that.data.searchData.transMode
      that.data.searchModel3.transMode = that.data.searchData.transMode
      that.onShow()
    }
  },
  setSearchData: function(e) {
    var value = e.currentTarget.dataset.value
    var filed = e.currentTarget.dataset.filed
    var tmp = this.data.searchData
    tmp[filed] = value
    this.setData({
      searchData: tmp
    })
  },
  setDateTime: function(e) {
    var filed = e.currentTarget.dataset.filed
    var tmp = this.data.searchData
    if (filed == "7") {
      tmp.end_date = this.data.nowDate_0
      tmp.begin_date = this.data.nowDate_7
    } else if (filed == "15") {
      tmp.end_date = this.data.nowDate_0
      tmp.begin_date = this.data.nowDate_15
    } else if (filed == "30") {
      tmp.end_date = this.data.nowDate_0
      tmp.begin_date = this.data.nowDate_30
    }
    this.setData({
      searchData: tmp
    })
  },
  bindDateChange: function(e) {
    console.log(e)
    var filed = e.target.id
    var tmp = this.data.searchData
    tmp[filed] = e.detail.value
    this.setData({
      searchData: tmp
    })
  },
  searchReset: function() {
    this.setData({
      searchData: {}
    })
  },
  filterSearch: function(e) {
    this.data.issearch = e.currentTarget.dataset.issearch
    this.showSearchContent()
  },
  clear: function() {
    var that = this;
    that.data.searchModel.inputString = '';
    that.setData({
      searchModel: that.data.searchModel
    })
  }
})