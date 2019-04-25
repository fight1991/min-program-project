var app = getApp()
Page({
  data: {
    titles: ["查询", "物料详情", "附件", "货号", "货品类型", "品名", "商品编码", "锁定标识", "HS检测", "申报要素", "英文品名", "企业单位", "申报单位", "法定单位", "第二单位", "申报比例", "法定比例", "第二比例", "保税标识", "监管条件", "3C标识", "商检标识", "归并标识", "币制", "原产国", "净重", "单价", "关税税率", "最惠国税率", "暂定税率", "业务单元", "项目名称", "CCC证书号", "CCC界定", "品牌", "备注", "申请人", "申请时间"],
    titless: {},
    animationMenu: {},
    currentTab: 0,
    obj: {},
    files: [],
    searchModel: {
      site: ""
    }
  },
  onLoad: function (option) {
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      tmp[value] = app.translater(value)
    })
    this.setData({
      titless: tmp
    })
    wx.setNavigationBarTitle({
      title: option.cop_g_no,
    })
    app.authorize()
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    app.httpUtils.get('CopMaterial', { seq_no: option.ID }, function (data) {
      if (data.Success) {
        var item = data.Data5
        item.UPDATE_TIME = app.utils.dateFormatter(item.UPDATE_TIME)
        that.setData({
          obj: item
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
      that.searchFiles()
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo
      })
    })
    that.data.searchModel.site = this.data.currentUser.site
  },
  onShow: function () {
    wx.setStorageSync('fromDetailsToList', 'false')
    this.setData({
      titles: [app.translater(this.data.titles[0]), app.translater(this.data.titles[1]), app.translater(this.data.titles[2]), app.translater(this.data.titles[3]), app.translater(this.data.titles[4]), app.translater(this.data.titles[5]), app.translater(this.data.titles[6]), app.translater(this.data.titles[7]), app.translater(this.data.titles[8]), app.translater(this.data.titles[9]), app.translater(this.data.titles[10]), app.translater(this.data.titles[11]), app.translater(this.data.titles[12]), app.translater(this.data.titles[13]), app.translater(this.data.titles[14]), app.translater(this.data.titles[15]), app.translater(this.data.titles[16]), app.translater(this.data.titles[17]), app.translater(this.data.titles[18]), app.translater(this.data.titles[19]), app.translater(this.data.titles[20]), app.translater(this.data.titles[21]), app.translater(this.data.titles[22]), app.translater(this.data.titles[23]), app.translater(this.data.titles[24]), app.translater(this.data.titles[25]), app.translater(this.data.titles[26]), app.translater(this.data.titles[27]), app.translater(this.data.titles[28]), app.translater(this.data.titles[29]), app.translater(this.data.titles[30]), app.translater(this.data.titles[31]), app.translater(this.data.titles[32]), app.translater(this.data.titles[33]), app.translater(this.data.titles[34]), app.translater(this.data.titles[35]), app.translater(this.data.titles[36]), app.translater(this.data.titles[37])]
    })
  },
  bindChange: function (e) {
    var that = this
    that.setData({ currentTab: e.detail.current })
  },
  swichNav: function (e) {
    var that = this
    if (this.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  show: function (e) {
    var tr = e.currentTarget.dataset.tr
    var td = e.currentTarget.dataset.td
    app.httpUtils.preview("https://51baoguan.cn/APi/File/" + this.data.files[tr][td]["SEQ_NO"], this.data.files[tr][td]["FILE_TYPE"])
  },
  searchFiles: function () {
    var that = this
    var cop_g_no = this.data.obj.COP_G_NO
    app.httpUtils.get('SysDoc', { "PageIndex": 1, "PageSize": 50, "site": this.data.searchModel.site, "bill_no": cop_g_no, "bill_type": "MATERIAL" }, function (data) {
      if (data.Success) {
        var files = data.Data5.rows
        var s = Math.ceil(data.Data5.rows.length / 3)
        var table = []
        for (var i = 0; i < s; i++) {
          var length = (i + 1) * 3
          if (length > data.Data5.rows.length) {
            length = data.Data5.rows.length
          }
          table[i] = []
          for (var j = i * 3; j < length; j++) {
            table[i][j % 3] = files[j]
          }
        }
        files.forEach(function (val, index) {
          files[index]["FULL_NAME"] = "https://51baoguan.cn/APi/File/" + files[index]["SEQ_NO"]
        })
        that.setData({
          files: table
        })
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
    })
  },
  upload: function () {
    var that = this
    this.initAnimation(180)
    wx.showActionSheet({
      itemList: ['上传图片'],
      success: function (res) {
        that.initAnimation(0)
        app.httpUtils.upload("https://51baoguan.cn/APi/File", { "bill_no": that.data.obj.COP_G_NO, "bill_type": "MATERIAL", "site": that.data.searchModel.site }, function () {
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          })
          that.searchFiles()
        }, res.tapIndex)
      },
      fail: function (res) {
        that.initAnimation(0)
      }
    })
  },
  initAnimation: function (rotate) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animation.rotateZ(rotate).step()
    this.setData({
      animationMenu: animation
    })
  }
})  