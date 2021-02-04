let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight:400,//当前手机的屏幕显示高度
    toView:'default', // 锚点位置
    beforeTitle:'',
    activityModel:'',
    areaInfo:[ // 区域信息列表
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      winHeight:app.globalData.winHeight || 400,
      activityModel: JSON.parse(options.activityModel)
    })
    this.getAreaGroup()
    // 获取跳转过来页面的title
    if (options.title) {
      this.setData({
        beforeTitle: options.title
      })
    }
  },
  // 点击右侧字母跳转到锚点
  scrollToAnchor(e) {
    let { dataset: { anchor } } = e.target
    console.log(anchor)
    this.setData({
      toView: anchor
    })
  },
  // 返回跳转过来的页面
  goToApply(e) {
    let { dataset: { code, mobilezone } } = e.target
    wx.redirectTo({
      url: `../audit/apply?code=${code}&mobileZone=${mobilezone}&activityModel=${JSON.stringify(this.data.activityModel)}`
    })
  },
  // 获取所有国家及区号
  getAreaGroup() {
    wx.ajax({
      url:'API@saas-dictionary/dictionary/getAreaGroup',
      data:{},
      success:res => {
        this.setData({
          areaInfo: res.result
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})