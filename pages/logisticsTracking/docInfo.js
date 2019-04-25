var app = getApp()
Page({
  data: {
    urls: [],
    logPid:'',
    nodeNo:'',
    disabled: '',
    isOperation:'true'
  },
  onLoad: function(options) {
    var that =this
    that.data.logPid=options.logPid
    that.data.nodeNo = options.nodeNo
    var isOperation = options.isOperation
    var urls = options.urls.split(',')
    var obj = {}
    if (typeof options.obj != 'undefined') {
      obj = JSON.parse(options.obj)
    }
    that.setData({
      isOperation: isOperation,
      urls:urls,
      obj: obj
    })
    
  },
  onReady: function() {

  },
  onShow: function() {

  },
  confirm: function() {
    var that=this
    that.setData({
      disabled: 'disabled'
    })
    wx.showLoading({
      title: '确认中...',
    })
    app.platformApi.logistics("/logistics/conformNode", {
      logPid: that.data.logPid,
      nodeNo: that.data.nodeNo
    }, function(data) {
      wx.hideLoading()
      if (data.code == '0000') {
        wx.showToast({
          title: data.result,
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      }else{
        that.setData({
          disabled: ''
        })
        wx.showToast({
          icon:'none',
          title: data.result,
        })
      }
    })
  },
  showImg:function(e){
    var url = e.currentTarget.dataset.url
    app.httpUtils.preview(url,".jpg")
  }
})