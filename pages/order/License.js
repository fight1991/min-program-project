// pages/order/License.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files:[],
    innerNo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let a = wx.getStorageSync('orderInfo').subForm
    that.setData({
      files: a.sysDocVOs || [],
      innerNo: a.innerNo
    })
  },
  delectFile(e){
    let that = this
    if (e.currentTarget.dataset.file.seqNo){
      wx.ajax({
        url: 'API@dec-common/ccba/entrust/acmpDelete',
        data: [{ seqNo: e.currentTarget.dataset.file.seqNo }],
        success: res => {
        }
      })
    }
    that.data.files.splice(that.data.files.indexOf(e.currentTarget.dataset.file), 1)
    that.setData(that.data)
    let pages = getCurrentPages()
    pages[pages.length - 2].data.subForm.sysDocVOs = that.data.files
    wx.showToast({
      title: '删除成功'
    })
  },
  chooseFileAndUpload(){
    let that = this
    // 从会话端选择文件
    wx.showActionSheet({
      itemList: ['拍照', '选择图片', '选择文件'],
      success(res) {
        if(res.tapIndex == 2){
          wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success:that.successUp
          })
        } else{
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: [res.tapIndex == 1 ? 'album' :'camera'],
            success:that.successUp
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 上传文件统一回调
  successUp(res) {
    if (4 * 1024 * 1024 < res.tempFiles[0].size){
      wx.showToast({
        title: '文件最大为4M',
        icon:'none'
      })
      return
    }
    this.uploadFile(res.tempFiles[0])
  },
  // 上传word
  uploadFile(file) {
    let that = this
    wx.upload({
      url: 'FILE@saas-upload/upload/uploadFile',
      filePath: file.path,
      data: file,
      success: res => {
        let time = app.utils.formatDateTime(new Date()).substring(0,16)
        let arr = res.result.name.split('.')
        let obj = {
          upTime: time,
          fileType: arr[arr.length-1],
          fullName: res.result.url,
          type: '.'+res.result.name.split('.')[res.result.name.split('.').length-1],
          fileName: res.result.name,
          fileSize: Math.round(res.result.size/1024)
        }
        that.setData({
          files: [...that.data.files, obj]
        })
      },
      error: () => {
      }
    })
  },
  subFile(){
    let that = this
    let a = wx.getStorageSync('orderInfo')
    a.subForm.sysDocVOs = that.data.files
    let pages = getCurrentPages()
    pages[pages.length - 2].data.subForm = a.subForm
    wx.navigateBack({
      delta: 1,
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