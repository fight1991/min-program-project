function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
function formatDateFirstDay(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, '01'].map(formatNumber).join('-')
}

function formatDateTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getDateTimeString() {
  var date = new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var milliseconds = date.getMilliseconds()

  return [year, month, day].map(formatNumber).join('') + [hour, minute, second, milliseconds].map(formatNumber).join('')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function dateFormatter(value) {
  if (typeof value == "undefined" || value == null || value.length == 0) {
    return null
  } else {
    try {
      return formatDate(new Date(value.toString()))
    }
    catch (e) {
      return null
    }
  }
}

function dateTimeFormatter(value) {
  if (typeof value == "undefined" || value == null || value.length == 0) {
    return null
  } else {
    try {
      return formatDateTime(new Date(value.toString()))
    }
    catch (e) {
      return null
    }
  }
}

function dateTimeFormatter4TZ(value) {
  if (typeof value == "undefined" || value == null || value.length == 0) {
    return null
  } else {
    try {
      return value.replace('T', ' ')
    }
    catch (e) {
      return null
    }
  }
}
function getCurrentDateString() {
  var date = new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return year + '-' + formatNumber(month) + '-' + formatNumber(day)
}

function getCurrentMonthFirstDay() {
  var date = new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  return year + '-' + formatNumber(month) + '-01'
}

function phoneCall(phoneNum) {
  wx.makePhoneCall({
    phoneNumber: phoneNum,
    success: function () {
      console.log("拨打电话成功！")
    },
    fail: function () {
      console.log("拨打电话失败！")
    }
  })
}

function showLocation(latitude, longitude, name, address) {
  wx.openLocation({
    latitude: latitude,
    longitude: longitude,
    scale: 28,
    name: name,
    address: address
  })
}

function showCompanyLocation() {
  showLocation(31.2544600000, 120.7339300000, "朗新一诺（苏州）信息科技有限公司", "苏州市工业园区新平街388号腾飞创新园A2幢1201-120")
}

function scanCode(cb) {
  wx.scanCode({
    scanType: ["qrCode", "barCode", "datamatrix","pdf417"],
    success: (res) => {
      typeof cb == "function" && cb(res.result)
      console.log(res)
    }
  })
}

// 查询
function search(searchModel) {
  wx.setStorageSync('load', 'true')
  var pages = getCurrentPages()
  var prevPage = pages[pages.length - 2]
  var datas = prevPage.data.datas
  prevPage.setData({
    searchModel: searchModel,
    datas: []
  })
  wx.navigateBack({
    delta: 1
  })
}

//返回按钮返回
function backTo() {
  var pages = getCurrentPages()
  var prevPage = pages[pages.length - 2]
  prevPage.setData({
    backFlag: false
  })
  wx.navigateBack({
    delta: 1
  })
}

function touchBegin(that) {
  var style = "back back-pressed"
  that.setData({
    style: style
  })
}

function touchOver(that) {
  var style = "back"
  that.setData({
    style: style
  })
}

function scan(that, key) {
  scanCode(function (data) {
    that.data.searchModel[key] = data.replace(/\*/g, "")
    var searchModel = that.data.searchModel
    that.setData({
      searchModel: searchModel
    })
  })
}

function getSystemInfo(that) {
  wx.getSystemInfo({
    success: function (res) {
      console.log(res)
      that.setData({
        winWidth: res.windowWidth,
        winHeight: res.windowHeight,
        screenHeight: res.screenHeight
      })
    }
  })
}

function scrollTop(that, e) {
  that.setData({
    touchToTop: e.detail.scrollTop
  })
  if (e.detail.scrollTop > 100) {//触发gotop的显示条件  
    that.setData({
      'scrollTop.goTop_show': true
    })
  } else {
    that.setData({
      'scrollTop.goTop_show': false
    })
  }
}

function scrollTop1(that, e) {
  if (e.detail.scrollTop > 100) {//触发gotop的显示条件  
    that.setData({
      'scrollTop1.goTop_show': true
    })
  } else {
    that.setData({
      'scrollTop1.goTop_show': false
    })
  }
}

function goTop(that) {
  var _top = that.data.scrollTop.scroll_top;
  //设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断  
  if (_top == 1) {
    _top = 0
  } else {
    _top = 1
  }
  that.setData({
    'scrollTop.scroll_top': _top
  })
}

function goTop1(that) {
  var _top = that.data.scrollTop1.scroll_top
  if (_top == 1) {
    _top = 0
  } else {
    _top = 1
  }
  that.setData({
    'scrollTop1.scroll_top': _top
  })
}

function touchMove(that, e) {
  if (e.changedTouches[0].clientY - that.data.touchStart > 0) {
    if (that.data.touchToTop == null) {
      that.data.touchToTop = 0
    }
    if (that.data.touchToTop < 50 && that.data.showFinish == true) {
      var margin_top = e.changedTouches[0].clientY - that.data.touchStart
      if (margin_top > 30) {
        that.setData({
          showTitle: "1"
        })
      }
      if (margin_top > 100) {
        margin_top = 100
      }
      that.setData({
        margin_top: margin_top
      })
      that.data.touchMove = true
    }
  } else {
    that.data.touchEndNotExcute = true
  }
}

function touchEnd(that) {
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
      that.data.searchModel.enable = true
      that.data.searchModel.PageIndex = 1
      var flag = true
      that.initData(flag)
    }
  }
  that.data.touchMove = false
  that.data.touchEndNotExcute = false
}

function reportTouchMove(that, e) {
  if (e.changedTouches[0].clientY - that.data.touchStart > 0 && that.data.pageYStart < that.data.winHeight && that.data.showFinish == true) {
    var margin_top = e.changedTouches[0].clientY - that.data.touchStart
    if (margin_top > 30) {
      that.setData({
        showTitle: "1"
      })
    }
    if (margin_top > 100) {
      margin_top = 100
    }
    that.setData({
      margin_top: margin_top
    })
    that.data.touchMove = true
  } else {
    if (that.data.showFinish == true) {
      that.data.touchEndNotExcute = true
    }
  }
}

function reportTouchEnd(that) {
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
        showFinish: false
      })
      var flag = true
      that.initData(flag)
    }
  }
  that.data.touchMove = false
  that.data.touchEndNotExcute = false
}

function util(that, currentStatu, key) {
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  that.animation = animation
  animation.opacity(0).rotateX(-100).step()
  that.setData({
    animationData: animation.export()
  })
  setTimeout(function () {
    animation.opacity(1).rotateX(0).step()
    that.setData({
      animationData: animation
    })
    if (currentStatu == "close") {
      that.setData(
        {
          showModalStatus: false,
          scroll: true
        }
      )
    }
  }.bind(that), 200)
  if (currentStatu == "open") {
    app.httpUtils.get('CodeTs', { CODE_TS: key }, function (data) {
      if (data.Success) {
        that.setData({
          obj: data.Data5,
          scroll: false,
          showModalStatus: true
        })
      }
    })
  }
}

function tarBarTouchMove(that, e) {
  //判断是左右滑动还是上下滑动
  if (Math.abs(that.data.touchX - e.changedTouches[0].clientX) > Math.abs(e.changedTouches[0].clientY - that.data.touchStart)) {
    //左右滑动
    if (that.data.touchX - e.changedTouches[0].clientX > 0) {
      //手指左划
      if (that.data.touchX - e.changedTouches[0].clientX > 100) {
        that.setData({
          left: true
        })
      }
    } else {
      //手指右划
      if (that.data.touchX - e.changedTouches[0].clientX < -100) {
        that.setData({
          right: true
        })
      }
    }
  }
}

function tarBarTouchEnd(that, url_left,url_right) {
  if (that.data.left == true) {
    that.data.left = false
    wx.switchTab({
      url: url_left,
    })
  } else if (that.data.right == true) {
    that.data.right = false
    wx.switchTab({
      url: url_right,
    })
  }
}

function touchBegin (that, e) {
  var i = e.currentTarget.dataset.td
  var j = e.currentTarget.dataset.tr
  that.data.table[j][i].state = false
  var table = that.data.table
  that.setData({
    table: table
  })
}
function othertouchBegin(that, e) {
  var n = e.currentTarget.dataset.td
  var m = e.currentTarget.dataset.tr
  that.data.table1[m][n].state = false
  var table = that.data.table1
  that.setData({
    table1: table
  })
}
function lasttouchBegin(that, e) {
  console.log('************')
  console.log(that.data.table2)
  console.log('************')
  var n = e.currentTarget.dataset.td
  var m = e.currentTarget.dataset.tr
  that.data.table2[m][n].state = false
  var table = that.data.table2
  that.setData({
    table2: table
  })
}
function touchOver (that, e) {
  var i = e.currentTarget.dataset.td
  var j = e.currentTarget.dataset.tr
  that.data.table[j][i].state = true
  var table = that.data.table
  that.setData({
    table: table
  })
}
function othertouchOver(that, e) {
  var n = e.currentTarget.dataset.td
  var m = e.currentTarget.dataset.tr
  that.data.table1[m][n].state = true
  var table = that.data.table1
  that.setData({
    table1: table
  })
}
function lasttouchOver(that, e) {
  var n = e.currentTarget.dataset.td
  var m = e.currentTarget.dataset.tr
  that.data.table2[m][n].state = true
  var table = that.data.table2
  that.setData({
    table2: table
  })
}
function approveSwichNav (that, e) {
  if (that.data.currentTab === e.target.dataset.current) {
    return false
  } else {
    that.setData({
      currentTab: e.target.dataset.current,
      'scrollTop.goTop_show': false
    })
  }
}

function approveLoadMore (that, e) {
  var status = e.currentTarget.id
  if (status == "not") {
    if (!that.data.searchModel.enable) {
      if (that.data.total >= 7) {
        that.setData({
          showflag: 1
        })
      }
      return
    }
    that.initData()
  } else if (status == "yes") {
    if (!that.data.searchModel_ed.enable) {
      if (that.data.total_ed >= 7) {
        that.setData({
          showflag1: 1
        })
      }
      return
    }
    that.initData_ed()
  }
}

function loadMore (that) {
  if (!that.data.searchModel.enable) {
    that.setData({
      showflag: 1
    })
    return
  }
  that.initData()
}

function approveAfter (that) {
  wx.setStorageSync('fromDetailsToList', 'true')
  var pages = getCurrentPages()
  var prevPage = pages[pages.length - 2]
  var searchModel = that.data.searchModel
  var datas = prevPage.data.datas
  prevPage.setData({
    searchModel: searchModel,
    datas: []
  })
  var searchModel_ed = that.data.searchModel_ed
  var datas_ed = prevPage.data.datas_ed
  prevPage.setData({
    searchModel_ed: searchModel_ed,
    datas_ed: []
  })
  wx.navigateBack({
    delta: 1
  })
}

function showButton (that, e) {
  var ems_no = e.currentTarget.id
  var trade_code = e.currentTarget.dataset.trade
  wx.navigateTo({
    url: 'chooseButton?ems_no=' + ems_no + "&ems_type=" + that.data.searchModel.ems_type + "&trade_code=" + trade_code,
  })
}

function numFormatter(num, precision) {
  num = Number(num)
  num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString()
  var parts = num.split('.')
  parts[0] = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (','))
  return parts.join('.')
}

function bindData (that, e) {
  var key = e.currentTarget.id
  that.data.searchModel[key] = e.detail.value
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function getGuid() {
  //return (S4() + S4()  + S4()  + S4()  + S4()  + S4() + S4() + S4());
  var result = 'xxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16) 
  })
  return result + getDateTimeString()
}
 

module.exports = {
  getCurrentDateString: getCurrentDateString,
  dateTimeFormatter: dateTimeFormatter,
  dateFormatter: dateFormatter,
  getCurrentMonthFirstDay: getCurrentMonthFirstDay,
  phoneCall: phoneCall,
  scanCode: scanCode,
  showLocation: showLocation,
  showCompanyLocation: showCompanyLocation,
  numFormatter: numFormatter,
  search: search,
  backTo: backTo,
  touchBegin: touchBegin,
  touchOver: touchOver,
  othertouchBegin: othertouchBegin,
  lasttouchBegin: lasttouchBegin,
  othertouchOver: othertouchOver,
  scan: scan,
  getSystemInfo: getSystemInfo,
  scrollTop: scrollTop,
  scrollTop1: scrollTop1,
  goTop: goTop,
  goTop1: goTop1,
  touchMove: touchMove,
  touchEnd: touchEnd,
  reportTouchMove: reportTouchMove,
  reportTouchEnd: reportTouchEnd,
  tarBarTouchMove: tarBarTouchMove,
  tarBarTouchEnd: tarBarTouchEnd,
  touchBegin: touchBegin,
  touchOver: touchOver,
  lasttouchOver: lasttouchOver,
  approveSwichNav: approveSwichNav,
  approveLoadMore: approveLoadMore,
  loadMore: loadMore,
  approveAfter: approveAfter,
  showButton: showButton,
  bindData: bindData,
  formatDate: formatDate,
  formatDateFirstDay: formatDateFirstDay,
  dateTimeFormatter4TZ: dateTimeFormatter4TZ,
  getGuid: getGuid,
  formatDateTime: formatDateTime,
  getDateTimeString: getDateTimeString
}