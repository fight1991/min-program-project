// pages/order/allBill/billDetail.js
let app = getApp()
Page({
  data: {
    acceptApi:{
      // 提交
      submitDecI: '/ccba/iOrderTake/orderTakenToDec',
      submitDecE: '/ccba/eOrderTake/orderTakenToDec',
      invt: '/ccba/common/orderTakenToInvt', // 核注清单
      log: '/ccba/common/orderTakenToLog' // 物流
    },
    pageIndex: 0,
    hasMore: true,
    isLoading: true,
    winHeight: app.globalData.winHeight,
    orderFlag: '',
    headPid:'',
    refFlag:'', // 记录是否是自主
    innerNos:[], // 存储接单编号
    code:'',
    acceptBill:'',
    statusList:[],
    getEntrustDetail:{}, // 委托详情
    invtFlag: false, // 是否包含核注清单
    decFlag: false, // 是否包含报关单
    logFlag: false, // 是否包含物流作业
    statusFlag: false, // 委托状态
    IEflag:'I', // 记录进出口标志
    isOpen:[ true, true, true, true ], // 展开或隐藏按钮
    style:[ // 控制tab栏样式
      {
        borderBottom: '',
        color: '',
        isShow: false
      },
      {
        borderBottom: '2px solid #1195DD',
        color: '#1195DD',
        isShow: true
      },
      {
        borderBottom: '',
        color: '',
        isShow: false
      }
    ]
  },
  onLoad: function (options) {
    if(options.headPid) {
      let id = options.headPid
      let code = options.code
      let iEflag = options.IEflag
      this.setData({
        headPid: id,
        code: code,
        IEflag: iEflag,
        orderFlag: wx.getStorageSync('orderFlag') || ''
      })
      this.data.orderFlag === '1' ? this.getEntrustDetail(id) : this.getOrderDetail(id)
      wx.setNavigationBarTitle({
        title:this.data.orderFlag === '1' ? '委托详情':'接单详情'
      })
    }
  },
  // 切换tab栏
  getStatus(e) { 
    let { dataset: { index } } = e.target
    let { style } = this.data
    style.forEach((v, i) => {
      if(index == i) {
        v.borderBottom = '2px solid #1195DD'
        v.color = '#1195DD'
        v.isShow = true
      }else {
        v.borderBottom = ''
        v.color = ''
        v.isShow = false
      }
    })
    this.setData({
      style: style
    })
  },
  justyIsOpen(e) {
    let { dataset: { id } } = e.currentTarget
    let { isOpen } = this.data
    isOpen[id] = !isOpen[id]
    this.setData({
      isOpen: isOpen
    })
  },
  // 获取委托详情
  getEntrustDetail(id) {
    wx.ajax({
      url:'API@dec-common/ccba/entrust/getEntrustDetail',
      data:{
        entrustHeadPid: id
      },
      success: res => {
        this.setData({
          getEntrustDetail: res.result || {}
        })
        // 判断受托信息中有无核注清单和委托状态
        let list = res.result.beEntrustInfoVOs
        if(list && list.length > 0) {
          let flag1 = list.some( v => v.entrustBusiness.includes('invt'))
          let flag2 = list.some( v => v.entrustBusiness.includes('dec'))
          let flag3 = list.some( v => v.entrustBusiness.includes('log'))
          let num = list.map( v => v.innerNo)
          this.setData({
            innerNos: num,
            invtFlag: flag1,
            decFlag: flag2,
            logFlag: flag3,
            statusFlag: list[0]['beEntrustStatus'] === '1' ? true: false
          })
        }
        // 状态查询
        if(this.data.innerNos.length>0 && this.data.code) {
          this.statusListQuery()
        }
      }
    })
  },
  // 获取接单详情
  getOrderDetail(id) {
    let url = ''
    this.data.IEflag === 'I'? url='/ccba/iOrderTake/iOrderDetail': url='/ccba/eOrderTake/eOrderDetail'
    wx.ajax({
      url:'API@dec-common' + url,
      data: id,
      success: res => {
        this.setData({
          getEntrustDetail: res.result || {}
        })
        // 判断接单信息中有无核注清单和委托状态
        let list = res.result
        let flag1 = false, flag2 = false, flag3 = false
        if(list['type']) {
          if(list['type'].includes('invt')) {
            flag1 = true
          }else if(list['type'].includes('dec')) {
            flag2 = true
          }else {
            flag3 = true
          }
          this.setData({
            invtFlag: flag1,
            decFlag: flag2,
            logFlag: flag3,
            innerNos: [list.innerNo],
            statusFlag: list['status'] === '0' ? true: false,
            refFlag: list['ref5'] ? 'wei' : 'zi'
          })
        }
        // 状态查询
        if( this.data.innerNos.length >0 ) {
          this.statusListQuery()
        }
      }
    })
  },
  // 委托提交
  saveEntrust() {
    // 必填项校验
    if(!this.checkNeccasary()) {
      return
    }
    wx.ajax({
      url:'API@dec-common/ccba/entrust/saveEntrust',
      data: [{...this.data.getEntrustDetail,entrustType:'1'}],
      success: res => {
        this.setData({
          headPid: res.result.entrustHeadPid
        })
        wx.showToast({
          title: res.message,
          icon: 'success',
          success: () => {
            // 返回委托列表页
            wx.reLaunch({
              url:'./allBillList?entrustStatus=2&iEFlag=' + this.data.getEntrustDetail.iEFlag
            })
          }
        })
      }
    })
  },
  // 接单提交
  submitOrder() {
     // 必填项校验
     if(!this.checkNeccasary()) {
      return
    }
    let that = this
    let url = ''
    if(that.data.getEntrustDetail.type === 'dec') {
      if(that.data.getEntrustDetail.iEFlag === 'E') {
        url = that.data.acceptApi.submitDecE
      }else {
        url = that.data.acceptApi.submitDecI
      }
    }else {
      url = that.data.acceptApi[that.data.getEntrustDetail.type]
    }
    wx.ajax({
      url: 'API@dec-common' + url,
      data: that.data.getEntrustDetail,
      success: res => {
        wx.showToast({
          title: '提交成功',
        })
        wx.removeStorageSync('orderInfo')
        wx.reLaunch({
          url: './allBillList?iEFlag=' + that.data.getEntrustDetail.iEFlag
        })
      }
    })
  },
 // 必填项校验
 checkNeccasary() {
  // 手账册编号
  if(this.data.invtFlag && !this.data.getEntrustDetail.manualNo) {
    wx.showToast({
      title:'手账册编号不能为空',
      icon:'none'
    })
    return false
  }
  // 报关标志
  if(this.data.invtFlag && !this.data.getEntrustDetail.ediIdValue) {
    wx.showToast({
      title:'清单类型不能为空',
      icon:'none'
    })
    return false
  }
  return true
 },
  // 编辑时返回创建委托单第一步
  goToCreatOrder() {
    wx.redirectTo({
      url: `../orderInfo?headPid=${this.data.headPid}&code=${this.data.code}&iEFlag=${this.data.IEflag}`
    })
  },
  // 状态跟踪查询
  statusListQuery() {
    wx.ajax({
      url: 'API@dec-common/ccba/entrust/statusListQuery',
      data:{
        entrustCode: this.data.code || '',
        innerNos: this.data.innerNos,
        statusQueryFlag: this.data.orderFlag === '1'? 'entrust':'order'
      },
      success: res => {
        this.setData({
          statusList: res.result || []
        })
      }
    })
  },
   // 修改受托方
  editEntrustCompany(e) {
    let { dataset:{ index } } = e.currentTarget
    let temp = this.data.getEntrustDetail.beEntrustInfoVOs[index]
    wx.navigateTo({
      url: `../newOrderCorp?code=${this.data.code}&iEFlag=${this.data.IEflag}&entrustInfoVOs=${JSON.stringify(temp)}`
    })
  },
  // 点击下载随附单据
  downLoadLicense(e) {
    let {url,filetype} = e.currentTarget.dataset
    wx.showLoading()
    wx.downloadFile({
      url: url, 
      success (res) {
        if (res.statusCode === 200) {
          // 获取临时路径
          let filePath = res.tempFilePath
          if(filetype === 'png' || filetype === 'jpg' || filetype === 'jpeg' || filetype === 'bmp' || filetype === 'gif') {
            // 图片预览
            wx.previewImage({
              urls: [url],
              success() { wx.hideLoading() },
              fail() { wx.hideLoading() }
            })
          }else {
            // 预览其他类型的文件
            wx.openDocument({
              filePath: filePath,
              success (){ wx.hideLoading() },
              fail () {
                wx.hideLoading()
                wx.showToast({
                  title:'暂不支持该格式,请在web中预览',
                  icon:'none',
                  duration: 2000
                })
              }
            })
          }
        }
      },
      fail () {
        wx.hideLoading()
        wx.showToast({
          title: '预览文件失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})