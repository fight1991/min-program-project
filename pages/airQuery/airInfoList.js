// pages/airQuery/airInfoList.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    obj:{},
    areaInfo:[],
    isChecked:true,
    touchMove: false,
    imgshow:true,
    formareaInfo:[],
    windowheight:400,
    scroll: true,
    scrollTop: {
      scroll_top: 0,
      goTop_show: true
    },
    isFocus:false,
    boxHeight:0,// 下拉时box的高度
    refresh:true,// 控制box的显示与隐藏
    title:'', // 下拉时的title
    loadingSuccess:false, // 控制图标的显示与隐藏
    startPos:0,// 记录下拉起始位置
    imageAll:true
  },
  switchChange() {
    this.setData({
      isChecked:!this.data.isChecked
    })
    wx.ajax({
      url: 'API@saas-wechat/flightParam/updateFlightMsg',
      data:{
        updateMsg:this.data.isChecked===true? '1':'0'
      },
      success: res => {

      }
    })
  },
  scrollTop: function (e) {
    var that = this
    app.utils.scrollTop(that, e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let obj = JSON.parse(options.obj)
    obj.searchDate = obj.searchDate.replace(/-/g, "")
    that.setData({
      type: options.type,
      obj: obj,
      windowheight: app.globalData.winHeight

    })
    if (options.type === 'nomal'){
      that.getAirinfo()
      wx.setNavigationBarTitle({
        title: '航班动态查询'
      })
    }else{
      that.getInsterAirinfo()
      wx.setNavigationBarTitle({
        title: '我关注的航班'
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  instrorcancel(e){
    let that = this
    that.data.areaInfo[e.currentTarget.dataset.index].attentionFlag = that.data.areaInfo[e.currentTarget.dataset.index].attentionFlag ==='1'?'0':'1'
    that.data.formareaInfo[e.currentTarget.dataset.index].attentionFlag = that.data.formareaInfo[e.currentTarget.dataset.index].attentionFlag === '1' ? '0' : '1'
    wx.ajax({
      url: 'API@saas-wechat/flightParam/updateFlightFocus',
      data: that.data.areaInfo[e.currentTarget.dataset.index],
      success: res => {
        this.setData({
          areaInfo: that.data.areaInfo,
          formareaInfo: that.data.formareaInfo
        })
        // 如果是点击我关注的航班跳转的页面,则重新请求已关注的列表
        if (this.data.type === 'interest') {
          that.getInsterAirinfo()
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getInsterAirinfo(flag) {
    let that = this
    wx.ajax({
      url: 'API@saas-wechat/flightParam/getFlightAttentionList',
      data: {},
      success: res => {
        that.airinfoFormat(res.result)
        this.setData({
          areaInfo: res.result,
          formareaInfo: that.data.formareaInfo,
          imgshow: res.result.length > 0 ? true : false,
          isChecked:res.result.length == 0 || res.result[0]['messageFlag'] === '1' ? true:false
        })
        if (flag === 'pull') { // 如果下拉刷新发生的请求
          that.setData({
            boxHeight: 0,
            refresh: true,
            title: '加载成功',
            loadingSuccess: false,
            imageAll: false
          })
        }
      }
    })
  },
  getAirinfo(flag){
    let that = this
    wx.ajax({
      url: 'API@saas-wechat/flightParam/getFlightList',
      data: that.data.obj,
      success: res => {
        that.airinfoFormat(res.result)
        that.setData({
          areaInfo: res.result,
          formareaInfo: that.data.formareaInfo,
          imgshow: res.result.length > 0 ? true : false
        })
        if(flag === 'pull') { // 如果下拉刷新发生的请求
          that.setData({
            boxHeight:0,
            refresh:true,
            title:'加载成功',
            loadingSuccess:false,
            imageAll:false
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { 
    // 页面隐藏重置下拉刷新相关的参数
    this.setData({
      boxHeight:0,
      refresh:true,
      title:'', 
      loadingSuccess:false,
      startPos:0,
      imageAll:true
    })
  },
  airinfoFormat(data){
    let that = this
    that.data.formareaInfo = JSON.parse(JSON.stringify(data))
    for (let a of that.data.formareaInfo){
      a.extRealtakeoff = a.extRealtakeoff.length > 15 ? a.extRealtakeoff.substring(10, 16) : a.extRealtakeoff
      a.extReallanding = a.extReallanding.length > 15 ? a.extReallanding.substring(10, 16) : a.extReallanding
      a.extAirwaycn = a.extAirwaycn.indexOf('-') > 0 && a.extAirwaycn.split('-').length>2 ? a.extAirwaycn.split('-')[1] : '—'
      a.extPlantakeoff = that.dataformat(a.extPlantakeoff)
      a.extPlanlanding = that.dataformat(a.extPlanlanding)
      a.extFlightno = a.extFlightno.toUpperCase()
    }
  },
  dataformat(data){
    if (data.length > 15 && data.indexOf('-') >= 0 && data.indexOf(':')>=0){
      let dayarray =  data.substring(0, 10).split('-')
      let timearray = data.substring(11, 16).split(':')
      return `${dayarray[1]}月${dayarray[2]}日${timearray[0]}:${timearray[1]}`
    }else{
      return data
    }
  },
  touchStart(e) {
    // 如果没有关注则禁止下拉刷新
    if(this.data.formareaInfo.length == 0 && this.data.type != 'nomal') {
      return false
    }
    // 记录开始坐标
    this.setData({
      startPos:e.touches[0].clientY,
      imageAll:true
    })
  },
  touchMove(e) {
    if(this.data.formareaInfo.length == 0 && this.data.type != 'nomal') {
      return false
    }
    // 判断是否向下滑动
    let temp = e.touches[0].clientY
    let value = temp - this.data.startPos
    if(value > 100) {
      this.setData({
        boxHeight:100,
        refresh:false,
        title:'释放立即刷新',
      })
      return
    }
    if(value > 0) { // 说明向下滑动
      this.setData({
        boxHeight:temp - this.data.startPos,
        refresh:false,
        title:'下拉刷新'
      })
  
    }else {
      this.setData({
        boxHeight:0,
        refresh:true
      })
    }
  },
  touchEnd(e) {
    if(this.data.formareaInfo.length == 0 && this.data.type != 'nomal') {
      return false
    }
    let that = this
    // 滑动结束 判断值是否 大于50 
    if(this.data.boxHeight > 50) {
      // 可以发送请求了,并把boxHeight高度降到50
      this.setData({
        boxHeight:50,
        refresh:false,
        title:'正在加载 ...',
        loadingSuccess:true,
        imageAll:false
      })
      // 发送请求
      if (that.data.type === 'nomal' && e.target.offsetTop <800){
      that.getAirinfo('pull')

      } else if (e.target.offsetTop < 800 && that.data.type === 'interest'){
        that.getInsterAirinfo('pull')
      }
    }
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

  }, 
})