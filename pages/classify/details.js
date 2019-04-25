var app = getApp()
Page({
  data: {
    obj: {},
    objs: {},
    data1: ''
  },
  onLoad: function(options) {

    var that = this
    var CODE_TS = options.CODE_TS
    var objs = JSON.parse(options.objs)
    var data1 = ''
    that.setData({
      line: options.line,
      objs: objs,
    })
    if (options.line == '001') {
      for (var i = 0; i < objs.RELATED_PRODUCTS.length; i++) {
        if (i < objs.RELATED_PRODUCTS.length - 1) {
          data1 += objs.RELATED_PRODUCTS[i] + ' '
        } else {
          data1 += objs.RELATED_PRODUCTS[i]
        }
      }
      app.httpUtils.get('CodeTs', {
        CODE_TS: CODE_TS,
        accessName: "智能归类详情查询"
      }, function(data) {
        if (data.Success) {
          that.setData({
            obj: data.Data5,
            objs: objs,
            data1: data1
          })
        }
      })
    }
    wx.setNavigationBarTitle({
      title: objs.G_NAME,
    })
  },
})