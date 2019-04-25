var app = getApp()
Page({
  data: {
    array: ['已接单，待提交', '接单提交，待录入', '已录入，待提交', '录入提交，待审核', '已审核，待修改', '已审核，待申报', '已修改，待申报', '单一窗口申报中', '已过机', '结案'],
    animationMenu: {},
    animationData: {},
    // tab切换  
    currentTab: 0,
    searchModel: {
      enable: true,
      PageIndex: 1,
      pageSize: 10,
      seq_no: "",
      site: "",
      accessName: '报关单详情查询'
    },
    datas: [],
    obj: {},
    obj2: {},
    seq_no: "",
    showModalStatus: false,
    files: []
  },
  onLoad: function (e) {
    app.authorize()
    var that = this
    app.utils.getSystemInfo(that)
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme
      })
    })
    if (typeof (e.inner_no) != "undefined") {
      this.data.inner_no = e.inner_no
    }
    var obj = JSON.parse(e.obj);
    obj.RCV_DATE = app.utils.dateFormatter(obj.RCV_DATE)
    obj.DEMAND_DATE = app.utils.dateFormatter(obj.DEMAND_DATE)
    obj.I_E_DATE = app.utils.dateFormatter(obj.I_E_DATE)
    obj.D_DATE = app.utils.dateFormatter(obj.D_DATE)

    that.setData({
      i_e_flag: wx.getStorageSync('i_e_flag'),
      obj: obj,
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo
      })
    })
    that.data.searchModel.site = this.data.currentUser.site
    that.data.searchModel.seq_no = obj.SEQ_NO
    that.data.searchModel["i_e_flag"] = wx.getStorageSync('i_e_flag')
    that.initData()
  },
  onShow: function () {
    wx.setStorageSync('fromDetailsToList', 'false')
  },
  searchFiles: function () {
    var that = this
    app.httpUtils.get('SysDoc', { "PageIndex": 1, "PageSize": 50, "site": this.data.searchModel.site, "bill_no": this.data.obj.BOSS_ID, "bill_type": "DEC" }, function (data) {
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
  initData: function () {
    var that = this
    app.httpUtils.get('EntryList', this.data.searchModel, function (data) {
      if (data.Success) {
        var datas = that.data.datas
        data.Data5.rows.forEach(function (val, index) {
          datas.push(val)
        })
        that.data.searchModel.PageIndex += 1
        if (data.Data5.total <= datas.length) {
          that.data.searchModel.enable = false
        } else {
          that.data.searchModel.enable = true
        }
        setTimeout(function () {
          that.setData({
            datas: datas
          })
          wx.hideLoading()
        }, 1000)
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
    app.httpUtils.preview("https://51baoguan.cn/APi/File/" + this.data.files[tr][td]["SEQ_NO"], this.data.files[tr][td]["FILE_TYPE"])
  },
  hide: function () {
    this.setData(
      {
        showModalStatus: false
      }
    )
  },
  upload: function () {
    var that = this
    this.initAnimation(180)
    wx.showActionSheet({
      itemList: ['上传图片'],
      success: function (res) {
        that.initAnimation(0)
        app.httpUtils.upload("https://51baoguan.cn/APi/File", { "bill_no": that.data.obj.BOSS_ID, "bill_type": "DEC", "site": that.data.searchModel.site }, function () {
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
  },
  formattertime: app.utils.dateFormatter,
  show_details: function (e) {
    var model = this.data.datas[e.currentTarget.dataset.index]
    wx.removeStorageSync('detailsList')
    wx.setStorageSync('detailsList', model)
    wx.navigateTo({
      url: 'detailsList'
    })
  },
  util: function () {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    })
    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation
    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step()

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    this.setData(
      {
        showModalStatus: true
      }
    )
  }
})  