let app = getApp()
Page({

  data: {
    winHeight:400,//当前手机的屏幕显示高度
    toView:'default', // 锚点位置
    contactInfo:[],
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      winHeight:app.globalData.winHeight || 400,
      type: options.type
    })
    this.getContactInfo()
  },
  // 点击右侧字母跳转到锚点
  scrollToAnchor(e) {
    let { dataset: { anchor } } = e.target
    this.setData({
      toView: anchor
    })
  },
  // 获取所有国家及区号
  getContactInfo() {
    wx.ajax({
      url:'API@login/user/getUserContacts',
      data:{},
      success:res => {
        this.setData({
          contactInfo: res.result
        })
      }
    })
  },
  backgetInfo(e){
    wx.redirectTo({
      url: 'companys?type='+this.data.type+'&user=' + JSON.stringify(e.currentTarget.dataset.user)
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