var app = getApp()
Page({
  data: {
    titles: ["账册编号", "企业内部编号", "经营单位代码", "经营单位名称", "收发货单位代码", "文档上传标识", "收发货单位名称"],
    titless: {},
    src: "",
    obj: {},
    getCusHead: {
      ems_no: "",
    },
    getCusImg: {
      ems_no: "",
      g_no: ""
    },
    getCusExg: {
      ems_no: "",
      g_no: ""
    },
    getCusConsume: {
      trade_code: "",
      cop_ems_no: "",
      exg_no: "",
      exg_version: "",
      img_no: ""
    },
    getOrgImg: {
      cop_ems_no: "",
      trade_code: "",
      cop_g_no: "",
      g_no: ""
    },
    getOrgExg: {
      trade_code: "",
      cop_ems_no: "",
      cop_g_no: "",
      g_no: ""
    },
    getOrgBom: {
      trade_code: "",
      cop_ems_no: "",
      cop_exg_no: "",
      cop_img_no: ""
    },
    getSysDoc: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      bill_no: "",
      bill_type: ""
    },
    files: []
  },
  onLoad: function (options) {
    this.data.src = options.src
    var tmp = {
    };
    this.data.titles.forEach(function (value) {
      console.log(value)
      tmp[value] = app.translater(value)
    })
    this.setData({
      src: options.src,
      titless: tmp
    })
    if (this.data.src == "CusHead") {
      wx.setNavigationBarTitle({
        title: app.translater("账册表头") + "(" + options.ems_no + ")",
      })
      this.data.getCusHead.ems_no = options.ems_no
    } else if (this.data.src == "SysDoc") {
      wx.setNavigationBarTitle({
        title: app.translater("文档资料") + "(" + options.bill_no + ")",
      })
      this.data.getSysDoc.bill_no = options.bill_no
      this.data.getSysDoc.bill_type = options.bill_type
    }
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    console.log(this.data.src)
  },
  onShow: function () {
    if (this.data.src == "CusHead") {
      this.initCusHeadData()
    } else if (this.data.src == "CusImg") {
      this.initCusImgData()
    } else if (this.data.src == "CusExg") {
      this.initCusExgData()
    } else if (this.data.src == "CusConsume") {
      this.initCusConsumeData()
    } else if (this.data.src == "OrgImg") {
      this.initOrgImgData()
    } else if (this.data.src == "OrgExg") {
      this.initOrgExgData()
    } else if (this.data.src == "OrgBom") {
      this.initOrgBomData()
    } else if (this.data.src == "SysDoc") {
      this.initSysDocData()
    }
  },
  //获取账册表头实体
  initCusHeadData: function () {
    var that = this
    app.httpUtils.get('CusHead', that.data.getCusHead, function (data) {
      if (data.Success) {
        var obj = data.Data5
        that.setData({
          obj: obj
        })
      }
    })
  },
  //获取账册料件实体
  initCusImgData: function () {
    var that = this
    app.httpUtils.get("CusImg", that.data.getCusImg, function (data) {
      if (data.Success) {
        var obj = data.Data5
        that.setData({
          obj: obj
        })
      }
    })
  },
  //获取账册成品实体
  initCusExgData: function () {
    var that = this
    app.httpUtils.get("CusExg", that.data.getCusExg, function (data) {
      if (data.Success) {
        var obj = data.Data5
        that.setData({
          obj: obj
        })
      }
    })
  },
  //账册单损耗实体
  initCusConsumeData: function () {
    var that = this
    app.httpUtils.get("CusConsume", that.data.getCusConsume, function (data) {
      if (data.Success) {
        var obj = data.Data5
        that.setData({
          obj: obj
        })
      }
    })
  },
  //料件归并关系实体
  initOrgImgData: function () {
    var that = this
    app.httpUtils.get("OrgImg", that.data.getOrgImg, function (data) {
      if (data.Success) {
        var obj = data.Data5
        that.setData({
          obj: obj
        })
      }
    })
  },
  //获取成品归并关系实体
  initOrgExgData: function () {
    var that = this
    app.httpUtils.get("OrgExg", that.data.getOrgExg, function (data) {
      if (data.Success) {
        var obj = data.Data5
        that.setData({
          obj: obj
        })
      }
    })
  },
  //获取Bom表实体
  initOrgBomData: function () {
    var that = this
    app.httpUtils.get("OrgBom", that.data.getOrgBom, function (data) {
      if (data.Success) {
        var obj = data.Data5
        that.setData({
          obj: obj
        })
      }
    })
  },
  //获取文档资料实体
  initSysDocData: function () {
    var that = this
    app.httpUtils.get('SysDoc', that.data.getSysDoc, function (data) {
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
          files[index]["FULL_NAME"] = "https://51aeo.com/APi/File/" + files[index]["SEQ_NO"]
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
  show: function (e) {
    var tr = e.currentTarget.dataset.tr
    var td = e.currentTarget.dataset.td
    console.log(this.data.files[tr][td]["SEQ_NO"])
    console.log(this.data.files[tr][td]["FILE_TYPE"])
    app.httpUtils.preview("https://51aeo.com/APi/File/" + this.data.files[tr][td]["SEQ_NO"], this.data.files[tr][td]["FILE_TYPE"])
  },
  hide: function () {
    this.setData(
      {
        showModalStatus: false
      }
    )
  }
})