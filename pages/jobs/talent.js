
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    newList:[
      {
        id:'1',
        title:'在朗新工作大有不同',
        text:'在朗新，工作的氛围让每个人都积极创新，为做出美好的事情而努力。在这里没有大公司的等级观念，每个人都可以随时提出自己的创意和想法。'
      },
      {
        id:'2',
        title:'一起推动关务行业快速进步',
        text:'让每个人都能享受行业变革的乐趣。朗新公司应用互联网云模式开发关务平台产品，将智能关务云打造成全国最大的产品系统平台，整合了货主、货代、报关行、仓储、物流企业等产业角色。你现在就有机会参与这一切，让卓越的产品铭刻你的烙印！'
      },
      {
        id:'3',
        title:'与优秀的人一起做事',
        text:'朗新拥有一流的人才队伍，团队成员来自各大知名关务、互联网公司及海关。在这里，你会遇到比自己更优秀的人，不断成就自我！'
      }
    ],
    jobTypeList:[],
    isLoading:true,
    hasMore:true,
    total:0,// 记录总条数
    pageIndex:0
  },
  getJobTypeList() {
    let { pageIndex, jobTypeList } = this.data
    pageIndex ++
    wx.ajax({
      url:'API@plat-manager/jobManage/getJobTypeList',
      data:{
        source:['wechat'],
        "page": {
          "pageIndex": 1,
          "pageSize": 10
        }
      },
      success:res => {
        if(res.result && res.result.length > 0) {
          res.result = this.translate(res.result)
          this.setData({
            pageIndex: pageIndex,
            jobTypeList: [...jobTypeList,...res.result],
            total: res.page.total,
            hasMore: Math.ceil(res.page.total/10) <= pageIndex ? false:true,
            isLoading: false
          })
        }else {
          this.setData({
            pageIndex: 0,
            jobTypeList: [],
            hasMore: true,
            isLoading: true
          })
        }
      }
    })
  },
  getBannerList () {
    wx.ajax({
      url:'API@plat-manager/carouselManager/showCarousel',
      data:{
        "code": 'CONFIG:WX_RCZP_PAGE'
      },
      success:res => {
        if(res.result) {
          this.setData({
            bannerList:res.result
          })
        }else {
          this.setData({
            bannerList:[]
          })
        }
      }
    })
  },
  gotoCompanyDetail(e) {
    let { dataset: { type } } = e.target
    wx.navigateTo({
      url: './companyInfo?type=' + type
    })
  },
  translate(arr) {
    if(Array.isArray(arr)) {
      arr.forEach(v => {
        switch(v.jobType) {
          case '1':
            v.jobName = '销售经理'
            break;
          case '2':
          v.jobName = '咨询顾问'
          break;
          case '3':
          v.jobName = '需求分析师'
          break;
          default:
          v.jobName = '尚未维护'
        }
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
    }else {
      switch(arr['company']) {
        case 'longnows':
          arr.companyName = '朗新一诺(苏州)信息科技有限公司'
          break;
        case 'longshine':
          arr.companyName = '朗新金关信息科技有限公司'
        break;
        default:
          arr.companyName = '朗新一诺(苏州)信息科技有限公司/朗新金关信息科技有限公司'
      }
    }
    return arr
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getJobTypeList()
    this.getBannerList()
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
    let { isLoading, hasMore } = this.data
    if(isLoading || !hasMore) {
      return
    }
    this.getJobTypeList()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if(wx.getStorageSync('unionid')) {
      let mobile = wx.getStorageSync('mobile')
      let userId = wx.getStorageSync('userId')
      this.addSharePage('加入朗新' , userId, mobile)
      this.addLogRecord('1','加入朗新', mobile)
    }
    return {
      title:'加入朗新',
      path: '/pages/jobs/talent'
    }
  } 
})