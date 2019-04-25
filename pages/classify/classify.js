var app = getApp()
Page({
  data: {
    arrayName: [],
    arrayCode: [],
    section: [],
    total: 0,
    line: '001',
    nextSearch: true,
    page_size: 5,
    searchModel: {
      condition: '',
      page_index: 1,
      tariff_code: '',
      accessName: "智能归类查询"
    },
    index: '0',
    currTab: '0',
    datas: [],
    datas_ed: [],
    item: {},
    isShow: false,
    showflag: '',
  },
  onLoad: function(options) {
    var that = this
    app.getUserInfo(function(userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    app.utils.getSystemInfo(that)
    app.httpUtils.get('Classify', {
      type: '001'
    }, function(data) {
      if (data.Success) {
        var name = [];
        var code = [];
        for (var i = 0; i < data.Data5.length; i++) {
          name.push(data.Data5[i].LINE_NAME)
          code.push(data.Data5[i].LINE_CODE)
        }
        console.log('')
        that.setData({
          arrayName: name,
          arrayCode: code
        })
      }
    })
  },
  bindData: function(e) {
    var that = this
    app.utils.bindData(that, e)
  },
  bindPickerChange: function(e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  chageTab: function(e) {
    var that = this
    that.setData({
      datas: [],
      currTab: e.currentTarget.dataset.currtab
    })
    that.data.searchModel.page_index = 1
    if (that.data.currTab > 0) {
      that.data.searchModel.tariff_code = that.data.section[e.currentTarget.dataset.currtab - 1]
    } else {
      that.data.searchModel.tariff_code = ''
    }
    that.classify()
  },
  showDetails: function(e) {
    var that = this
    var CODE_TS = e.currentTarget.dataset.code_ts
    var objs = that.data.datas[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: 'details?CODE_TS=' + CODE_TS + '&objs=' + JSON.stringify(objs) + '&line=' + that.data.line,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  classify: function(e) {
    var that = this
    that.setData({
      line: that.data.arrayCode[that.data.index]
    })
    if (that.data.arrayCode[that.data.index] == '001') {
      if (typeof e != 'undefined') {
        if (e.currentTarget.dataset.isall) {
          that.data.searchModel.tariff_code = ''
          that.setData({
            currTab: '0',
            datas: []

          })
        }
      }
      if (that.data.searchModel.condition.trim() != '') {
        that.data.nextSearch = false
        wx.showLoading({
          title: '查询中...',
        })
        var accessName = "智能归类查询"
        if (!app.globalData.isAllRecord) {
          accessName = ''
        }

        app.httpUtils.get('Classify', {
          dbsource: that.data.arrayCode[that.data.index],
          condition: that.data.searchModel.condition,
          page_index: that.data.searchModel.page_index,
          tariff_code: that.data.searchModel.tariff_code,
          accessName: accessName
        }, function(data) {
          wx.hideLoading()
          that.data.nextSearch = true
          if (data.Success) {
            if (data.Data5.data == null || data.Data5.total == 0) {
              wx.showToast({
                icon: 'none',
                title: '查无数据',
              })
              that.setData({
                isShow: false
              })
            } else {
              if (data.Data5.data.length > 0) {
                for (var i = 0; i < data.Data5.data.length; i++) {
                  var ss = data.Data5.data[i].CODE_T_S
                  var g_name = data.Data5.data[i].G_NAME
                  var length = that.data.searchModel.condition.length;
                  var index = g_name.indexOf(that.data.searchModel.condition);
                  if (index == -1) {
                    data.Data5.data[i].DATA1 = g_name
                    data.Data5.data[i].DATA2 = ''
                    data.Data5.data[i].DATA3 = ''
                  } else {
                    data.Data5.data[i].DATA1 = g_name.substr(0, index)
                    data.Data5.data[i].DATA2 = that.data.searchModel.condition
                    data.Data5.data[i].DATA3 = g_name.substr(index + length)
                  }
                }
                that.setData({
                  isShow: true
                })
              }
              var datas = that.data.datas
              data.Data5.data.forEach(function(val, index) {
                datas.push(val)
              })
              if (that.data.searchModel.page_index > 1 || that.data.currTab > 0) {
                that.setData({
                  total: Math.ceil(data.Data5.total / 5.0),
                  datas: datas,
                })
              } else {
                var section = []
                for (var i = 0; i < data.Data5.classify.length; i++) {
                  section.push(data.Data5.classify[i].substr(0, 2))

                }
                section = section.sort(function(x, y) {
                  return y - x;
                });
                that.setData({
                  total: Math.ceil(data.Data5.total / 5.0),
                  section: section,
                  datas: datas,
                })
              }
            }
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '请输入查询条件查询',
        })
      }
    } else {
      wx.showLoading({
        title: '查询中...',
      })
      if (that.data.searchModel.condition.trim() != '') {
        app.httpUtils.get('Classify', {
          type: '002',
          accessName: "智能归类查询",
          condition: that.data.searchModel.condition
        }, function(datas) {
          if (datas.Data5.length > 0) {
            var datass = []
            var l = 0
            datas.Data5.forEach(function(val, i) {
              app.httpUtils.get('CodeTs', {
                CODE_TS: val
              }, function(data) {
                wx.hideLoading()
                if (data.Success) {
                  if (data.Data5 != null) {
                    var g_name = data.Data5.G_NAME
                    var length = that.data.searchModel.condition.length;
                    var index = g_name.indexOf(that.data.searchModel.condition);
                    if (index == -1) {
                      data.Data5.DATA1 = g_name
                      data.Data5.DATA2 = ''
                      data.Data5.DATA3 = ''
                    } else {
                      data.Data5.DATA1 = g_name.substr(0, index)
                      data.Data5.DATA2 = that.data.searchModel.condition
                      data.Data5.DATA3 = g_name.substr(index + length)
                    }
                    datass.push(data.Data5)
                    if (l == datas.Data5.length - 1) {
                      
                      that.setData({
                        datas: datass
                      })
                    }                 
                  }
                  l += 1
                }
              })
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '查无数据',
            })
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '请输入查询条件查询',
        })
      }
    }
  },
  loadMore: function() {
    var that = this
    if (!that.data.nextSearch) {
      return
    }
    if (!app.globalData.isAllRecord) {
      that.data.searchModel.accessName = ''
    }
    that.data.searchModel.page_index += 1
    if (that.data.searchModel.page_index <= this.data.total) {
      that.classify()
      that.setData({
        showflag: '',
      })
    } else {
      that.setData({
        showflag: '1',
      })
    }
  },
})