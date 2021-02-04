// pages/airQuery/airQuery.js
let utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:'0',
    date:'',
    obj:{
      createUser: "",
      flightNo: "",
      searchDate: ""
    }

  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 获取当前日期
  getCurrentDate() {
    let that = this
    that.data.obj.searchDate = utils.formatDate(new Date)
    this.setData({
      obj: that.data.obj
    })
  },
  // 航班信息查询
  goToAirList(event) {
    let that = this
    if (event.currentTarget.dataset.type === 'nomal' && that.data.obj.flightNo == ''){
      wx.showToast({
        title: '请输入航班号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.navigateTo({
      url: './airInfoList?type=' + event.currentTarget.dataset.type + '&obj=' + JSON.stringify(that.data.obj),
      }
    )
  },
  inputflightNo(input){
    let that = this
    that.data.obj.flightNo = input.detail.value
    this.setData({
      obj: that.data.obj
    })
  },
  inputdata(input) {
    let that = this
    that.data.obj.searchDate = input.detail.value
    this.setData({
      obj: that.data.obj
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurrentDate()
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