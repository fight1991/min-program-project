// pages/order/order.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: app.globalData.winHeight,
    subForm:{
      mtpckEndprdTypecd:'I',
      ediId:'1',
      entrustHeadPid:'',
      manualNo:'',
      goodsOutline:'',
      packNo:'',
      wrapType:'',
      grossWt:'',
      netWt:'',
      billtype:'',
      tradeTerms:'',
      sysDocVOs:[],
      decType:'',
      isfoucus: true      // 切换虚拟textarea
    },
    falseInfo: '描述货物信息',
    showCorpFlag: [],
    listindex:'',
    orderFlag:'',
    listTypes:[
      ['普通清单', '先入区后报关', '简单加工', '保税展示交易', '区内流转', '区港联动', '保税电商','一纳成品内销'],
      ['0','3','4','5','6','7','8','9']
    ],
    tradeindex:'',
    tradeTypes:[],
    warpindex: '',
    warpTypes: [], // 包装种类
    decType: [] , //报关单类型
    decIndex: 0,
    decType2: [
      ['报关单','转关提前报关单','备案清单','转关提前备案清单'],
      ['0','1','2','3']
    ],
    isContainLog: false, // 是否包含物流业务
    isContainDec: false, // 是否包含报关单业务
    isContainInvt: false, // 是否包含核注清单业务
  },
  inputThis:function(e){
    let that = this
    that.data.subForm[e.currentTarget.id] = e.detail.value
    that.setData(that.data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.data.subForm = wx.getStorageSync('orderInfo').subForm
    that.setData(that.data)
    that.getTrades()
    that.getWarps()
    that.data.subForm = wx.getStorageSync('orderInfo').subForm
    if (that.data.subForm.iEFlag == 'E'){
      that.data.decType2 =[
        ['报关单', '转关提前报关单', '备案清单', '转关提前备案清单', '出口二次转关'],
        ['0', '1', '2', '3', '4']
      ]
    }
    that.setData(that.data)
    that.justType()
    that.getDecType()
    // 判断委托业务类型
    that.getshowCorpFlag()
    // 清单类型返填
    if(that.data.subForm.billtype) {
      let index = that.data.listTypes[1].indexOf(that.data.subForm.billtype)
      that.setData({
        listindex: index
      })
    }
    if (that.data.subForm.tradeTerms) {
      let index = that.data.tradeTypes[1].indexOf(that.data.subForm.tradeTerms)
      that.setData({
        tradeindex: index
      })
    }
    // 包装种类返填
    if(that.data.subForm.wrapType) {
      let index = that.data.warpTypes[1].indexOf(that.data.subForm.wrapType)
      that.setData({
        warpindex: index
      })
    }
    that.setData({
      orderFlag: wx.getStorageSync('orderFlag')
    })
  },
  getshowCorpFlag(){
    let that = this
    for (let a in that.data.subForm.beEntrustInfoVOs){
      if (that.data.showCorpFlag.indexOf(that.data.subForm.beEntrustInfoVOs[a].entrustBusiness)<0){
        that.data.showCorpFlag.push(that.data.subForm.beEntrustInfoVOs[a].entrustBusiness)
      }
    }
    that.setData(that.data)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getWarps:function(){
    let that = this
    let param = wx.getStorageSync('params').SAAS_WRAP
    if (param) {
      let arr = []
      let names = []
      let code = []
      for (let a in param) {
        names.push(param[a].nameField)
        code.push(param[a].codeField)
      }
      arr = [names, code]
      that.data.warpTypes = arr
      that.setData(that.data)
    } else {
      that.getparam()
    }
  },
  getTrades: function () {
    let that = this
    let param = wx.getStorageSync('params').SAAS_TRADE_MODEL
    if (param) {
      let arr = []
      let names = []
      let code = []
      for (let a in param) {
        names.push(param[a].nameField)
        code.push(param[a].codeField)
      }
      arr = [names, code]
      that.data.tradeTypes = arr
      that.setData(that.data)
    } else {
      that.getparam()
    }
  },
  getDecType() { // 获取核注清单中的报关单类型
    let that = this
    let param = wx.getStorageSync('params')['SAAS_EMS_DEC_TYPE']
    if (param) {
      let arr = []
      let names = []
      let code = []
      for (let a in param) {
        names.push(param[a].nameField)
        code.push(param[a].codeField)
      }
      arr = [names, code]
      that.data.decType = arr
      if (!!that.data.subForm.decType) {
        if (that.data.isContainInvt) {
          let index = that.data.decType[1].indexOf(that.data.subForm.decType)
          that.setData({
            decIndex: index ==-1?0:index
          })
        } else if (that.data.isContainDec) {
          let index = 0
          if(wx.getStorageSync('orderFlag') ==='2'){
          index = that.data.decType2[1].indexOf(that.data.subForm.declTrnrel ? that.data.subForm.declTrnrel : '0' )
          }else{
          index = that.data.decType2[1].indexOf(that.data.subForm.decType ? that.data.subForm.decType : '0')
          }
          that.data.decIndex =  index == -1 ? 0 : index
          that.data.subForm.decType= index == -1 ? '' : that.data.subForm.decType
        }
      }
      that.setData(that.data)
    } else {
      that.getparam()
    }
  },
  bindTradeChange(e){
    let that = this
    that.data.subForm.tradeTerms = that.data.tradeTypes[1][e.detail.value]
    that.setData({
      tradeindex: e.detail.value
    })
  },
  bindWrapChange(e){
    let that = this
    that.data.subForm.wrapType = that.data.warpTypes[1][e.detail.value]
    that.setData({
      warpindex: e.detail.value
    })
  },
  bindDecChange(e) {
    let that = this
    that.data.subForm.decType = that.data.decType[1][e.detail.value]
    that.setData({
      decIndex: e.detail.value
    })
  },
  bindDecChange2(e) {
    let that = this
    if(that.data.orderFlag == '2'){
    that.data.subForm.declTrnrel = that.data.decType2[1][e.detail.value]
    }else{
    that.data.subForm.decType = that.data.decType2[1][e.detail.value]
    }
    that.setData({
      decIndex: e.detail.value
    })
  },
  getparam() {
    let that = this
    let tab = { tableNames: ['SAAS_TRANSPORT_TYPE', 'SAAS_TRADE_MODEL','SAAS_WRAP','SAAS_EMS_DEC_TYPE'] }
    wx.ajax({
      url: 'API@saas-dictionary/dictionary/getParam',
      data: tab,
      success: res => {
        wx.setStorageSync('params',res.result)
        that.getTrades()
        that.getWarps()
        that.getDecType()
      }
    })
  },
  // 接单暂存
  receiveDec() {
    let that =this
    if (that.data.subForm.billtype == '4' || that.data.subForm.billtype == '9') {
      wx.showToast({
        title: '暂不支持生成清单类型为“简单加工”和“一纳成品内销”的核注清单',
        icon: 'none'
      })
      return
    } 
    if ((that.data.isContainInvt && that.data.subForm.decType == '') ||that.data.decIndex =='0' ){
      that.data.subForm.decType ='1'
    }
    let url = '/ccba/iOrderTake/addIOrder'
    if (that.data.subForm.iEFlag === 'E') {
      url = '/ccba/eOrderTake/addEOrder'
    }
    wx.ajax({
      url:'API@dec-common'+url,
      data: [that.data.subForm],
      success: res => {
        wx.showToast({
          title: '暂存成功',
        })
        that.data.subForm.innerNo = res.result
        that.setData(that.data)
        that.saveDate(that)
        wx.reLaunch({
          url: './allBill/allBillList?iEFlag=' + that.data.subForm.iEFlag
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  justType() { // 判断类型
    let that =this
    let orderFlag = wx.getStorageSync("orderFlag")
    let temp = that.data.subForm
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
      let flag = that.data.subForm.type
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
    that.data.isContainDec = tempDec
    that.data.isContainInvt = tempInvt
    that.data.isContainLog = tempLog
    that.data.subForm.decType = (tempDec && !tempInvt && !that.data.subForm.decType) ? '0' : ( tempInvt &&        
!that.data.subForm.decType)?'1': that.data.subForm.decType 
    that.setData(that.data)
  },
  onShow: function () {
    let that = this
    that.setData(that.data)
  },
  bindListChange(e) {
    let that = this
    that.data.subForm.billtype = that.data.listTypes[1][e.detail.value]
    that.setData({
      listindex: e.detail.value
    })
  },
  // 聚焦切换
  isfoucus: function () {
    this.setData({
      isfoucus: false,
      falseInfo:'',
    })
  },
  // 失焦切换
  textarea: function (e) {
    console.log(e)
    this.setData({
      'subForm.goodsOutline':e.detail.value,
      isfoucus: true,
      falseInfo: '描述货物信息'
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // 选择成品料件标志
  selectCheck: function(e){
    let that = this
    let data = e.currentTarget.dataset.checkdata.split('-')
    that.data[data[0]] = data[1]
    this.setData(that.data)
  },
  gotoLicense:function(e){
    let that = this
    that.saveDate(that)
    wx.navigateTo({
      url: 'License'
    })
  },
  // 暂存
  saveOrder(e) {
    let that = this
    if (that.data.subForm.billtype == '4' || that.data.subForm.billtype == '9') {
      wx.showToast({
        title: '暂不支持生成清单类型为“简单加工”和“一纳成品内销”的核注清单',
        icon: 'none'
      })
      return
    } 
    if ((that.data.isContainInvt && that.data.subForm.decType == '') || (that.data.isContainInvt && that.data.decIndex =='0')) {
      that.data.subForm.decType = '1'
    } else if (that.data.subForm.decType == '' || that.data.decIndex == '0'){
      that.data.subForm.decType = '0'
    }
    if(!that.checkForm()){return}
    wx.ajax({
      url: 'API@dec-common/ccba/entrust/saveEntrust',
      data: [{ ...that.data.subForm, entrustType: '0' }],
      success: res => {
        wx.showToast({
          title: '暂存成功',
        })
        that.data.subForm.entrustHeadPid = res.result.entrustHeadPid
        that.setData(that.data)
        that.saveDate(that)
        wx.reLaunch({
          url: './allBill/allBillList?iEFlag=' + this.data.subForm.iEFlag
        })
      }
    })
  },
  goutoStep3(){
    let that = this
    if(!that.checkForm()){
      return
    }
    that.saveDate(that)
    wx.navigateTo({
      url: 'sgoodsInfo'
    })
  },
  saveDate(that) {
    wx.setStorageSync("orderInfo", that.data)
  },
  checkForm(){
    let that = this
    let numreg = /^\d{1,9}$/
    let weightreg = /^\d{1,14}(\.\d{1,5})?$|^$/
    let ifpass = true
    let alerttitle = ''
    if (!that.data.subForm.manualNo && that.data.decFlag === 'invt') {
      ifpass = false
      alerttitle = '请输入手（账）册编号'
    } else if ( !/^(B|C|D|E|H|T|L)[A-Za-z0-9]{11}$/.test(that.data.subForm.manualNo) && that.data.isContainInvt){
      ifpass = false
      alerttitle = '手（账）册编号格式不正确'
    } else if (!that.data.subForm.billtype && that.data.isContainInvt) {
      ifpass = false
      alerttitle = '请选择清单类型'
    } else if (that.data.subForm.packNo && !numreg.test(that.data.subForm.packNo) && that.data.isContainInvt){
      ifpass = false
      alerttitle = '输入至多9位数字的件数'
    } else if (that.data.subForm.grossWt && !weightreg.test(that.data.subForm.grossWt)) {
      ifpass = false
      alerttitle = '输入至多14位整数5位小数的毛重'
    } else if (that.data.subForm.netWt && !weightreg.test(that.data.subForm.netWt)) {
      ifpass = false
      alerttitle = '输入至多14位整数5位小数的净重'
    }
    if (!ifpass){
      wx.showToast({
        title: alerttitle,
        icon:'none'
      })
      return false
    }
    return true
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})