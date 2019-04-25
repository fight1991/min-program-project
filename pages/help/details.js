var app = getApp()
Page({
  data: {
    seq_no: "",
    obj: {},
    userInfo: {},
    currentUser: {},
    images: {},
    files: []
  },
  searchFiles: function () {
    console.log(this.data.obj.SEQ_NO)
    var that = this
    app.httpUtils.get('SysDoc', { "PageIndex": 1, "PageSize": 50, "bill_no": that.data.obj.SEQ_NO, "bill_type": "HELP" }, function (data) {
      if (data.Success) {
        var files = []
        data.Data5.rows.forEach(function (val, index) {
          files.push(val)
        })
        files.forEach(function (val, index) {
          files[index]["FULL_NAME"] = "https://51baoguan.cn/APi/File/" + files[index]["SEQ_NO"]
          console.log("files=" + files[index]["FULL_NAME"])
        })
        that.setData({
          files: files
        })
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
    })
  },
  onLoad: function (options) {
    app.authorize()
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo,
        theme: userInfo.theme
      })
    })
    if (typeof (options.seq_no) != "undefined") {
      that.data.seq_no = options.seq_no
      app.httpUtils.get('Help', { seq_no: that.data.seq_no }, function (data) {
        if (data.Success) {
          that.setData({
            obj: data.Data5
          })
          that.searchFiles()
          console.log(that.data.obj.FILE_INFO)
        }
      })
    }

  },
  imageLoad: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度和高度
      $height = e.detail.height,
      ratio = $width / $height    //图片的真实宽高比例

    var viewWidth = this.data.winWidth * 0.9           //设置图片显示宽度，
    if ($width < this.data.winWidth) {     //如果图片宽度小于屏幕宽度，取图片宽度
      viewWidth = $width
    }
    var viewHeight = viewWidth / ratio    //计算的高度值
    var image = this.data.images
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },
  onShow: function () {

  },

  // onShareAppMessage: function () {

  // }
})