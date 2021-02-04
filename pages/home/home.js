var app = getApp()
Page({
  data: {
    isShow4inform: false,
    tables: [{
        title: "通关信息查询",
        rows: [
          [{
              name: app.translater("通关状态查询"),
              normal: "home/ccba_handBook_normal.png",
              pressed: "home/ccba_handBook_pressed.png",
              state: true,
              url: "../customsState/search?from=home"
            },
            {
              name: app.translater("海运舱单状态查询"),
              normal: "home/ccba_eronaval_normal.png",
              pressed: "home/ccba_eronaval_pressed.png",
              state: true,
              url: "../aeronaval/search?from=home&trafMode=海运"
            },
            {
              name: app.translater("空运舱单状态查询"),
              normal: "home/ccba_eronaval1_normal.png",
              pressed: "home/ccba_eronaval1_pressed.png",
              state: true,
              url: "../aeronaval/search?from=home&trafMode=空运"
            },
            {
              name: app.translater("公路舱单状态查询"),
              normal: "home/ccba_manifestInfo_normal.png",
              pressed: "home/ccba_manifestInfo_pressed.png",
              state: true,
              url: "../manifestInfo/search?from=home"
            },
            {
              name: app.translater("公路舱单确报"),
              normal: "home/ccba_manifestInfoSure_normal.png",
              pressed: "home/ccba_manifestInfoSure_pressed.png",
              state: true,
              url: "../manifestInfoSure/search?from=home"
            }
          ], [{
            name: app.translater("通关联网状态查询"),
            normal: "home/contentStatus_normal.png",
            pressed: "home/contentStatus_pressed",
            state: true,
            url: "../connectState/connectState"
          },
          {
            id: "",
            name: "",
            normal: "",
            pressed: "",
            state: false,
            url: ""
          },
          {
            id: "",
            name: "",
            normal: "",
            pressed: "",
            state: false,
            url: ""
          },
          {
            id: "",
            name: "",
            normal: "",
            pressed: "",
            state: false,
            url: ""
          },
          {
            id: "",
            name: "",
            normal: "",
            pressed: "",
            state: false,
            url: ""
          }
          ]
        ]
      },
      {
        title: "委托管理",
        rows: [
          [
            {
              name: app.translater("委托"),
              normal: "https://www.5itrade.cn/files/wechat/entrust.png",
              pressed: "https://www.5itrade.cn/files/wechat/entrust.png",
              state: true,
              url: "../order/allBill/allBillList?orderFlag=1",
              source:'wx'
            },
            {
              name: app.translater("接单"),
              normal: "https://www.5itrade.cn/files/wechat/receive.png",
              pressed: "https://www.5itrade.cn/files/wechat/receive.png",
              state: true,
              url: "../order/allBill/allBillList?orderFlag=2",
              source:'wx'
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            }
          ]
        ]
      },
      {
        title: "物流跟踪",
        rows: [
          [{
              id: "allEntrust",
              name: "我的物流",
              normal: "home/allEntrust-normal.png",
              pressed: "home/allEntrust-pressed.png",
              state: true,
              url: "../logisticsTracking/logisticsTracking"
            },
            {
              id: "releaseEntrust",
              name: "创建委托",
              normal: "home/releaseEntrust-normal.png",
              pressed: "home/releaseEntrust-pressed.png",
              state: true,
              url: "../logisticsTracking/add"
            },
            {
              id: "invitation",
              name: "接单邀请",
              normal: "home/invitation-normal.png",
              pressed: "home/invitation-pressed.png",
              state: true,
              url: "../logisticsTracking/newInvitation"
            },
            {
              id: "flight",
              name: "航班信息",
              normal: "home/flight-normal.png",
              pressed: "home/flight-pressed.png",
              state: true,
              url: "../airQuery/airQuery"
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
          ]
        ]
      },
      {
        title: "归类",
        rows: [
          [{
              id: "classify",
              name: "智能归类",
              normal: "index/ccba_classify-normal.png",
              pressed: "index/ccba_classify-pressed.png",
              state: true,
              url: "../classify/classify"
            },
            {
              id: "classifyDecision",
              name: "归类决定",
              normal: "home/ccba_classifydecision-normal.png",
              pressed: "home/ccba_classifydecision-pressed.png",
              state: true,
              url: "../classifyDecision/classifyDecision"
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
          ]
        ]
      },
      {
        title: "厂商管理",
        rows: [
          [{
              name: app.translater("客户"),
              normal: "home/ccba_customer_normal.png",
              pressed: "home/ccba_customer_pressed.png",
              state: true,
              url: "../customer/customer"
            },
            {
              name: app.translater("供应商"),
              normal: "home/ccba_supplier_normal.png",
              pressed: "home/ccba_supplier_pressed.png",
              state: true,
              url: "../supplier/supplier"
            },
            {
              name: app.translater("提送货"),
              normal: "home/ccba_agentDelivery_normal.png",
              pressed: "home/ccba_agentDelivery_pressed.png",
              state: true,
              url: "../agentDelivery/agentDelivery"
            },
            {
              name: "企业信用信息",
              normal: "home/ccba_credit_normal.png",
              pressed: "home/ccba_credit_pressed.png",
              state: true,
              url: "../credit/credit"
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
          ]
        ]
      },
      {
        title: "进口管理",
        rows: [
          [{
              name: app.translater("进口接单"),
              normal: "home/ccba_i_act_normal.png",
              pressed: "home/ccba_i_act_pressed.png",
              state: true,
              url: "../act/search?from=home&i_e_flag=I"
            },
            {
              name: app.translater("进口报关单"),
              normal: "home/ccba_i_entry_normal.png",
              pressed: "home/ccba_i_entry_pressed.png",
              state: true,
              url: "../entry/search?from=home&i_e_flag=I"
            },
            {
              name: app.translater("进口物流跟踪"),
              normal: "home/ccba_logistics_i_normal.png",
              pressed: "home/ccba_logistics_i_pressed.png",
              state: true,
              url: "../logistics/search?from=home&i_e_flag=I"
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
          ]
        ]
      }, {
        title: "出口管理",
        rows: [
          [{
              name: app.translater("出口接单"),
              normal: "home/ccba_e_act_normal.png",
              pressed: "home/ccba_e_act_pressed.png",
              state: true,
              url: "../act/search?from=home&i_e_flag=E"
            },
            {
              name: app.translater("出口报关单"),
              normal: "home/ccba_e_entry_normal.png",
              pressed: "home/ccba_e_entry_pressed.png",
              state: true,
              url: "../entry/search?from=home&i_e_flag=E"
            },
            {
              name: app.translater("出口物流跟踪"),
              normal: "home/ccba_logistics_e_normal.png",
              pressed: "home/ccba_logistics_e_pressed.png",
              state: true,
              url: "../logistics/search?from=home&i_e_flag=E"
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
          ]
        ]
      },
      {
        title: "报表中心",
        rows: [
          [{
              name: app.translater("删改单报表"),
              normal: "home/ccba_decchange_normal.png",
              pressed: "home/ccba_decchange_pressed.png",
              state: true,
              url: "../decChange/search?from=home"
            },
            {
              name: app.translater("工作量统计"),
              normal: "home/ccba_workload_normal.png",
              pressed: "home/ccba_workload_pressed.png",
              state: true,
              url: "../workload/search?from=home"
            },
            {
              name: app.translater("报关单操作时效"),
              normal: "home/ccba_dectimeLine_normal.png",
              pressed: "home/ccba_dectimeLine_pressed.png",
              state: true,
              url: "../decTimeLine/search?from=home"
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
          ]
        ]
      },
      {
        title: "商品资料库",
        rows: [
          [{
              name: app.translater("GTIN查询"),
              normal: "/content/images/themes/A/GTIN.png",
              pressed: "/content/images/themes/A/GTIN.png",
              state: true,
              url: "../productData/GTIN/gtinSearch",
              source:'wx'
            },
            {
              name: app.translater("商品数据库"),
              normal: "https://www.5itrade.cn/files/wechat/GTINDB_search.png",
              pressed: "https://www.5itrade.cn/files/wechat/GTINDB_search.png",
              state: true,
              url: "../productData/proDataBase/DBSearch",
              source:'wx'
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            }
          ]
        ]
      },
      {
        title: "AI实验室",
        rows: [
          [{
            name: app.translater("身份证识别"),
            normal: "https://www.5itrade.cn/files/wechat/aiLab/idCard-s.png",
            pressed: "https://www.5itrade.cn/files/wechat/aiLab/idCard-s.png",
            state: true,
            url: "../aiLab/ocr/idCard/index",
            source:'wx'
          },
            {
              name: app.translater("营业执照识别"),
              normal: "https://www.5itrade.cn/files/wechat/aiLab/bizLicense-s.png",
              pressed: "https://www.5itrade.cn/files/wechat/aiLab/bizLicense-s.png",
              state: true,
              url: "../aiLab/ocr/bizLicense/index",
              source:'wx'
            },
            {
              name: app.translater("报关单识别"),
              normal: "https://www.5itrade.cn/files/wechat/aiLab/customs-s.png",
              pressed: "https://www.5itrade.cn/files/wechat/aiLab/customs-s.png",
              state: true,
              url: "../aiLab/ocr/customs/index",
              source:'wx'
            },
            {
              name: app.translater("图片倾斜矫正"),
              normal: "https://www.5itrade.cn/files/wechat/aiLab/correction-s.png",
              pressed: "https://www.5itrade.cn/files/wechat/aiLab/correction-s.png",
              state: true,
              url: "../aiLab/cv/correction/index",
              source:'wx'
            },
            {
              id: "",
              name: "",
              normal: "",
              pressed: "",
              state: false,
              url: ""
            }
          ]
        ]
      }
    ]
  },
  enterItem: function(e) {
    var url = e.currentTarget.dataset.url
    if (url == '') {
      return
    }
    if (url == "customs") {
      this.swLogin()
    } else {
      wx.navigateTo({
        url: url
      })
    }
  },
  onLoad: function(options) {
    var that = this
    var rows = []
    that.data.tables.forEach(function(vals, index) {
      vals.rows.forEach(function (valss, index){
        valss.forEach(function (val, index) {
          val.name1 = val.name.substring(0, 4)
          val.name2 = val.name.substring(4)
        })
      })

    })
    that.setData({
      tables: that.data.tables
    })
    app.authorize()
    var that = this
    app.getUserInfo(function(userInfo) {
      that.setData({
        theme: userInfo.theme,
        currentUser: userInfo
      })
    })
  },
  onShow: function() {
    var that = this
    app.platformApi.logistics("/logistics/queryList", {
      inputString: '',
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: ''
      },
      tagIndex: 0
    }, function(data) {
      wx.hideLoading()
      if (data.code == '0000') {
        console.log('*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*')
        console.log(data.result.logisticsAdviceCount)
        console.log('*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*')
        that.setData({
          isShow4inform: true,
          logisticsAdviceCount: data.result.logisticsAdviceCount,
        })
      }
    })
  },
  touchBegin: function(e) {
    var tb = e.currentTarget.dataset.tb;
    var td = e.currentTarget.dataset.td;
    var tr = e.currentTarget.dataset.tr;
    this.data.tables[tb]["rows"][tr][td].state = !this.data.tables[tb]["rows"][tr][td].state;
    this.setData({
      tables: this.data.tables
    });
  },
  touchOver: function(e) {
    var tb = e.currentTarget.dataset.tb;
    var td = e.currentTarget.dataset.td;
    var tr = e.currentTarget.dataset.tr;
    this.data.tables[tb]["rows"][tr][td].state = !this.data.tables[tb]["rows"][tr][td].state;
    this.setData({
      tables: this.data.tables
    });
  },
  touchStart: function(e) {
    this.setData({
      touchStart: e.touches[0].clientY,
      touchX: e.touches[0].clientX
    })
  },
  touchMove: function(e) {
    var that = this
    app.utils.tarBarTouchMove(that, e)
  },
  touchEnd: function() {
    var that = this
    var url_left = '../account/account'
    var url_right = '../pubpara/pubpara'
    app.utils.tarBarTouchEnd(that, url_left, url_right)
  }
})