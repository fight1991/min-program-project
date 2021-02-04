// pages/order/allBill/companys.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showData:[],
    totaldata:[],
    iftotal:[],
    user:{},
    type:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.data.user = JSON.parse(options.user)
    that.data.type =options.type
    that.setData(that.data)
    that.getCompany(JSON.parse(options.user).userId)
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
  getCompany(id){
    let that = this
    wx.ajax({
      url: 'API@login/user/getUserDetail',
      data: {userId: id},
      success: res => {
        let iftotal = []
        let ifback = true
        let showdata = JSON.parse(JSON.stringify(res.result[0].corps))
        for (let x in res.result[0].corps){
          iftotal.push(res.result[0].corps[x].contactWay.length <= 2)
          if (res.result[0].corps[x].contactWay.length > 2){
          showdata[x].contactWay = showdata[x].contactWay.splice(0,2)
          }else{
            showdata[x].contactWay = res.result[0].corps[x].contactWay
          }
          if (res.result[0].corps[x].contactWay.length !== 0){
            ifback = false
          }
        }
        if (ifback){
          wx.redirectTo({
            url: './deliveryInfo?type=' + that.data.type + '&user=' + JSON.stringify(that.data.user)
          })
        }
        that.setData({
          showData: showdata,
          totaldata: res.result[0].corps,
          iftotal: iftotal
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },
  backdata(e){
    let that = this
    let item = e.currentTarget.dataset.item
    let flag = wx.getStorageSync('orderFlag')
    let subform = wx.getStorageSync('orderInfo').subForm
    if(flag ==='1'){
      if (that.data.type === 'get') {
        subform.pickUpGCountry = item.country
        subform.pickUpGProvince = item.province
        subform.pickUpGCity = item.city
        subform.pickUpGAddress = item.address
      } else {
        subform.deliverGCountry = item.country
        subform.deliverGProvince = item.province
        subform.deliverGCity = item.city
        subform.deliverGAddress = item.address
      }
    }else{
      if(that.data.type === 'get'){
        subform.agentSendCarWithBLOBsVO.pickUpGCountry = item.country
        subform.agentSendCarWithBLOBsVO.pickUpGProvince = item.province
        subform.agentSendCarWithBLOBsVO.pickUpGCity = item.city
        subform.agentSendCarWithBLOBsVO.deliveryAddrS = item.address
      } else{
        subform.agentSendCarWithBLOBsVO.deliverGCountry = item.country
        subform.agentSendCarWithBLOBsVO.deliverGProvince = item.province
        subform.agentSendCarWithBLOBsVO.deliverGCity = item.city
        subform.agentSendCarWithBLOBsVO.deliveryAddrR = item.address
      }
    }
    that.data.user.mobile = item.addressTel
    let x = wx.getStorageSync('orderInfo')
    x.subForm = subform
    wx.setStorageSync('orderInfo', x)
    wx.redirectTo({
      url: './deliveryInfo?type=' + that.data.type+'&user='+JSON.stringify(that.data.user)
    })
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
  showtotal(e){
    let that = this
    if (that.data.iftotal[e.currentTarget.dataset.index]){
      that.data.showData[e.currentTarget.dataset.index].contactWay = that.data.showData[e.currentTarget.dataset.index].contactWay.splice(0,2)
    }else{
      that.data.showData[e.currentTarget.dataset.index].contactWay = that.data.totaldata[e.currentTarget.dataset.index].contactWay
    }
    that.data.iftotal[e.currentTarget.dataset.index] = !that.data.iftotal[e.currentTarget.dataset.index]
    that.setData(that.data)
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