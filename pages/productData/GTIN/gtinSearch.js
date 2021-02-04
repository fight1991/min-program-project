// pages/productData/GTIN/gtinSearch.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight:400,
    searchKey:'',
    gtinList:[],
    copyGtinList:[],
    pageIndex:0,
    isLoading: true,
    hasMore : false,
    total:0, // 记录总条数
    title:'暂无数据'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      winHeight:app.globalData.winHeight,
      copyGtinList:[...that.data.gtinList]
    })
  },
  scrolltoupper(e) {
    console.log(e)
  },
  // 扫码
  scanCode() {
    let that = this
    app.utils.scanCode(res => {
      that.getGtinDetail(res,'scan')
    })

  },
  // 跳转到gtin详情页
  goGtinDetail(e) {
    let {dataset:{gtin}} = e.target
    // 如果checkResult为1 或者S003 则跳转,否则弹窗提示
    this.getGtinDetail(gtin)
  },
  getGtinDetail(gtin,other) {
    if(other === 'scan') { // 说明是扫码查询的
      this.setData({
        title:'查询中...'
      })
    }
    wx.ajax({
      url:'API@saas-dictionary/gtin/getGtinDynamic',
      data: gtin,
      success:({result}) => {
        if( result.checkResult ) {
          if(!result.checkResult.startsWith('E')) {
            wx.navigateTo({
              url:'./gtinDetail?gtinInfo=' + encodeURIComponent(JSON.stringify(result))
            })
          }else {
            wx.showModal({
              title: '提示',
              content: result.checkResultInfo,
              showCancel: false
            })
          }
        }else {
          wx.navigateTo({
            url:'./gtinDetail?gtinInfo=' + encodeURIComponent(JSON.stringify(result))
          })
        }
        setTimeout(() => {
          if(other === 'scan') {
            this.setData({
              title:'暂无数据'
            })
          }else {
            this.setData({
              title:'没有更多数据了'
            })
          }
          
        },1500)
      }
    })
  },
  // 绑定查询输入框的值
  getSearchKey(e) {
    let value = e.detail.value
    if(value.trim().length === 0) {
      this.setData({
        searchKey:value,
        gtinList:[...this.data.copyGtinList]
      })
      return
    }
    let tempList1 = this.data.copyGtinList.filter(v => v.importCorpName.includes(value))
    let tempList2 = this.data.copyGtinList.filter(v => v.importCorpName.startsWith(value))
    this.setData({
      searchKey:value,
      gtinList:[...new Set([...tempList2,...tempList1])]
    })
    
  },
  // 点击键盘查询时
  getResultList(e) {
    let value = e.detail.value
    if(value.trim().length === 0) {
      wx.showToast({
        title: '请输入产品名称',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: true
      })
      return
    }

    // wx.navigateTo({
    //   url:'./gtinDetail'
    // })
    this.setData({
      pageIndex:0,
      gtinList:[],
      copyGtinList:[],
      isLoading: true,
      hasMore : false,
      total:0, // 记录总条数
      title:'查询中'
    })
    this.getGtinList()
  },
  // 请求列表
  getGtinList() {
    let { searchKey, pageIndex} = this.data
    pageIndex ++ 
    wx.ajax({
      url:'API@saas-dictionary/gtin/getGtinList',
      data:{
        page: {
          pageIndex,
          "pageSize": 10
        },
        productName:searchKey
      },
      success:res => {
        this.setData({
          gtinList:[...this.data.gtinList,...res.result],
          copyGtinList:[...this.data.gtinList,...res.result],
          total:res.page.total,
          pageIndex,
          isLoading:false,
          hasMore:(pageIndex < Math.ceil(res.page.total/10))? true:false,
          title:'没有更多数据了'
        })
      },
      other:res => {
        this.setData({
          title:'暂无数据'
        })
      }
    })
  },
  // 滚动到底部重新请求数据
  scrolltolower() {
    // 如果正在请求 或者没有更多禁止发送请求
    if(this.data.isLoading || !this.data.hasMore) {
      return
    }
    this.setData({
      isLoading:true
    })
    this.getGtinList()
  },
  // 上拉刷新 
  onReachBottom() {
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})