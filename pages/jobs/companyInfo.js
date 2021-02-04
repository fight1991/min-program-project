// pages/jobs/companyInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    corpName:'',
    englishName:'',
    introduce:[],
    imgUrl:[],
    logoUrl:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type
    console.log(type)
    this.getCorpType(type)
    wx.setNavigationBarTitle({
      title: this.data.corpName
    })
  },
  getCorpType(type) {
    switch(type) {
      case 'lx':
      this.setData({
        logoUrl:['https://www.5itrade.cn/files/wechat/longshine-logo.png'],
        type: 'lx',
        corpName: '朗新科技股份有限公司',
        englishName: 'LongShine Technology Co.,Ltd',
        introduce:[
          {
            id:'1',
            text:'朗新科技股份有限公司成立于2003年,2017年8月1日在深交所创业板挂牌上市，股票代码：300682。公司专注于产业互联网业务，是蚂蚁金服投资的阿里生态伙伴公司。公司是国家规划布局内重点软件企业，拥有信息系统集成及服务一级资质，通过了CMMI5级认证。公司在北京、杭州、苏州、无锡、武汉、厦门、广州、重庆和南宁设有研发中心。公司拥有2000多名员工。'
          },
          {
            id:'2',
            text:'朗新科技作为中国企业家海关事务行业领导者，是“中国国际单一窗口”主要建设力量，“金关二期”参建方。在国际贸易单一窗口标准版建设中，工程组获得了海关总署2018年专项奖励集体一等功。在大外贸服务行业专注为“智慧海关+智慧口岸+智慧生态链+智慧货主单位”提供一站式全流程方案的优秀国际贸易服务商。'
          }
        ],
        imgUrl:[
          'https://www.5itrade.cn/files/wechat/longshine2.png',
          'https://www.5itrade.cn/files/wechat/yidaiyilu.jpg'
        ]
      })
      break
      case 'lxyn':
      this.setData({
        logoUrl: ['https://www.5itrade.cn/files/wechat/yinuo-logo.png'],
        type: 'lxyn',
        corpName: '朗新一诺(苏州)信息科技有限公司',
        englishName: 'LongShine Yinuo(Suzhou) Information Technology Co.,Ltd',
        introduce:[
          {
            id: '1',
            text: '朗新一诺（苏州）信息科技有限公司【LONGNOWS】是朗新科技专注货主单位海关事务信息化行业的公司。公司深耕行业超过16年,成为中国企业级海关事务信息化行业的领导者,"金关之星®海关事务及贸易管理系统"是行业最具影响力的关务管理软件品牌。公司客户分布在全国25个省份、直辖市、自治区及东南亚、美国、加拿大等地，其中跨国集团和大型企业客户超过500家，世界500强企业占有率第一，汽车行业市场占有率第一，中国企业级关务信息化行业市场占有率第一',
          }
        ],
        imgUrl:[
          { 
            id:'1',
            title:'汽车行业',
            url:'https://www.5itrade.cn/files/wechat/automobile.jpg',
            width:750,
            height:298
          },
          {
            id:'2',
            title:'科技行业',
            url:'https://www.5itrade.cn/files/wechat/chemical industry.jpg',
            width:750,
            height:296
          },
          {
            id:'3',
            title:'能源行业',
            url:'https://www.5itrade.cn/files/wechat/energy.jpg',
            width:750,
            height:122
          },
          {
            id:'4',
            title:'化工纺织行业',
            url:'https://www.5itrade.cn/files/wechat/medicine.jpg',
            width:750,
            height:267
          },
          {
            id:'5',
            title:'医药食品行业',
            url:'https://www.5itrade.cn/files/wechat/science and technology.jpg',
            width:750,
            height:388
          },
          {
            id:'6',
            title:'半导体行业',
            url:'https://www.5itrade.cn/files/wechat/Semiconductor.jpg',
            width:750,
            height:193
          }  
        ]
      })
      break 
      case 'jg':
      this.setData({
        logoUrl:['https://www.5itrade.cn/files/wechat/jinguan-logo.png'],
        type: 'jg',
        corpName: '朗新金关信息科技有限公司',
        englishName: 'LongShine Jinguan Information Technology Co.,Ltd',
        introduce:[
          {
            id: '1',
            text:'朗新金关信息科技有限公司是朗新科技专注通关行业产业互联网业务的公司。公司秉承“科技让通关更便利”的使命，业务领域涵盖智慧海关、智慧口岸及智慧通关链路服务等板块。公司参与中国海关核心系统建设，是中国国际贸易“单一窗口”系统的主要承建方，是海关总署重要的科技合作伙伴。公司与中国报关协会共同打造行业最具广度和最具深度的线上关务服务的生态平台——“中国报关协会智慧通关平台”。'
          },
          {
            id: '2',
            text: '朗新金关专注通关服务科技赋能，贯通围绕进出口链路服务环节中的货主、货代、报关行、仓储、运输等角色，运用人工智能、大数据、区块链、移动端等先进技术和手段，使新一代通关流程合规便利。'
          }
        ],
        imgUrl: [
          'https://www.5itrade.cn/files/wechat/jinguan.png'
        ]
      })
    }
    console.log(this.data)
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