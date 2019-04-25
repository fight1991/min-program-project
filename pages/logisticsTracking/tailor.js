let SCREEN_WIDTH = 750
let PAGE_X, // 手按下的x位置
  PAGE_Y, // 手按下y的位置
  PR = wx.getSystemInfoSync().pixelRatio, // dpi
  T_PAGE_X, // 手移动的时候x的位置
  T_PAGE_Y, // 手移动的时候Y的位置
  CUT_L, // 初始化拖拽元素的left值
  CUT_T, // 初始化拖拽元素的top值
  CUT_R, // 初始化拖拽元素的
  CUT_B, // 初始化拖拽元素的
  CUT_W, // 初始化拖拽元素的宽度
  CUT_H, //  初始化拖拽元素的高度
  IMG_RATIO, // 图片比例
  IMG_REAL_W, // 图片实际的宽度
  IMG_REAL_H, // 图片实际的高度
  DRAFG_MOVE_RATIO = 750 / wx.getSystemInfoSync().windowWidth, //移动时候的比例,
  INIT_DRAG_POSITION = 200, // 初始化屏幕宽度和裁剪区域的宽度之差，用于设置初始化裁剪的宽度
  DRAW_IMAGE_W // 设置生成的图片宽度
var app = getApp()
Page({
  data: {
    isFromIdentify: 'false',
    imageSrc: '',
    isShowImg: false,
    cropperInitW: SCREEN_WIDTH,
    cropperInitH: SCREEN_WIDTH,
    cropperW: SCREEN_WIDTH,
    cropperH: SCREEN_WIDTH,
    cropperL: 0,
    cropperT: 0,
    scaleP: 0,
    cutL: 0,
    cutT: 0,
    cutB: SCREEN_WIDTH,
    cutR: '100%',
    qualityWidth: DRAW_IMAGE_W,
    innerAspectRadio: DRAFG_MOVE_RATIO
  },
  onLoad: function(options) {
    var that = this
    app.getUserInfo(function(userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    if (typeof options.isFromIdentify != 'undefined' && options.isFromIdentify == 'true') {
      that.setData({
        isFromIdentify: options.isFromIdentify,
        imageSrc: options.imageSrc
      })
    } else {
      that.setData({
        index: options.index,
        imageSrc: options.imageSrc
      })
    }

  },
  onReady: function() {
    this.loadImage();
  },
  getImage: function() {
    var that = this
    wx.chooseImage({
      success: function(res) {
        that.setData({
          imageSrc: res.tempFilePaths[0],
        })
        that.loadImage();
      },
    })
  },
  loadImage: function() {
    var that = this
    wx.showLoading({
      title: '图片加载中...',
    })
    wx.getImageInfo({
      src: that.data.imageSrc,
      success: function success(res) {
        DRAW_IMAGE_W = IMG_REAL_W = res.width
        IMG_REAL_H = res.height
        IMG_RATIO = IMG_REAL_W / IMG_REAL_H
        let minRange = IMG_REAL_W > IMG_REAL_H ? IMG_REAL_W : IMG_REAL_H
        INIT_DRAG_POSITION = minRange > INIT_DRAG_POSITION ? INIT_DRAG_POSITION : minRange
        if (IMG_RATIO >= 1) {
          that.setData({
            cropperW: SCREEN_WIDTH,
            cropperH: SCREEN_WIDTH / IMG_RATIO,
            cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),
            cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2),
            cutL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH + INIT_DRAG_POSITION) / 2),
            cutT: Math.ceil((SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - INIT_DRAG_POSITION)) / 2),
            cutR: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH + INIT_DRAG_POSITION) / 2),
            cutB: Math.ceil((SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - INIT_DRAG_POSITION)) / 2),
            scaleP: IMG_REAL_W / SCREEN_WIDTH,
            qualityWidth: DRAW_IMAGE_W,
            innerAspectRadio: IMG_RATIO
          })
        } else {
          that.setData({
            cropperW: SCREEN_WIDTH * IMG_RATIO,
            cropperH: SCREEN_WIDTH,
            cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2),
            cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),
            cutL: Math.ceil((SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO)) / 2),
            cutT: Math.ceil((SCREEN_WIDTH - INIT_DRAG_POSITION) / 2),
            cutB: Math.ceil((SCREEN_WIDTH - INIT_DRAG_POSITION) / 2),
            cutR: Math.ceil((SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO)) / 2),
            scaleP: IMG_REAL_W / SCREEN_WIDTH,
            qualityWidth: DRAW_IMAGE_W,
            innerAspectRadio: IMG_RATIO
          })
        }
        that.setData({
          isShowImg: true
        })
        wx.hideLoading()
      }
    })
  },
  contentStartMove(e) {
    PAGE_X = e.touches[0].pageX
    PAGE_Y = e.touches[0].pageY
  },
  contentMoveing(e) {
    var that = this
    var dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
    var dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
    if (dragLengthX > 0) {
      if (this.data.cutL - dragLengthX < 0) dragLengthX = this.data.cutL
    } else {
      if (this.data.cutR + dragLengthX < 0) dragLengthX = -this.data.cutR
    }
    if (dragLengthY > 0) {
      if (this.data.cutT - dragLengthY < 0) dragLengthY = this.data.cutT
    } else {
      if (this.data.cutB + dragLengthY < 0) dragLengthY = -this.data.cutB
    }
    this.setData({
      cutL: this.data.cutL - dragLengthX,
      cutT: this.data.cutT - dragLengthY,
      cutR: this.data.cutR + dragLengthX,
      cutB: this.data.cutB + dragLengthY
    })
    PAGE_X = e.touches[0].pageX
    PAGE_Y = e.touches[0].pageY
  },
  contentTouchEnd() {

  },
  getImageInfo() {
    var that = this
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.drawImage(that.data.imageSrc, 0, 0, IMG_REAL_W, IMG_REAL_H);
    ctx.draw(true, () => {
      var canvasW = ((that.data.cropperW - that.data.cutL - that.data.cutR) / that.data.cropperW) * IMG_REAL_W
      var canvasH = ((that.data.cropperH - that.data.cutT - that.data.cutB) / that.data.cropperH) * IMG_REAL_H
      var canvasL = (that.data.cutL / that.data.cropperW) * IMG_REAL_W
      var canvasT = (that.data.cutT / that.data.cropperH) * IMG_REAL_H
      wx.canvasToTempFilePath({
        x: canvasL,
        y: canvasT,
        width: canvasW,
        height: canvasH,
        destWidth: canvasW,
        destHeight: canvasH,
        quality: 0.5,
        canvasId: 'myCanvas',
        success: function(data) {
          wx.showLoading({
            title: '识别中',
          })
          wx.uploadFile({
            url: that.data.userInfo.platformHost + "/saas-ai/ocr/find",
            filePath: data.tempFilePath,
            name: 'file',
            formData: {
              lang: 'z',
              psm: -1
            },
            header: {
              "ssoToken": that.data.userInfo.token,
              "appWebFlag": "2",
              "sysId": "004",
              "content-type": "multipart/form-data"
            },
            success(res) {
              wx.hideLoading()
              var data = JSON.parse(res.data)
              if (that.data.isFromIdentify == 'true') {
                let pages = getCurrentPages();
                let prevPage = pages[pages.length - 2]
                prevPage.setData({
                  no: data.result,
                })
                wx.navigateBack({
                  delta: 1,
                })
              } else {
                wx.navigateTo({
                  url: 'identify?no=' + data.result + '&index=' + that.data.index,
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
              }
            },
            fail: function(error) {
              wx.hideLoading()
              console.log(error);
            }
          })
        }
      })
    })
  },
  dragStart(e) {
    T_PAGE_X = e.touches[0].pageX
    T_PAGE_Y = e.touches[0].pageY
    CUT_L = this.data.cutL
    CUT_R = this.data.cutR
    CUT_B = this.data.cutB
    CUT_T = this.data.cutT
  },
  dragMove(e) {
    var that = this
    var dragType = e.target.dataset.drag
    switch (dragType) {
      case 'right':
        var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
        if (CUT_R + dragLength < 0) dragLength = -CUT_R
        this.setData({
          cutR: CUT_R + dragLength
        })
        break;
      case 'left':
        var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
        if (CUT_L - dragLength < 0) dragLength = CUT_L
        if ((CUT_L - dragLength) > (this.data.cropperW - this.data.cutR)) dragLength = CUT_L - (this.data.cropperW - this.data.cutR)
        this.setData({
          cutL: CUT_L - dragLength
        })
        break;
      case 'top':
        var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
        if (CUT_T - dragLength < 0) dragLength = CUT_T
        if ((CUT_T - dragLength) > (this.data.cropperH - this.data.cutB)) dragLength = CUT_T - (this.data.cropperH - this.data.cutB)
        this.setData({
          cutT: CUT_T - dragLength
        })
        break;
      case 'bottom':
        var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
        if (CUT_B + dragLength < 0) dragLength = -CUT_B
        this.setData({
          cutB: CUT_B + dragLength
        })
        break;
      case 'rightBottom':
        var dragLengthX = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
        var dragLengthY = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
        if (CUT_B + dragLengthY < 0) dragLengthY = -CUT_B
        if (CUT_R + dragLengthX < 0) dragLengthX = -CUT_R
        this.setData({
          cutB: CUT_B + dragLengthY,
          cutR: CUT_R + dragLengthX
        })
        break;
      default:
        break;
    }
  },
  onShow: function() {

  },
})