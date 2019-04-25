// pages/entry/detailsList.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchModel: {
      seq_no: "",
      g_no: ""
    },
    obj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = wx.getStorageSync('detailsList');
    // obj.RCV_DATE = app.utils.dateFormatter(obj.RCV_DATE)
    // obj.DEMAND_DATE = app.utils.dateFormatter(obj.DEMAND_DATE)
    // obj.I_E_DATE = app.utils.dateFormatter(obj.I_E_DATE)
    // obj.D_DATE = app.utils.dateFormatter(obj.D_DATE)

    this.setData({
      i_e_flag: wx.getStorageSync('i_e_flag'),
      obj: obj,
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
    // var that = this
    // app.httpUtils.get('EntryList', that.data.searchModel, function (data) {
    //   if (data.Success) {
    //     that.setData({
    //       obj: data.Data5,
    //     })
    //   }
    // })
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
  // onShareAppMessage: function () {

  // }
})