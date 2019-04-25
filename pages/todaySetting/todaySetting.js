var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    USER_ID: "",
    revIptVal: '',
    config: {
      USER_ID: "",
      REFRESH_DATE: 1,
      FLIGHT_DYNAMIC: false,
      list: []
    },
    planeSearchModel: {
      enable: true,
      PageIndex: 1,
      PageSize: 50000
    },
    listNoFocus: []
  },
  revValSearch: function(e) {
    var that = this;
    if (that.data.revIptVal != '') {
      that.data.config.list.push({
        'FLIGHT_ID': that.data.revIptVal,
        'FLIGHT': ''
      })
    }
    that.setData({
      config: that.data.config
    })
  },
  deleteaddress: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index; //要删除项的index
    if (that.data.listNoFocus == null) {
      that.data.listNoFocus = []
    }
    that.data.listNoFocus.push(that.data.config.list[index]);
    console.log(that.data.listNoFocus)
    that.data.config.list.splice(index, 1);
    that.setData({
      oldData: that.data.listNoFocus,
      config: that.data.config,
      listNoFocus: that.data.listNoFocus
    })
  },
  addAddress: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    if (that.data.config.list == null) {
      that.data.config.list = []
    }
    var obj = that.data.listNoFocus[index]
    obj['USER_ID'] = that.data.USER_ID;
    that.data.config.list.push(obj)
    that.data.listNoFocus.splice(index, 1) //从数组中删除这一条
    var config = that.data.config;
    var listNoFocus = that.data.listNoFocus;
    that.setData({
      oldData: listNoFocus,
      config: config,
      listNoFocus: listNoFocus
    })
  },
  allFocus: function(e) {
    var that = this;
    var newList = that.data.config.list; //新数组chengfang list和listNoFocus中的数组
    var newListNoFocus = []; //空数组准备赋值给老数组
    for (var i = 0; i < that.data.listNoFocus.length; i++) {
      var tmp = that.data.listNoFocus[i]
      tmp.USER_ID = that.data.USER_ID
      newList.push(that.data.listNoFocus[i]); //将为关注列表项的列表内容全部添加到list中
    }
    var config = that.data.config;
    console.log(config)
    config.list = newList;
    that.setData({
      oldData: newListNoFocus,
      config: config,
      listNoFocus: newListNoFocus
    })
  },
  switch1Change: function(e) {
    var that = this;
    var config = that.data.config;
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    that.data.config.FLIGHT_DYNAMIC = e.detail.value;
    wx.setStorageSync('FLIGHT_DYNAMIC', e.detail.value)
    that.setData({
      config: that.data.config
    })
    console.log('switch1 发生 change 事件，携带值为', that.data.config.FLIGHT_DYNAMIC)
  },
  myAddClick: function() {
    wx.navigateTo({
      url: "/pages/todaySetting/myAdd"
    })
  },
  onLoad: function(options) {
    var that = this
    app.utils.getSystemInfo(that)

  },
  onShow: function() {
    var that = this
    app.getUserInfo(function(userInfo) {
      console.log("userInfo", userInfo)
      that.data.config.USER_ID = userInfo.userName
      that.setData({
        config: that.data.config,
        USER_ID: userInfo.userName
      })
      console.log("config", that.data.config)
      that.getFlightDynamicHead(function() {
        that.getPlaneTime()
      })
    })
  },
  getFlightDynamicHead: function(cb) {
    var that = this;
    app.httpUtils.get('FlightDynamicHead', {
      user_id: that.data.USER_ID
    }, function(res) {
      console.log("FlightDynamicHead", res)
      if (res.Success && res.Data5) {
        var config1 = res.Data5;
        if ("False" == config1.FLIGHT_DYNAMIC) {
          config1.FLIGHT_DYNAMIC = false
        } else {
          config1.FLIGHT_DYNAMIC = true
        }
        that.setData({
          config: config1
        })
      }
      if (cb) {
        cb()
      }
      console.log("result", that.data.config)
    })
  },
  getPlaneTime: function() {
    var that = this;
    app.httpUtils.get('PlaneTime', that.data.planeSearchModel, function(res) {
      console.log("PlaneTime", res)
      if (res.Success && res.Data5) {
        var listNoFocus1 = res.Data5.rows;
        var tmp = []
        listNoFocus1.forEach(function(m) {
          var exit = false
          that.data.config.list.forEach(function(e) {
            if (e.FLIGHT_ID == m.FLIGHT_ID) {
              exit = true
              return
            }
          })
          if (!exit) {
            tmp.push(m)
          }
        })
        that.setData({
          oldData: tmp,
          listNoFocus: tmp
        })
        console.log("res", that.data.listNoFocus)
      }
    })
  },
  commit: function() {
    var that = this;
    console.log(that.data.config);
    wx.showLoading({
      title: '保存中...',
    })
    that.data.config.TYPE = '0'
    app.httpUtils.post('FlightDynamicHead', that.data.config, function(res) {
      wx.hideLoading()
      wx.showToast({
        title: '保存成功',
        icon: 'none'
      })
      wx.navigateBack({
        delta: 1,
      })
      console.log("res", res)
    })
  },
  nextNum: function() {
    //console.log("-");
    console.log(this.data.config.REFRESH_DATE - 1)
    var num = this.data.config.REFRESH_DATE - 1;
    if (num < 1) {
      num = 1
    }
    this.data.config.REFRESH_DATE = num
    var tmp = this.data.config
    console.log(tmp)
    this.setData({
      config: tmp
    });
  },
  prevNum: function() {
    var num = this.data.config.REFRESH_DATE + 1;
    if (num > 9999) {
      num = 9999
    }
    this.data.config.REFRESH_DATE = num
    var tmp = this.data.config

    this.setData({
      config: tmp
    });
  },
  //输入框的值绑定事件
  bindData: function(e) {
    var that = this;
    console.log(e)
    console.log(e.detail.value)
    that.data.config.REFRESH_DATE = e.detail.value
    that.setData({
      config: that.data.config
    })
  },
  bindData4Str: function(e) {
    var that = this;
    var listNoFocus = []
    if (e.detail.value.trim() == '') {
      that.setData({
        listNoFocus: that.data.oldData
      })
    } else {
      that.data.listNoFocus.forEach(function(val, index) {
        if (val.FLIGHT_ID.toLowerCase().indexOf(e.detail.value.toLowerCase()) != -1) {
          listNoFocus.push(val)
        }
        if (index == that.data.listNoFocus.length-1) {
          that.setData({
            listNoFocus: listNoFocus
          })
        }
      })
    }
  }
})