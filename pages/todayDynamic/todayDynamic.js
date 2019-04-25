var app = getApp();
var intervalId = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    searchModel: {
      enable: true,
      PageIndex: 1,
      PageSize: 500,
      user_id: "",
    },
    isFirst: true,
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    scroll: true,
    seq_no: "",
    datas: [],
    obj: {},
    load: 'true',
    status_flag: false,
    backFlag: true,
    showModalStatus: false,
    showList: false,
    margin_top: 0,
    showTitle: "0",
    touchMove: false,
    touchEndNotExcute: false,
    showFinish: true,
  },
  onLoad: function(option) {
    app.authorize()
    wx.removeStorageSync('load')
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function(userInfo) {
      that.data.searchModel.site = userInfo.site
      that.setData({
        theme: userInfo.theme
      })
    })
  },
  scrollTop: function(e) {
    var that = this
    app.utils.scrollTop(that, e)
  },
  dateFormatter: function(val) {
    if (val && val.length > 0) {
      val = '' + val.substring(11)
    } else {
      val = '-----'
    }
    return val
  },
  getList(flag) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.httpUtils.get('FlightDynamicList', that.data.searchModel, function(data) {
      if (data.Success) {
        wx.hideLoading()
        if (flag) {
          setTimeout(function() {
            that.setData({
              showTitle: "3"
            })
          }, 500)
          setTimeout(function() {
            that.setData({
              margin_top: 0,
              showTitle: "0",
              showFinish: true,
              scroll: true
            })
          }, 900)
        }
        var datas = data.Data5.rows
        if ((datas == null || datas.length == 0) && that.data.isFirst) {
          that.data.isFirst = false
          wx.navigateTo({
            url: '/pages/todaySetting/todaySetting',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        } else {
          datas.forEach(function(m) {
            if (m.EXT_AIRWAYCN) {
              var tmp = m.EXT_AIRWAYCN.split('-')
              if (tmp.length > 1) {
                m.EXT_AIRWAYC_1 = tmp[0]
                m.EXT_AIRWAYC_3 = tmp[tmp.length - 1]
                m.EXT_AIRWAYC_2 = ''   //EXT_AIRWAYC_2
                if (tmp.length > 2) {
                  for (var j = 1; j < tmp.length - 1; j++) {
                    m.EXT_AIRWAYC_2 = m.EXT_AIRWAYC_2 + "-"+ tmp[j]
                  }
                  if (m.EXT_AIRWAYC_2 && m.EXT_AIRWAYC_2.length > 0) {
                    m.EXT_AIRWAYC_2 = m.EXT_AIRWAYC_2.substring(1)
                  }
                  console.log(m.EXT_AIRWAYC_2)
                }
              }
            }
            m.EXT_ALTERTAKEOFF = that.dateFormatter(m.EXT_ALTERTAKEOFF)
            m.EXT_REALTAKEOFF = that.dateFormatter(m.EXT_REALTAKEOFF)
            m.EXT_PLANLANDING = that.dateFormatter(m.EXT_PLANLANDING)
            m.EXT_REALLANDING = that.dateFormatter(m.EXT_REALLANDING)
            m.EXT_PLANTAKEOFF = that.dateFormatter(m.EXT_PLANTAKEOFF)
          })
        }
        that.setData({
          list: datas
        })

        console.log(datas)
      }
    })
  },
  onShow: function(flag) {
    var that = this
    app.getUserInfo(function(userInfo) {
      that.data.searchModel.user_id = userInfo.userName
      that.setData({
        theme: userInfo.theme,
        user_id: userInfo.userName,
        searchModel: that.data.searchModel
      })
      that.getList(flag)
      that.getFlightDynamicHead()
    })
  },
  onHide: function() {
    clearInterval(intervalId)
  },
  getFlightDynamicHead: function() {
    var that = this;
    app.httpUtils.get('FlightDynamicHead', {
      user_id: that.data.user_id
    }, function(res) {
      var t = 1000 * 60
      if (res.Success && res.Data5 && res.Data5.REFRESH_DATE) {
        t = parseInt(res.Data5.REFRESH_DATE) * 1000 * 60;
      }
      if (t == 0) {
        t = 1000 * 60
      }
      console.log("======================" + t)
      intervalId = setInterval(function() {
        that.getList()
      }, t)
    })
  },
  setting: function() {
    wx.navigateTo({
      url: '/pages/todaySetting/todaySetting'
    })
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
    var that = this
    if (that.data.touchEndNotExcute == true) {
      that.setData({
        margin_top: 0,
        showTitle: "0"
      })
    } else {
      if (that.data.touchMove == true) {
        that.setData({
          margin_top: 15,
          showTitle: "2",
          showFinish: false,
          scroll: false
        })
        that.onShow(true)
      }
    }
    that.data.touchMove = false
    that.data.touchEndNotExcute = false
  },
})