// pages/order/newOrderCorp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subForm:{
      entrustBusiness:'dec',
      beEntrustCompanyScc:'',
      beEntrustCompanyName:'',
      note:''
    },
    code:'',
    iEFlag:'',
    from:'',// 记录从哪个页面跳转过来的
    type:'',
    index:'',
    showcorps:false,
    transindex:'',
    corpArr:[],
    orderFlag:'',
    isSave: false // 是否暂存过的 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.entrustInfoVOs) { // 是从详情中受托方编辑跳转过来的
      this.setData({
        subForm: JSON.parse(options.entrustInfoVOs),
        from: 'detail',
        code: options.code,
        iEFlag: options.iEFlag
      })
      return
    }
    let that = this
    if (options.corp && options.type === 'edit'){
      that.setData({
        subForm: JSON.parse(options.corp),
        type: options.type,
        index: options.index,
      })
    }
    that.setData({ orderFlag: wx.getStorageSync("orderFlag")})
    // 受托企业大于2条时才可以且只有暂存过的可以删除,否则进行物理删除
    let list = wx.getStorageSync('orderInfo').subForm.beEntrustInfoVOs
    if(list) {
      let temp = list.filter(v => {
        return v.innerNo
      })
      this.setData({
        isSave: temp.length > 1 ? true: false
      })
    }
  },
  selectCheck: function(e){
    let that = this
    let data = e.currentTarget.dataset.checkdata.split('-')
    
    that.data.subForm[data[0]] = data[1]
    wx.setStorageSync('decFlag', data[1])
    this.setData(that.data)
  },
  inputNote(e){
    let that = this
    that.data.subForm.note = e.detail.value
    that.setData(that.data)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

  },
  corpFin:function(){
    if(this.data.from === 'detail') {
      this.replaceBeEntrust()
      return
    }
    let that = this
    if (!that.data.subForm.beEntrustCompanyScc){
      wx.showToast({
        title: '请选择公司',
        icon:'none'
      })
      return
    }
    if(wx.getStorageSync('orderFlag') ==='1'){
      let temp = wx.getStorageSync('orderInfo').subForm.beEntrustInfoVOs
      let cond = [false, '']
      temp.some(v => {
        if (v.entrustBusiness.includes(that.data.subForm.entrustBusiness)) {
          cond = [true, v.beEntrustCompanyScc, temp.indexOf(v)]
        }
      })
      if ((cond[0] && that.data.type !== 'edit') || (cond[0] && that.data.type == 'edit'&& that.data.index != cond[2])) {
        wx.showToast({
          title: '已存在该类型企业',
          icon: 'none'
        })
        return
      }
      }
    // if (that.data.subForm.entrustBusiness == 'invt'){
    //   let forchange = wx.getStorageSync('orderInfo')
    // }
    //   that.data.setData()
    // }
    
    // 本地存储委托信息 dec or log or invt
    // wx.setStorageSync('decFlag', this.data.subForm.entrustBusiness)
    if (wx.getStorageSync('orderFlag') === '1'){
      let pages = getCurrentPages()
      if (that.data.type === 'edit') {
        pages[pages.length - 2].data.subForm.beEntrustInfoVOs[that.data.index] = that.data.subForm
        wx.navigateBack({
          delta: 1
        })
      } else {
        pages[pages.length - 2].data.subForm.beEntrustInfoVOs.push(that.data.subForm)
        wx.navigateBack({
          delta: 1
        })
      }
    }else{
      let pages = getCurrentPages()
      pages[pages.length - 2].data.subForm.company = that.data.subForm.beEntrustCompanyName
      pages[pages.length - 2].data.subForm.companyId = that.data.subForm.corpId
      wx.navigateBack({
        delta: 1
      })
    
    }
    
  },
  // 更换受多方
  replaceBeEntrust() {
    wx.ajax({
      url:'API@dec-common/ccba/entrust/replaceBeEntrust',
      data: this.data.subForm,
      success: () => {
        wx.redirectTo({
          url:`./allBill/billDetail?from=changeCrop&code=${this.data.code}&IEflag=${this.data.iEFlag}&headPid=${this.data.subForm.entrustHeadPid}`
        })
      },
      other:(res) => {
        if(res.code === '0001') {
          wx.showToast({
            icon:'none',
            title: res.message,
            duration: 2000,
            success() {
              wx.redirectTo({
                url:`./allBill/billDetail?from=changeCrop&code=${this.data.code}&IEflag=${this.data.iEFlag}&headPid=${this.data.subForm.entrustHeadPid}`
              })
            }
          })
        }
      }
    })
  },
  // 删除受托方
  delCorp() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除受托企业信息?',
      success (res) {
        if (res.confirm) {
          let pages = getCurrentPages()
          if (that.data.subForm.beEntrustInfoPid){
            wx.ajax({
              url: 'API@dec-common/ccba/entrust/deleteBeEntrust',
              data: that.data.subForm,
              success: res => {
                pages[pages.length - 2].data.subForm.beEntrustInfoVOs.splice(that.data.index,1)
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }else{
            pages[pages.length - 2].data.subForm.beEntrustInfoVOs.splice(that.data.index, 1)
            wx.navigateBack({
              delta: 1
            })
        } 
        }
      }
    })
  },
  getCorps(q){
    let that = this
    if(q.detail.value.length<2){
      that.setData({
        showcorps: false
      })
      return
      }
    wx.ajax({
      url: 'API@login/corp/getCorpByCondAssignProp',
      data: {
        corpName: q.detail.value,
        "returnProps": ["corpName",'corpId','sccCode']
      },
      success: res => {
        that.setData({
          corpArr: JSON.parse(JSON.stringify(res.result)),
          showcorps:true
        })
      }
    })
  },
  selectCorp(e){
    let that = this
    that.data.subForm.beEntrustCompanyScc = e.currentTarget.dataset.corp.sccCode
    that.data.subForm.beEntrustCompanyName = e.currentTarget.dataset.corp.corpName
    that.data.subForm.corpId = e.currentTarget.dataset.corp.corpId
    that.data.showcorps = false
    that.setData(that.data)
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