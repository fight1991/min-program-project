// pages/jobs/jobList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobList:[],
    pageIndex:0,
    isLoading: true,
    hasMore: true,
    jobType:''
  },
  getJobTypeList(jobType) {
    let { pageIndex } = this.data
    pageIndex ++
    wx.ajax({
      url:'API@plat-manager/jobManage/getJobListByType',
      data:{
        jobType,
        source: ["wechat"],
        page:{
          pageIndex,
          pageSize:10
        }
      },
      success:res => {
        if( res.result && res.result.length > 0 ) {
          res.result = this.translate(res.result)
          this.setData({
            pageIndex, pageIndex,
            jobList: res.result,
            isLoading: false,
            hasMore: Math.ceil(res.page.total/10) <= pageIndex ? false:true
          })
        }else {
          this.setData({
            pageIndex: 0,
            isLoading: true,
            hasMore: true,
            jobList:[]
          })
        }
      }
    })
  },
  translate(arr) {
    if(Array.isArray(arr)) {
      arr.forEach(v => {
        switch(v.company) {
          case 'longnows':
          v.companyName = '朗新一诺(苏州)信息科技有限公司'
          break;
          case 'longshine':
          v.companyName = '朗新金关信息科技有限公司'
          break;
          default:
          v.companyName = '朗新一诺(苏州)信息科技有限公司/朗新金关信息科技有限公司'
          }
      })
    }
    return arr
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let jobType = options.jobType
    this.setData({
      jobType:jobType
    })
    this.getJobTypeList(jobType)
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
    if(this.data.isLoading || !this.data.hasMore) {
      return
    }
    this.getJobTypeList(this.data.jobType)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if(wx.getStorageSync('unionid')) {
      let mobile = wx.getStorageSync('mobile')
      let userId = wx.getStorageSync('userId')
      this.addSharePage('职位列表' , userId, mobile)
      this.addLogRecord('1','职位列表', mobile)
    }
    return {
      title:'职位信息',
      path: '/pages/jobs/jobList?jobType=' + this.data.jobType
    }
  } 
})