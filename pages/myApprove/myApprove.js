var app = getApp()
Page({
  data: {
    types: [app.translater('进出口审批'), app.translater('账号审批'), ''],
    searchModel: {
      user_id: "",
      site: "",
    },
    datas: [],
    table: [
      [
        {
          name: app.translater("进口报关单审批"), normal: "entryApproveI.png", pressed: "entryApprove_pressed.png", state: true, url: "../entryApprove/entryApprove?i_e_flag=I", audit: ''
        },
        {
          name: app.translater("出口报关单审批"), normal: "entryApproveE.png", pressed: "entryApprove_pressed.png", state: true, url: "../entryApprove/entryApprove?i_e_flag=E", audit: ''
        },
      ],
    ]
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.translater('我的审批'),
    })
    app.authorize()
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        currentUser: userInfo,
        theme: userInfo.theme
      })
      that.data.searchModel.user_id = that.data.currentUser.userName
      that.data.searchModel.site = that.data.currentUser.site
    })
    app.httpUtils.get('SysRole', this.data.searchModel, function (data) {
      if (data.Success) {
        var datas = data.Data5
        that.setData({
          datas: datas
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: data.ErrorMessage + "",
        })
      }
    })
  },
  onShow: function () {

  },
  enterItem: function (e) {
    var url = e.currentTarget.dataset.url
    var title = e.currentTarget.dataset.title
    if (e.currentTarget.dataset.audit.length > 0) {
      var data = this.data.datas
      for (var i = 0; i < data.length; i++) {
        if (data[i] != e.currentTarget.dataset.audit) {
          continue
        } else {
          wx.navigateTo({
            url: url
          })
          return
        }
      }
      wx.showModal({
        title: title,
        showCancel: false,
        content: app.translater('您暂无权限查看此项'),
      })
    } else {
      wx.navigateTo({
        url: url
      })
    }
  },
  touchBegin: function (e) {
    var that = this
    app.utils.touchBegin(that, e)
  },
  touchOver: function (e) {
    var that = this
    app.utils.touchOver(that, e)
  }
})
