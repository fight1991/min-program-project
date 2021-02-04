// pages/order/allBill/deliveryInfo.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subForm:{},
    orderFlag:'',
    type:'',
    countryuindex:'',
    countrys:[],
    countrysName:[],
    privindex: '',
    privs: [],
    privsName:[],
    areaindex: '',
    areas: [],
    areasName:[],
    shwostor:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.setNavigationBarTitle({
      title: options.title
    })
    let flag = wx.getStorageSync('orderFlag')
    that.data.type = options.type
    let orderInfo =  wx.getStorageSync('orderInfo').subForm 
    if(options.user){
      if (flag=='1'){
        if (options.type == 'get'){
          orderInfo.pickUpGPhone = JSON.parse(options.user).mobile
          orderInfo.pickUpGContacts = JSON.parse(options.user).userName
        }else{
          orderInfo.deliverGContacts = JSON.parse(options.user).userName
          orderInfo.deliverGPhone = JSON.parse(options.user).mobile
        }
      }else{
        if (!orderInfo.agentSendCarWithBLOBsVO) {
          orderInfo.agentSendCarWithBLOBsVO = {}
        }
        if (options.type == 'get') {
          orderInfo.agentSendCarWithBLOBsVO.ref2 = JSON.parse(options.user).mobile
          orderInfo.agentSendCarWithBLOBsVO.ref1 = JSON.parse(options.user).userName
        } else {
          orderInfo.agentSendCarWithBLOBsVO.ref3 = JSON.parse(options.user).userName
          orderInfo.agentSendCarWithBLOBsVO.ref4 = JSON.parse(options.user).mobile
        }
      }
      
    }
    if (flag=='1'){
    that.getCountry({ currentTarget: { dataset: { sortitem: orderInfo}}})
    }else{
      that.getCountry({ currentTarget: { dataset: { sortitem: orderInfo.agentSendCarWithBLOBsVO } } })
    }
    // 联系人去重处理
    let telList = wx.getStorageSync(options.type+flag+'Info')
    that.setData({
      orderFlag: flag,
      subForm: orderInfo,
      type: options.type,
      shwostor: telList
    })
  },
  // 联系人手动输入
  getContactNameBySelf(e) {
    let value = e.detail.value.trim()
    if(value) {
      if(this.data.orderFlag =='1'){
        if (this.data.type == 'get') {
          this.setData({
            'subForm.pickUpGContacts': value
          })
        } else {
          this.setData({
            'subForm.deliverGContacts': value
          })
        }
      }else{
        if (this.data.type == 'get') {
          this.setData({
            'subForm.agentSendCarWithBLOBsVO.ref1': value
          })
        } else {
          this.setData({
            'subForm.agentSendCarWithBLOBsVO.ref3': value
          })
        }
      }
      
    }
  },
  // 电话号码手动输入
  getContactTelBySelf(e) {
    let value = e.detail.value.trim()
    if(value) {
      if (this.data.orderFlag == '1') {
        if(this.data.type == 'get') {
          this.setData({
            'subForm.pickUpGPhone': value
          })
        }else {
          this.setData({
            'subForm.deliverGPhone': value
          })
        }
      }else{
        if (this.data.type == 'get') {
          this.setData({
            'subForm.agentSendCarWithBLOBsVO.ref2': value
          })
        } else {
          this.setData({
            'subForm.agentSendCarWithBLOBsVO.ref4': value
          })
        }
      }
    }
  },
  bindCountryChange(e){
    let that = this
    that.data.countryuindex = e.detail.value
    that.setData(that.data)
    that.getPriv()
  },
  bindprivChange(e) {
    let that = this
    that.data.privindex = e.detail.value
    that.setData(that.data)
    that.getCity()
  },
  bindareaChange(e) {
    let that = this
    that.setData({
      areaindex: e.detail.value
    })
  },
  backstor(e){
    let that = this
    
    let param = e.currentTarget.dataset.sortitem
    let ifsend = that.data.type == 'send'
    for (let a in that.data.countrys){
      if (that.data.countrys[a].code === param[ifsend ? 'deliverGCountry' :'pickUpGCountry']){
        that.data.countryuindex = a
      }
    }
    if (!that.data.subForm.agentSendCarWithBLOBsVO){
    that.data.subForm.agentSendCarWithBLOBsVO={}
    }
    if (that.data.orderFlag == '2' && ifsend){
      that.data.subForm.agentSendCarWithBLOBsVO.ref3 = param.ref3
      that.data.subForm.agentSendCarWithBLOBsVO.ref4 = param.ref4
      that.data.subForm.agentSendCarWithBLOBsVO.deliveryAddrR = param.deliveryAddrR
    } else if (that.data.orderFlag == '2'){
      that.data.subForm.agentSendCarWithBLOBsVO.ref1 = param.ref1
      that.data.subForm.agentSendCarWithBLOBsVO.ref2 = param.ref2
      that.data.subForm.agentSendCarWithBLOBsVO.deliveryAddrS = param.deliveryAddrS
    }
    that.setData({
      subForm: that.data.orderFlag == '1' ? { ...that.data.subForm, ...param } : that.data.subForm,
      countryuindex: that.data.countryuindex
    })
    
      this.getPriv(param[ifsend ? 'deliverGProvince' : 'pickUpGProvince'], param[ifsend ? 'deliverGCity' : 'pickUpGCity'])
    
    
    
  },
  // 数组对象去重
  uniqueObj(arr,params) {
    let newArr = []
    if(!Array.isArray(arr)) {
      return newArr
    }
    if(arr.length === 0) {
      return newArr
    }
    arr.forEach(v => {
      // 假设没有重的
      let isUnique = false
      newArr.forEach(item => {
        if(v[params] === item[params]) {
          isUnique = true
        }
      })
      if(!isUnique) {
        newArr.push(v)
      }
    })
    return newArr
  },
  getCity(cityno){
    let that = this
    wx.ajax({
      url: 'API@saas-dictionary/dictionary/cascadeGetArea',
      data: {
        code: that.data.privs[that.data.privindex].code,
        type: '2'
      },
      success: res => {
        let cityname = []
        for (let a in res.result) {
          cityname.push(res.result[a].name)
        }
        if (cityno) {
          for (let a in res.result) {
            if (res.result[a].code === cityno) {
              that.data.areaindex = a
            }
          }
        }
        that.setData({
          areaindex:that.data.areaindex,
          areas: res.result,
          areasName: cityname
        })
      }
    })
  },
  getPriv(pivno,cityno){
    let that = this
    wx.ajax({
      url: 'API@saas-dictionary/dictionary/cascadeGetArea',
      data: {
        code: that.data.countrys[that.data.countryuindex].code,
        type: '1'
      },
      success: res => {
      let privname = []
      for (let a in res.result) {
        privname.push(res.result[a].name)
      }
      if (pivno) {
        for (let a in res.result) {
          if (res.result[a].code === pivno) {
            that.data.privindex = a
            }
        }
      }
      that.setData({
        privs: res.result,
        privindex: that.data.privindex,
        privsName: privname,
        areaindex: '',
        areas: [],
        areasName: []
      })
      that.getCity(cityno)
    }
    })
  },
  getCountry(modelitem) {
    let that = this
    wx.ajax({
      url: 'API@saas-dictionary/dictionary/cascadeGetArea',
      data: {
        codeId: "0",
        type: '0'},
      success: res => {
        
        let countryname = []
        for (let a in res.result){
          countryname.push(res.result[a].name)
        }
        that.setData({
          countrys:res.result,
          countrysName: countryname,
          areaindex: '',
          areas: [],
          areasName: [],
          privindex: '',
          privs: [],
          privsName: []
        })
        that.backstor(modelitem)
      }
    })
  },
  inputThis(e){
    let that = this
    if(that.data.orderFlag=='1'){
    that.data.subForm[that.data.type== 'get' ? 'pickUpGAddress' : 'deliverGAddress'] = e.detail.value
    }else{
      that.data.subForm.agentSendCarWithBLOBsVO[that.data.type == 'get' ? 'deliveryAddrS' : 'deliveryAddrR'] = e.detail.value
    }
    that.setData(that.data)
  },
  goToContact() {
    let that = this
    wx.redirectTo({
      url: './contact?type='+that.data.type
    })
  },
  corpFin(e){
    let that = this
    let x = wx.getStorageSync('orderInfo')
    let obj = that.data.subForm
    let stor={}
    if(that.data.type=='send'){
      stor = {
        deliverGCountry: (that.data.countryuindex && that.data.countryuindex >= 0) ? that.data.countrys[that.data.countryuindex].code : '',
        deliverGProvince: (that.data.privs.length > 0 && that.data.privindex >= 0 ) ? that.data.privs[that.data.privindex].code:'',
        deliverGCity: (that.data.areas.length > 0 && that.data.areaindex >= 0 ) ?that.data.areas[that.data.areaindex].code:'',
        deliverGCountryValue: (that.data.countryuindex && that.data.countryuindex >= 0) ? that.data.countrys[that.data.countryuindex].name : '',
        deliverGProvinceValue: (that.data.privs.length > 0 && that.data.privindex >= 0 ) ? that.data.privs[that.data.privindex].name:'',
        deliverGCityValue:(that.data.areas.length > 0 && that.data.areaindex >= 0 ) ? that.data.areas[that.data.areaindex].name:'',
        deliverGContacts : that.data.subForm.deliverGContacts,
        deliverGPhone: that.data.subForm.deliverGPhone,
        deliverGAddress: that.data.subForm.deliverGAddress || ''
      }
    }else{
      stor = {
        pickUpGCountry: (that.data.countryuindex && that.data.countryuindex >= 0) ? that.data.countrys[that.data.countryuindex].code : '',
        pickUpGProvince: (that.data.privs.length > 0 && that.data.privindex >= 0 ) ? that.data.privs[that.data.privindex].code:'',
        pickUpGCity: (that.data.areas.length > 0 && that.data.areaindex >= 0 ) ?that.data.areas[that.data.areaindex].code:'',
        pickUpGCountryValue: (that.data.countryuindex && that.data.countryuindex >= 0) ? that.data.countrys[that.data.countryuindex].name : '',
        pickUpGProvinceValue: (that.data.privs.length > 0 && that.data.privindex >= 0 ) ?that.data.privs[that.data.privindex].name:'',
        pickUpGCityValue: (that.data.areas.length > 0 && that.data.areaindex >= 0 ) ? that.data.areas[that.data.areaindex].name:'',
        pickUpGPhone: that.data.subForm.pickUpGPhone,
        pickUpGContacts: that.data.subForm.pickUpGContacts,
        pickUpGAddress: that.data.subForm.pickUpGAddress || ''
      }
    }
    if(that.data.orderFlag === '1'){
      x.subForm = {...x.subForm,...stor}
    }else{
      if (!x.subForm.agentSendCarWithBLOBsVO){
        x.subForm.agentSendCarWithBLOBsVO = {}
      }
      if (that.data.type == 'send'){
        x.subForm.agentSendCarWithBLOBsVO.ref3 = obj.agentSendCarWithBLOBsVO.ref3
        x.subForm.agentSendCarWithBLOBsVO.ref4 = obj.agentSendCarWithBLOBsVO.ref4
        x.subForm.agentSendCarWithBLOBsVO.deliveryAddrR = obj.agentSendCarWithBLOBsVO.deliveryAddrR
      }else{
        x.subForm.agentSendCarWithBLOBsVO.ref1 = obj.agentSendCarWithBLOBsVO.ref1
        x.subForm.agentSendCarWithBLOBsVO.ref2 = obj.agentSendCarWithBLOBsVO.ref2
        x.subForm.agentSendCarWithBLOBsVO.deliveryAddrS = obj.agentSendCarWithBLOBsVO.deliveryAddrS
      }
      stor = { ...x.subForm.agentSendCarWithBLOBsVO,...stor}
      x.subForm.agentSendCarWithBLOBsVO = stor
    }
    let nowstor = wx.getStorageSync(that.data.type + that.data.orderFlag+'Info')
    if (!nowstor) {
      wx.setStorageSync(that.data.type + that.data.orderFlag + 'Info', [stor])
    } else {
      nowstor = [stor,...nowstor]
      if (that.data.orderFlag == '1') {
        nowstor = that.uniqueObj(nowstor, that.data.type === 'send' ? 'deliverGPhone' : 'pickUpGPhone')
      } else {
        nowstor = that.uniqueObj(nowstor, that.data.type === 'send' ? 'ref4' : 'ref2')
      }
      if (nowstor.length >= 6) {
        nowstor = nowstor.splice(1, 5)
      }
      wx.setStorageSync(that.data.type + that.data.orderFlag + 'Info', nowstor)
    }
    wx.setStorageSync('orderInfo', x)
    wx.navigateBack({
      delta:1
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