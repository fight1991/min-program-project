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

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 之后可以动态替换
    imageSrc: 'http://www.bing.com/az/hprichbg/rb/BulgariaPerseids_ZH-CN11638911564_1920x1080.jpg',
    // 是否显示图片(在图片加载完成之后设置为true)
    isShowImg: false,
    // 初始化的宽高
    cropperInitW: SCREEN_WIDTH,
    cropperInitH: SCREEN_WIDTH,
    // 动态的宽高
    cropperW: SCREEN_WIDTH,
    cropperH: SCREEN_WIDTH,
    // 动态的left top值
    cropperL: 0,
    cropperT: 0,
    // 图片缩放值
    scaleP: 0,
    // 裁剪框 宽高
    cutL: 0,
    cutT: 0,
    cutB: SCREEN_WIDTH,
    cutR: '100%',
    qualityWidth: DRAW_IMAGE_W,
    innerAspectRadio: DRAFG_MOVE_RATIO
  },
  onLoad: function(options) {},
  onReady: function() {
    this.loadImage();
  },
  getImage: function() {
    var _this = this
    wx.chooseImage({
      success: function(res) {
        _this.setData({
          imageSrc: res.tempFilePaths[0],
        })
        _this.loadImage();
      },
    })
  },
  loadImage: function() {
    var _this = this
    wx.showLoading({
      title: '图片加载中...',
    })
    wx.getImageInfo({
      src: _this.data.imageSrc,
      success: function success(res) {
        DRAW_IMAGE_W = IMG_REAL_W = res.width
        IMG_REAL_H = res.height
        IMG_RATIO = IMG_REAL_W / IMG_REAL_H
        let minRange = IMG_REAL_W > IMG_REAL_H ? IMG_REAL_W : IMG_REAL_H
        INIT_DRAG_POSITION = minRange > INIT_DRAG_POSITION ? INIT_DRAG_POSITION : minRange
        // 根据图片的宽高显示不同的效果   保证图片可以正常显示
        if (IMG_RATIO >= 1) {
          _this.setData({
            cropperW: SCREEN_WIDTH,
            cropperH: SCREEN_WIDTH / IMG_RATIO,
            // 初始化left right
            cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),
            cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2),
            cutL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH + INIT_DRAG_POSITION) / 2),
            cutT: Math.ceil((SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - INIT_DRAG_POSITION)) / 2),
            cutR: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH + INIT_DRAG_POSITION) / 2),
            cutB: Math.ceil((SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - INIT_DRAG_POSITION)) / 2),
            // 图片缩放值
            scaleP: IMG_REAL_W / SCREEN_WIDTH,
            qualityWidth: DRAW_IMAGE_W,
            innerAspectRadio: IMG_RATIO
          })
        } else {
          _this.setData({
            cropperW: SCREEN_WIDTH * IMG_RATIO,
            cropperH: SCREEN_WIDTH,
            // 初始化left right
            cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2),
            cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),

            cutL: Math.ceil((SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO)) / 2),
            cutT: Math.ceil((SCREEN_WIDTH - INIT_DRAG_POSITION) / 2),
            cutB: Math.ceil((SCREEN_WIDTH - INIT_DRAG_POSITION) / 2),
            cutR: Math.ceil((SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO)) / 2),
            // 图片缩放值
            scaleP: IMG_REAL_W / SCREEN_WIDTH,
            qualityWidth: DRAW_IMAGE_W,
            innerAspectRadio: IMG_RATIO
          })
        }
        _this.setData({
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
    var _this = this
    var dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
    var dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
    // 左移右移
    if (dragLengthX > 0) {
      if (this.data.cutL - dragLengthX < 0) dragLengthX = this.data.cutL
    } else {
      if (this.data.cutR + dragLengthX < 0) dragLengthX = -this.data.cutR
    }
    // 上移下移
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
    var _this = this
    wx.showLoading({
      title: '图片生成中...',
    })
    // 将图片写入画布
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.drawImage(_this.data.imageSrc, 0, 0, IMG_REAL_W, IMG_REAL_H);
    ctx.draw(true, () => {
      // 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题
      var canvasW = ((_this.data.cropperW - _this.data.cutL - _this.data.cutR) / _this.data.cropperW) * IMG_REAL_W
      var canvasH = ((_this.data.cropperH - _this.data.cutT - _this.data.cutB) / _this.data.cropperH) * IMG_REAL_H
      var canvasL = (_this.data.cutL / _this.data.cropperW) * IMG_REAL_W
      var canvasT = (_this.data.cutT / _this.data.cropperH) * IMG_REAL_H
      // 生成图片
      wx.canvasToTempFilePath({
        x: canvasL,
        y: canvasT,
        width: canvasW,
        height: canvasH,
        destWidth: canvasW,
        destHeight: canvasH,
        quality: 0.5,
        canvasId: 'myCanvas',
        success: function(res) {
          wx.hideLoading()
          wx.previewImage({
            current: '',
            urls: [res.tempFilePath]
          })
        }
      })
    })
  },

  /**
   * 设置大小的时候触发的touchStart事件
   * 存数据
   */
  dragStart(e) {
    T_PAGE_X = e.touches[0].pageX
    T_PAGE_Y = e.touches[0].pageY
    CUT_L = this.data.cutL
    CUT_R = this.data.cutR
    CUT_B = this.data.cutB
    CUT_T = this.data.cutT
  },

  /**
   * 设置大小的时候触发的touchMove事件
   * 根据dragType判断类型
   * 4个方向的边线拖拽效果
   * 右下角按钮的拖拽效果
   */
  dragMove(e) {
    var _this = this
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