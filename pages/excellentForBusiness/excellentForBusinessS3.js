var app = getApp()
import WxValidate from '../../utils/WxValidate'
Page({
  data: {
    outStanding: '1',
    isShowContent: true,
    isShowImg: true,
    reqData: {},
    reqDatas: {},
  },
  onLoad: function(options) {
    var that = this
    var isGood = wx.getStorageSync("CorpIsGood", '1')
    that.setData({
      outStanding: isGood
    })
    this.initValidate()
    this.data.reqData = wx.getStorageSync('reqData')
    var reqData4Details = wx.getStorageSync('reqData4Details')
    if (reqData4Details != '' && reqData4Details != null) {
      that.setData({
        reqDatas: {
          contact: reqData4Details.contactName,
          mobile: reqData4Details.contactPhone,
          email: reqData4Details.email,
          address: reqData4Details.address,
        }
      })
    }
  },
  onReady: function() {

  },
  onShow: function() {
    var that = this
    that.setData({
      isShowImg: true,
    })
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.reqDatas[id] = e.detail.value
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      contact: {
        required: true,
      },
      mobile: {
        required: true,
        tel: true,
      },
      email: {
        required: true,
        email: true,
      },
      address: {
        required: true,
      },
    }
    const messages = {
      contact: {
        required: '联系人不能为空',
      },
      mobile: {
        required: '联系电话不能为空',
      },
      email: {
        required: '邮箱不能为空',
      },
      address: {
        required: '地址不能为空',
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none',
      duration: 1000
    })
  },
  confirm: function (e,callback) {
    var that = this
    e.detail['value'] = that.data.reqDatas
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      that.data.reqData.contactName = that.data.reqDatas.contact
      that.data.reqData.contactPhone = that.data.reqDatas.mobile
      that.data.reqData.email = that.data.reqDatas.email
      that.data.reqData.address = that.data.reqDatas.address
      if (callback){
        that.data.reqData.status = '0'
      }else{
        that.data.reqData.status = '1'
      }
    }

    app.platformApi.commonApi("/declarantCorp/saveCorpInfo", that.data.reqData, function(data) {
      if (data.code == '0000') {
        if (that.data.isShowImg) {
          that.setData({
            url: data.result,
            isShowContent: false,
            isShow: true
          })
        }
        if (callback) {
          callback()
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '保存失败，无法预览',
        })
      }
    })
  },
  preview: function(e) {
    var that = this
    that.setData({
      isShowImg: false
    })
    that.confirm(e,function () {
      wx.navigateTo({
        url: 'preview',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    })
    // if (that.confirm(e)) {
    //   console.log('*******************')
    //   wx.navigateTo({
    //     url: 'preview',
    //     success: function(res) {},
    //     fail: function(res) {},
    //     complete: function(res) {},
    //   })
    // }
  },
  download: function() {
    var img_url = this.data.url
    wx.downloadFile({
      url: img_url,
      success: function(res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                icon: 'none',
                title: "保存成功"
              })
            }
          })
        }
      }
    })
  },
})