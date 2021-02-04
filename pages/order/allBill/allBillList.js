// pages/order/allBill/allBillList.js
let app = getApp()
let orderFlag = ''
Page({
  data: {
    // 下拉参数
    boxHeight: 0,// 下拉时box的高度
    refresh: true,// 控制box的显示与隐藏
    title: '', // 下拉时的title
    loadingSuccess: false, // 控制图标的显示与隐藏
    startPos: 0,// 记录下拉起始位置
    imageAll: true,
    // 下拉参数结束
    btnIsShow: false,
    orderFlag: '',
    date1:'',
    date2:'',
    showModal: true,
    winHeight: app.globalData.winHeight,
    pageIndex: 0,
    hasMore: true,
    isLoading: true,
    acceptBill:'',// 记录接单状态
    entrustList:[],
    IEflag:{ // 进出口标志
      label: '进口',
      items: ['进口','出口'],
      code:['I','E'],
      index: 0 
    },
    customs:{ // 受托企业
      label: orderFlag === '1' ? '受托企业':'委托客户',
      items: ['全部','张三','李四'],
      code: ['','3','4'],
      index: 0
    }, 
    status:{
      label: '委托状态',
      items: ['全部','暂存','待接单','已接单'],
      items2: ['全部','接单生成','报关单预录入','待审核','审核驳回','审核通过','待复核','核注清单预录入','接单完成','已作废'],
      code: ['','1','2','3'],
      code2: ['','0','2','3','4','5','R','I','C','Z'],
      index: 0
    },
    date:{
      label: orderFlag === '1' ? '委托日期':'接单日期'
    },
    queryForm:{ // 委托
      iEFlag:'I', // 进出口标志I/E
      entrustStatus:'', //委托单状态 1：暂存 2：待接单 3：已接单 
      beEntrustCompanyName:'', //受托企业名称
      startDate:'',// 开始日期
      endDate:'' // 结束日期
    },
    queryForm2:{ // 接单
      iEFlag:'I', // 进出口标志I/E
      status:'', //接单状态  0:接单生成 2：报关单预录入 3：待审核 4:审核驳回 5:审核通过 R:待复核 I:核注清单预录入 C:接单完成
      company:'', // 委托客户
      rcvStartDate:'',// 开始日期
      rcvEndDate:'' // 结束日期
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化类型
    wx.setStorageSync('decFlag','dec')
    // 缓存标记
    if(options.orderFlag) {
      wx.setStorage({
        key: 'orderFlag',
        data: options.orderFlag
      })
    }
    this.setData({
      orderFlag:options.orderFlag || wx.getStorageSync('orderFlag')
    })
    orderFlag = this.data.orderFlag
    wx.setNavigationBarTitle({
      title: orderFlag === '1'?'委托列表':'接单列表'
    })
    if(options.iEFlag) {
      this.setData({
        'IEflag.label': options.iEFlag === 'I'? '进口' : '出口',
        'queryForm.iEFlag': options.iEFlag,
        'queryForm2.iEFlag': options.iEFlag
      })
    }
    if(orderFlag === '1') { //  委托
      this.setData({
        'customs.label':'受托企业',
        'date.label': '委托日期',
        'status.label':'委托状态'
      })
      // 提交按钮过来的页面
      if(options.entrustStatus) {
        // let index = options.entrustStatus
        // this.setData({
        //   'queryForm.entrustStatus': index,
        //   'status.label': this.data.status.items[index]
        // })
      }
      this.beEntrustListQuery()
      this.entrustListQuery()
    }else { // 接单
      this.setData({
        'customs.label':'委托客户',
        'date.label': '接单日期',
        'status.label':'接单状态'
      })
      this.getOrderTakenList()
      this.getOrderListQuery()
    }
  },
  // 委托单列表查询
  entrustListQuery(flag) {
    let { pageIndex } = this.data
    pageIndex++
    wx.ajax({
      url:'API@dec-common/ccba/entrust/entrustListQuery',
      data:{
        ...this.data.queryForm,
        page:{
          pageIndex:pageIndex,
          pageSize:10
        }
      },
      success: res => {
        res.result.forEach(v => {
          if(v.entrustBusiness.includes("log")) {
            v.logFlag = true
          }else {
            v.logFlag = false
          }
        })
        if(flag === 'pull') { // 如果是下拉发生的请求
          this.setData({
            pageIndex: 1,
            boxHeight:0,
            refresh:true,
            title:'加载成功',
            loadingSuccess:false,
            imageAll:false,
            entrustList: [...res.result],
            isLoading:false,
            hasMore: Math.ceil(res.page.total/10) > pageIndex ? true:false,
          })
        }else {
          this.setData({
            pageIndex,
            entrustList:[...this.data.entrustList,...res.result],
            hasMore: Math.ceil(res.page.total/10) > pageIndex ? true:false,
            isLoading:false
          }) 
        }
      }
    })
  },
  // 接单列表查询
  getOrderTakenList(flag) {
    let { pageIndex } = this.data
    pageIndex++
    wx.ajax({
      url:'API@dec-common/ccba/common/getOrderTakenList',
      data:{
        ...this.data.queryForm2,
        page:{
          pageIndex:pageIndex,
          pageSize:10
        }
      },
      success: res => {
        if(res.result && res.result.length > 0) {
          res.result.forEach(v => {
            if(v.type.includes("log")) {
              v.logFlag = true
            }else {
              v.logFlag = false
            }
          })
        }
        if(flag === 'pull') { // 如果是下拉发生的请求
          this.setData({
            pageIndex:1,
            boxHeight:0,
            refresh:true,
            title:'加载成功',
            loadingSuccess:false,
            imageAll:false,
            entrustList: [...res.result],
            isLoading:false,
            hasMore: Math.ceil(res.page.total/10) > pageIndex ? true:false,
          })
        } else {
          this.setData({
            pageIndex,
            entrustList:[...this.data.entrustList,...res.result],
            hasMore: Math.ceil(res.page.total/10) > pageIndex ? true:false,
            isLoading:false
          })
        }
      }
    })
  },
  // 受托方下拉列表
  beEntrustListQuery() {
    wx.ajax({
      url:'API@dec-common/ccba/entrust/beEntrustListQuery',
      data:{},
      success: res=> {
        this.setData({
          'customs.items': ['全部',...res.result]
        })
      }
    })
  },
  // 委托企业下拉列表
  getOrderListQuery() {
    wx.ajax({
      url:'API@dec-common/ccba/common/entrustListQuery',
      data:{},
      success: res=> {
        this.setData({
          'customs.items': ['全部',...res.result]
        })
      }
    })
  },
  bindIEflagChange(e) {
    // 获取数组下标
    let { value } = e.detail
    let { items, code } = this.data.IEflag
    this.setData({
      pageIndex: 0,
      hasMore: true,
      isLoading: true,
      entrustList:[],
      'IEflag.label': items[value],
      'IEflag.index': value,
    })
    if(orderFlag === '1') {
      this.setData({
        'queryForm.iEFlag':code[value]
      })
      this.entrustListQuery()
    }else {
      this.setData({
        'queryForm2.iEFlag':code[value]
      })
      this.getOrderTakenList()
    }   
  },
  bindCustomsChange(e) {
    this.setData({
      pageIndex: 0,
      hasMore: true,
      isLoading: true,
      entrustList:[]
    })
    // 获取数组下标
    let { value } = e.detail
    let { items } = this.data.customs
    if(orderFlag === '1') {
      if(+value > 0) {
        this.setData({
          'customs.label':items[value],
          'customs.index':value,
          'queryForm.beEntrustCompanyName':items[value]
        })
      }else {
        this.setData({
          'customs.label': '受托企业',
          'customs.index': 0,
          'queryForm.beEntrustCompanyName': ''
        })
      }
      this.entrustListQuery()
    }else {
      if(+value > 0) {
        this.setData({
          'customs.label':items[value],
          'customs.index':value,
          'queryForm2.company':items[value]
        })
      }else {
        this.setData({
          'customs.label': '委托客户',
          'customs.index': 0,
          'queryForm2.company': ''
        })
      }
      this.getOrderTakenList()
    }
  },
  bindStatusChange(e) {
    this.setData({
      pageIndex: 0,
      hasMore: true,
      isLoading: true,
      entrustList:[]
    })
    // 获取数组下标
    let { value } = e.detail
    if(orderFlag === '1') {
      let { items, code } = this.data.status
      if(+value > 0) {
        this.setData({
          'status.label': items[value],
          'status.index': value,
          'queryForm.entrustStatus': code[value]
        })
      }else {
        this.setData({
          'status.label': '委托状态',
          'status.index': 0,
          'queryForm.entrustStatus': ''
        })
      }
      this.entrustListQuery()
    }else {
      let { items2, code2} = this.data.status
      if(+value > 0) {
        this.setData({
          'status.label': items2[value],
          'status.index': value,
          'queryForm2.status': code2[value]
        })
      }else {
        this.setData({
          'status.label': '接单状态',
          'status.index': 0,
          'queryForm2.status': ''
        })
      }
      this.getOrderTakenList()
    }
    
  },
  selectDate() {
    this.setData({
      showModal:false
    })
  },
  pullRefsh() {
    if(this.data.isLoading || !this.data.hasMore) {
      return
    }
    orderFlag === '1'?this.entrustListQuery():this.getOrderTakenList()
  },
  switchBtn() {
    this.setData({
      btnIsShow: !this.data.btnIsShow
    })
  },
  clearDate() {
    this.setData({
      date1:'',
      date2:'',
      'queryForm.startDate': '',
      'queryForm2.rcvStartDate': '',
      'queryForm.endDate': '',
      'queryForm2.rcvEndDate': ''
    })
  },
  confirmDate() {
    if(this.data.date2 && !this.data.date1) {
      wx.showToast({
        title: '请选择开始日期',
        icon: 'none'
      })
      return
    } 
    if(this.data.date1 && !this.data.date2) {
      wx.showToast({
        title: '请选择结束日期',
        icon: 'none'
      })
      return
    }
    if(!this.data.date1 && !this.data.date2) {
      this.setData({
        'date.label': orderFlag === '1' ? '委托日期':'接单日期'
      })
    }else {
      this.setData({
        'date.label': this.data.date1 + '~' + this.data.date2
      })
    }
    this.setData({
      showModal: true,
      pageIndex: 0,
      hasMore: true,
      isLoading: true,
      entrustList:[]
    })
    orderFlag === '1' ? this.entrustListQuery() : this.getOrderTakenList()
  },
  bindDateChange(e){
    let { value } = e.detail
    this.setData({
      date1:value,
      'queryForm.startDate': value,
      'queryForm2.rcvStartDate': value
    })
  },
  bindDateChange2(e) {
    let { value } = e.detail
    this.setData({
      date2: value,
      'queryForm.endDate': value,
      'queryForm2.rcvEndDate': value
    })
  },
  // 关闭日期模态框
  closeDateModal() {
    this.setData({
      showModal: true
    })
  },
  // 触摸穿透事件
  preventTouch() { return },

  touchStart(e) {
    // 记录开始坐标
    this.setData({
      startPos:e.touches[0].clientY,
      imageAll:true
    })
  },
  touchMove(e) {
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
    let that = this
    // 滑动结束 判断值是否 大于50 
    if(this.data.boxHeight > 50) {
      // 可以发送请求了,并把boxHeight高度降到50
      this.setData({
        boxHeight:50,
        refresh:false,
        title:'正在加载 ...',
        loadingSuccess:true,
        imageAll:false,
        pageIndex: 0,
        hasMore: true,
        isLoading: true,
      })
      // 发送请求
      orderFlag === '1' ? that.entrustListQuery('pull') : that.getOrderTakenList('pull')
    }else {
      this.setData({
        boxHeight: 0,
        refresh:true
      })
    }
  }
})