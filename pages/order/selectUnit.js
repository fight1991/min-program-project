// pages/order/selectUnit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subForm:{

    },
    colum:'',
    code:'',
    coScc:'',
    storCorp:[],
    type:'',
    corpArr:[],
    showcorps:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.setNavigationBarTitle({
      title: options.title
    })
    if(wx.getStorageSync('orderFlag') ==='2'){
      options.type = options.type == 'operate' ? 'inside' : (options.type == 'process' ? 'cususe' : options.type)
    }
    switch (options.type) {
      case 'inside':
        that.data.colum = 'tradeName'
        that.data.code = 'tradeCode'
        that.data.coScc = 'tradeCoScc'
        break;
      case 'cususe':
        that.data.colum = 'ownerName'
        that.data.code = 'ownerCode'
        that.data.coScc = 'ownerCodeScc'
        break;
      case 'outside':
        that.data.colum = 'overseasConsignorCname'
        that.data.code = 'overseasConsignorCode'
        break;
      case 'operate':
        that.data.colum = 'operateName'
        that.data.code = 'operateCode'
        that.data.coScc = 'operateScc'
        break;
      case 'process':
        that.data.colum = 'processName'
        that.data.code = 'processCode'
        that.data.coScc = 'processScc'
        break;
      default:
        // 默认代码块
    } 
    // 联系人历史记录去重
    let temp = wx.getStorageSync(options.type+'corp')
    that.data.type = options.type,
    that.data.storCorp = temp,
    that.data.subForm = wx.getStorageSync('orderInfo').subForm
    that.setData(that.data)

  },
  // 数组对象去重
  uniqueObj(arr,params) {
    let newArr = []
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
  selectCorp(e) {
    let that = this
    that.data.subForm[that.data.coScc] = e.currentTarget.dataset.corp.sccCode
    that.data.subForm[that.data.colum] = e.currentTarget.dataset.corp.corpName
    that.data.subForm[that.data.code] = e.currentTarget.dataset.corp.tradeCode
    that.data.showcorps = false
    that.setData(that.data)
  },
  inputNote(e){
    let that = this
    if (e.currentTarget.id === 'Code'){
    that.data.subForm[that.data.code] = e.detail.value
    } else if (e.currentTarget.id === 'CoScc'){
      that.data.subForm[that.data.coScc] = e.detail.value
    }else{
      that.data.subForm[e.currentTarget.id] = e.detail.value
    }
    that.setData(that.data)
  },
  backdata(e){
    let that = this
    let x = that.data.subForm
    let i = e.currentTarget.dataset.item
    if (['inside', 'cususe', 'manuse', 'operate', 'process'].indexOf(that.data.type)>=0) {
      x[that.data.coScc] = i[that.data.coScc]
      x[that.data.colum] = i[that.data.colum]
      x[that.data.code] = i[that.data.code]
    } else if (that.data.type === 'outside') {
      x.overseasConsignorCode = i.overseasConsignorCode
      x.overseasConsignorCname = i.overseasConsignorCname
    }
    that.setData(that.data)
  },
  corpFin(){
    let that = this
    if ((that.data.type === 'inside' && !that.data.subForm.tradeName) ||
      (that.data.type === 'cususe' && !that.data.subForm.ownerName) || 
      (that.data.type === 'manuse' && !that.data.subForm.tradeName) ||
      (that.data.type === 'outside' && !that.data.subForm.overseasConsignorCname) ||
      (that.data.type === 'operate' && !that.data.subForm.operateName) || 
      (that.data.type === 'process' && !that.data.subForm.processName)){
            wx.showToast({
              title: '请输入公司',
              icon:'none'
            })
            return
    }
    let stor = wx.getStorageSync(that.data.type + 'corp')
    if (!stor) {
      wx.setStorageSync(that.data.type + 'corp', [that.data.subForm])
    } else {
      let ifadd = true
      if(stor.length>=5){
        stor = stor.splice(1, 4)
      }
      for(let x in stor){
        if (stor[x][that.data.colum] == that.data.subForm[that.data.colum]){
          ifadd = false
          stor[x] = that.data.subForm
          wx.setStorageSync(that.data.type + 'corp', [...stor])
        }
      }
      if (ifadd){
         wx.setStorageSync(that.data.type + 'corp', [...stor,that.data.subForm])
      }
    }
      let orderIf = wx.getStorageSync('orderInfo')
    if (['inside', 'cususe', 'manuse', 'operate', 'process'].indexOf(that.data.type) >= 0){
      orderIf.subForm[that.data.coScc] = that.data.subForm[that.data.coScc]
      orderIf.subForm[that.data.colum] = that.data.subForm[that.data.colum]
      orderIf.subForm[that.data.code] = that.data.subForm[that.data.code]
    } else if (that.data.type === 'outside'){
      orderIf.subForm.overseasConsignorCode = that.data.subForm.overseasConsignorCode
      orderIf.subForm.overseasConsignorCname = that.data.subForm.overseasConsignorCname
    }
      wx.setStorageSync('orderInfo', orderIf)
      wx.navigateBack({
        delta:1
      })
  
  },
  getCorps(q) {
    let that = this
    if (q.detail.value.length < 2) { 
      that.setData({
        corpArr: [],
        showcorps:false
      })
      return 
    }
    wx.ajax({
      url: 'API@login/corp/getCorpByCondAssignProp',
      data: {
        corpName: q.detail.value,
        "returnProps": [
          'sccCode', 'tradeCode', 'corpId','corpName'
        ],
      },
      isLoading:false,
      success: res => {
        let temp = [{'corpName': q.detail.value},...JSON.parse(JSON.stringify(res.result))]
        temp.push()
        that.setData({
          corpArr: temp,
          showcorps: temp.length > 0 ? true : false
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