// pages/order/sgoodsInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acceptApi:{
      // 提交
      submitDecI: '/ccba/iOrderTake/orderTakenToDec',
      submitDecE: '/ccba/eOrderTake/orderTakenToDec',
      invt: '/ccba/common/orderTakenToInvt', // 核注清单
      log: '/ccba/common/orderTakenToLog' // 物流
    },
    innerNo:'',
    subForm: {},
    orderFlag: '',
    decFlag: '',
    isContainLog: false, // 是否包含物流业务
    isContainDec: false, // 是否包含报关单业务
    isContainInvt: false, // 是否包含核注清单业务
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    // this.setData({
    //   decFlag: wx.getStorageSync('decFlag')
    // })
   
  },
  saveOrder(e){
    let that = this
    if (that.data.subForm.billtype == '4' || that.data.subForm.billtype == '9') {
      wx.showToast({
        title: '暂不支持生成清单类型为“简单加工”和“一纳成品内销”的核注清单',
        icon: 'none'
      })
      return
    } 
    let type = e.currentTarget.dataset.type
    that.data.subForm.entrustType = e.currentTarget.dataset.type
    wx.ajax({
      url: 'API@dec-common/ccba/entrust/saveEntrust',
      data: [that.data.subForm],
      success: res => {
        wx.showToast({
          title: type == "0" ? '暂存成功' : '提交成功',
        })
        if (type === '1'){
          wx.removeStorageSync('orderInfo')
          wx.reLaunch({
            url:`./allBill/allBillList?entrustStatus=2&iEFlag=${this.data.subForm.iEFlag}`
          }) 
        }else{
          if (res.result.entrustHeadPid) {
            that.data.subForm.entrustHeadPid = res.result.entrustHeadPid
          }
          that.setData(that.data)
          that.saveDate()
          wx.reLaunch({
            url:'./allBill/allBillList?iEFlag=' + this.data.subForm.iEFlag
          }) 
        } 
      }
    })
  },
  // 接单暂存
  receiveDec() {
    let that = this
    if (that.data.subForm.billtype == '4' || that.data.subForm.billtype == '9') {
      wx.showToast({
        title: '暂不支持生成清单类型为“简单加工”和“一纳成品内销”的核注清单',
        icon: 'none'
      })
      return
    }
    let url = '/ccba/iOrderTake/addIOrder'
    if(that.data.subForm.iEFlag === 'E') {
      url = '/ccba/eOrderTake/addEOrder'
    }
    wx.ajax({
      url:'API@dec-common'+url,
      data: [that.data.subForm],
      success: res => {
        wx.showToast({
          title: '暂存成功'
        })
        that.data.subForm.innerNo = res.result
        that.data.innerNo = res.result
        that.setData(that.data)
        that.saveDate()
        wx.reLaunch({
          url: './allBill/allBillList?iEFlag=' + that.data.subForm.iEFlag
        })
      }
    })
  },
  sendgetAdress(e){
    wx.navigateTo({
      url: 'allBill/deliveryInfo?type=' + e.currentTarget.dataset.type + '&title=' + e.currentTarget.dataset.title,
    })
  },
  gorogetAdress(e){
    wx.navigateTo({
      url: `selectUnit?type=${e.currentTarget.dataset.type}&title=${e.currentTarget.dataset.title}`
    })
  },
  saveDate(){
    let that = this
    wx.setStorageSync('orderInfo',that.data)
  },
  // 先暂存后提交
  receiveDec2() {
    let that = this
    if (that.data.subForm.billtype == '4' || that.data.subForm.billtype == '9') {
      wx.showToast({
        title: '暂不支持生成清单类型为“简单加工”和“一纳成品内销”的核注清单',
        icon: 'none'
      })
      return
    } 
    let url = '/ccba/iOrderTake/addIOrder'
    if(that.data.subForm.iEFlag === 'E') {
      url = '/ccba/eOrderTake/addEOrder'
    }
    wx.ajax({
      url:'API@dec-common'+url,
      data: [that.data.subForm],
      success: res => {
        that.data.innerNo = res.result
        // 提交
        that.checkEtpsInfo(that)
    }
    })
  },
  checkEtpsInfo(that){
    if (that.data.subForm.manualNo){
      wx.ajax({
        url: 'API@saas-ems/nemsinvt/getEtpsInfo',
        data: { emsNo: that.data.subForm.manualNo, emsTypeFlag: '' },
        success: res => {
        }
      })
    }else{
      that.submitOrder(that)
      return
    }   
  },
   // 接单提交
   submitOrder(that) {
     let url = ''
     if (that.data.subForm.billtype == '4' || that.data.subForm.billtype == '9'){
       wx.showToast({
         title:'暂不支持生成清单类型为“简单加工”和“一纳成品内销”的核注清单',
         icon:'none'
       })
        return
    } 
    if(that.data.decFlag === 'dec') {
      if(that.data.subForm.iEflag === 'E') {
        url = that.data.acceptApi.submitDecE
      }else {
        url = that.data.acceptApi.submitDecI
      }
    }else {
      url = that.data.acceptApi[that.data.decFlag]
    }
    that.data.subForm.innerNo = that.data.innerNo
    wx.ajax({
      url: 'API@dec-common' + url,
      data: that.data.subForm,
      success: res => {
        wx.showToast({
          title: '提交成功',
        })
        wx.removeStorageSync('orderInfo')
        wx.reLaunch({
          url: './allBill/allBillList?iEFlag=' + that.data.subForm.iEFlag
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
  onShow: function (options) {
    let that = this
    let orderFlag = wx.getStorageSync("orderFlag")
    let temp = wx.getStorageSync('orderInfo').subForm
    let tempLog = false,tempDec = false, tempInvt = false
    if(orderFlag === '1') {
        tempLog = temp.beEntrustInfoVOs.some(v => {
          return v.entrustBusiness.includes("log")
        })
       tempDec = temp.beEntrustInfoVOs.some(v => {
        return v.entrustBusiness.includes("dec")
      })
       tempInvt = temp.beEntrustInfoVOs.some(v => {
        return v.entrustBusiness.includes("invt")
      })
    }else {
      let flag = temp.type
      if(flag) {
        if(flag.includes("log")) {
          tempLog = true
        }else if(flag.includes("dec")) {
          tempDec = true
        }else {
          tempInvt = true
        }
      }
    }
    that.setData({
      decFlag: temp.type || wx.getStorageSync('decFlag'),
      subForm: temp,
      orderFlag: orderFlag,
      isContainDec: tempDec,
      isContainInvt: tempInvt,
      isContainLog: tempLog
    })
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
  submitAll(){

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