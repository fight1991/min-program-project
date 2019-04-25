
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {   
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 100, 
      condition: "",
      accessName: "CIQ详情查询"
    },
    hiddenModal: true,
    obj: {},
    listData: [
      {"CIQ_CO": "01", "G_NAME_NOTE": "text1"}
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.searchModel.condition = options.CODE_TS
    var tmp = this.data.searchModel
    this.setData({
      searchModel: tmp
    })
    wx.setNavigationBarTitle({
      title: options.CODE_TS
    }) 
    var that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    console.log(that.data.searchModel)
    app.httpUtils.get('CiqCode', that.data.searchModel, function (data) {
      if (data.Success) {
        that.setData({
          datas: data.Data5.rows,
        })
        console.log(that.data.datas)
      }
    })
  }
})