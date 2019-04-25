var app = getApp()
Page({
  data: {
    address: "",
    addressTel: "",
    disabled: ''
  },
  onLoad: function(options) {
    this.data.pid = options.pid
    this.data.corpId = options.corpid
    if (options.op == "0") {
      wx.setNavigationBarTitle({
        title: "新增收发货地址"
      })
    }
    this.setData({
      op: options.op
    })
    this.initData()
  },
  bindData: function(e) {
    var key = e.currentTarget.id
    this.data[key] = e.detail.value
  },
  initData: function() {

    var address_key = this.data.corpId + "" + this.data.pid + "address"
    var addressTel_key = this.data.corpId + "" + this.data.pid + "addressTel"

    var address = wx.getStorageSync(address_key)
    var addressTel = wx.getStorageSync(addressTel_key)
    this.setData({
      address: address,
      addressTel: addressTel
    })
  },
  deleteAddress: function() {
    var that = this
    that.myDialog = that.selectComponent("#myDialog")
    that.myDialog.showDialog()
  },
  editAddress: function() {
    var that = this
    wx.showLoading({
      title: '保存中...',
    })
    if (this.data.address.trim().length == 0) {
      wx.showToast({
        icon: "none",
        title: "地址不能为空",
        duration: 2000
      })
    } else if (this.data.addressTel.trim().length == 0) {
      wx.showToast({
        icon: "none",
        title: "电话不能为空",
        duration: 2000
      })
    } else {
      that.setData({
        disabled: 'disabled'
      })
      app.platformApi.commonApi("/user/saveCorpContactWay", {
        "address": this.data.address,
        "addressTel": this.data.addressTel,
        "corpId": this.data.corpId,
        "pid": this.data.pid
      }, function(data) {
        wx.hideLoading()
        if (data.code == "0000") {
          wx.showToast({
            icon: "none",
            title: "操作成功",
            duration: 2000
          })
          setTimeout(function() {
            wx.navigateBack()
          }, 1000)
        } else {
          that.setData({
            disabled: ''
          })
          wx.showToast({
            icon: "none",
            title: data.message,
            duration: 2000
          })
        }
        console.log(data)
      })
    }
  },
  confirmEvent: function () {
    var that = this
    this.myDialog.hideDialog();
    app.platformApi.commonApi("/user/deleteCorpContactWay", {
      "address": "",
      "addressTel": "",
      "corpId": "",
      "pid": this.data.pid
    }, function (data) {
      if (data.code == "0000") {
        wx.showToast({
          icon: "none",
          title: "删除成功",
          duration: 2000
        })
        wx.navigateBack()
      } else {
        wx.showToast({
          icon: "none",
          title: data.message,
          duration: 2000
        })
      }
      console.log(data)
    })
  },
  cancelEvent: function () {
    var that = this
    this.myDialog.hideDialog();
  },
  choseAddress:function(){
    wx.navigateTo({
      url: 'address-chose',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})