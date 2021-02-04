// pages/order/orderInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subForm:{
      mtpckEndprdTypecd: 'I',
      ediId: '1',
      splitFlag: 'N',
      manualNo: '',
      goodsOutline: '',
      packNo: '',
      grossWt: '',
      netWt: '',
      decType:'',
      declTrnrel: '0',
      note:'',
      billtype: '',
      tradeTerms: '',
      iEFlag:'I',
      trafMode:'',
      billNo:'',
      beEntrustInfoVOs:[],
      sysDocVOs:[],
      type:'dec',
      agentSendCarWithBLOBsVO:{
        pickUpGCountryValue :'',
        pickUpGProvinceValue:'', 
        pickUpGCityValue:'',  
        deliveryAddrS:'',
        deliverGCountryValue:'',
        deliverGProvinceValue:'',
        deliverGCityValue:'',
        deliveryAddrR:'',
      },
      entrustType: '0',
      "deliverGAddress": "",
      "deliverGCity": "",
      "deliverGCityValue": "",
      "deliverGContacts": "",
      "deliverGCountry": "",
      "deliverGCountryValue": "",
      "deliverGPhone": "",
      "deliverGProvince": "",
      "deliverGProvinceValue": "",
      "processCode": "",
      "processName": "",
      "processScc": "",
      "operateCode": "",
      "operateName": "",
      "operateScc": "",
      "pickUpGAddress": "",
      "pickUpGCity": "",
      "pickUpGCityValue": "",
      "pickUpGContacts": "",
      "pickUpGCountry": "",
      "pickUpGCountryValue": "",
      "pickUpGPhone": "",
      "pickUpGProvince": "",
      "pickUpGProvinceValue": ""
    },
    orderFlag:'1',
    isEdit:false,
    transindex: '',
    transArray:[],
    objtransArray:[]
  },
  inputNote(e) {
    let that = this
    that.data.subForm[e.currentTarget.id] = e.detail.value
    that.setData(that.data)
  },
  inputbillNo:function (e){
    let that = this
    that.data.subForm.billNo = e.detail.value
    this.setData(that.data)
  },
  toCorpbtn(e){
    this.saveDate()
    wx.navigateTo({
      url: 'newOrderCorp?corp=' + JSON.stringify(e.currentTarget.dataset.corp) + '&type=' + e.target.dataset.type + '&index=' + e.target.dataset.idx
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.getTrans()
    that.setData({
      orderFlag:wx.getStorageSync('orderFlag')
    })
    if (options.headPid){ // 从详情编辑跳转过来的页面
      that.setData({
        isEdit: options.headPid?true:false
      })
      if(that.data.orderFlag === '1') {
        that.getDetail(options.headPid)
      }else {
        that.getOrderDetail(options.headPid,options.iEFlag)
      }
    }else{
      wx.removeStorageSync("orderInfo")
      that.setData(that.data)
    }
  },
  // 获取委托单详情
  getDetail(id){
    let that =this
    wx.ajax({
      url: 'API@dec-common/ccba/entrust/getEntrustDetail',
      data: {entrustHeadPid: id},
      success: res => {
        that.data.subForm = res.result
        that.setData(that.data)
        that.setData({
          transindex: that.data.transArray.indexOf(res.result.trafModeValue)
        })
        wx.setStorageSync("orderInfo", that.data)
      }
    })
  },
   // 获取接单详情
   getOrderDetail(id,IEflag) {
    let that = this
    let url = ''
    IEflag=== 'I'? url='/ccba/iOrderTake/iOrderDetail': url='/ccba/eOrderTake/eOrderDetail'
    wx.ajax({
      url:'API@dec-common' + url,
      data: id,
      success: res => {
        that.data.subForm = res.result
        that.setData(that.data)
        that.setData({
          transindex: that.data.transArray.indexOf(res.result.trafModeValue)
        })
        wx.setStorageSync("orderInfo", that.data)
      }
    })
  },
  saveDate(){
    let that = this
    wx.setStorage({
      key: 'orderInfo',
      data: that.data,
    })
  },
  getTrans:function(){
    let that = this
    let param = wx.getStorageSync('params').SAAS_TRANSPORT_TYPE
    if (param){
      let arr = []
      for (let a in param) {
        arr.push(param[a].nameField)
      }
      that.data.transArray = arr
      that.data.objtransArray = param
      that.setData(that.data)
    }else{
      that.getparam()
    }
  },
  getparam(){
    let that = this
    let tab = { tableNames: ['SAAS_TRANSPORT_TYPE', 'SAAS_TRADE_MODEL'] }
    wx.ajax({
      url: 'API@saas-dictionary/dictionary/getParam',
      data: tab,
      success: res => {
        wx.setStorage({
          key: 'params',
          data: res.result,
        })
        that.getTrans()
      }
    })
  },
  bindtranChange(e){
    let that = this
    that.data.subForm.trafMode = that.data.objtransArray[e.detail.value].codeField
    that.setData({
      transindex: e.detail.value
    })
  },
  // 暂存
  saveOrder(e){
    let that = this
    let url = 'ccba/entrust/saveEntrust'
    if (!that.checkReq(that)) {
      return
    }

    wx.ajax({
      url: 'API@dec-common/'+url,
      data: [{ ...that.data.subForm, entrustType: '0' }],
      success: res => {
        wx.showToast({
          title: '暂存成功',
        })
        that.data.subForm.entrustHeadPid = res.result.entrustHeadPid
        that.setData(that.data)
        this.saveDate()
        wx.reLaunch({
          url: './allBill/allBillList?iEFlag=' + this.data.subForm.iEFlag
        })
      }
    })
  },
  // 接单暂存
  receiveDec() {
    let that = this
    let url = '/ccba/iOrderTake/addIOrder'
    if(this.data.subForm.iEFlag === 'E') {
      url = '/ccba/eOrderTake/addEOrder'
    }
    if (!that.checkReq(that)) {
      return
    }
    wx.ajax({
      url:'API@dec-common'+url,
      data: [that.data.subForm],
      success: res => {
        wx.showToast({
          title: '暂存成功',
        })
        this.data.subForm.innerNo = res.result
        this.setData(this.data)
        this.saveDate()
        wx.reLaunch({
          url: './allBill/allBillList?iEFlag=' + this.data.subForm.iEFlag
        })
      }
    })
  },
 
  checkReq(that){
    if (that.data.orderFlag === '1' && that.data.subForm.beEntrustInfoVOs.length === 0 ) {
      wx.showToast({
        title: '请选择受托企业',
        icon: 'none'
      })
      return false
    }
    if (!that.data.subForm.companyId && that.data.orderFlag === '2') {
      wx.showToast({
        title: '请选择委托客户',
        icon: 'none'
      })
      return false
    }
    return true
  },
  gouToStep2(){
    let that = this
    if(!that.checkReq(that)){
      return
    }
    this.saveDate()
    wx.navigateTo({
      url: 'createOrder',
    })
  },
  // 物理删除企业列表项
  falseDel(e) {
    let index = e.currentTarget.dataset.idx
    this.data.subForm.beEntrustInfoVOs.splice(index,1)
    this.setData({
      'subForm.beEntrustInfoVOs': this.data.subForm.beEntrustInfoVOs
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  selectCheck(e){
    let that = this
    let data = e.currentTarget.dataset.checkdata.split('-')
    if (that.data.isEdit && data[0] === 'iEFlag' && that.data.orderFlag == '2'){
      return
    }
    that.data.subForm[data[0]] = data[1]
    // 选择为报关单时,decType默认为 0
    if(data[1] === 'dec') {
      that.data.subForm['decType'] = '0'
    }else {
      that.data.subForm['decType'] = ''
    }
    if(data[1] !== 'I' || data[1] !== 'E') {
      wx.setStorageSync('decFlag',data[1])
    }
    this.setData(that.data)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.setData(that.data)
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