var app = getApp()
import WxValidate from '../../utils/WxValidate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evalList: [{
      tempFilePaths: [],
    }],
    imgList: [],
    index: 0,
    iEFlag: 'I',
    userId: '',
    reqData: {
      notes: '',
      overseasContact: '',
      overseasMobile: '',
      overseasAddr: '',
      domesticContact: '',
      domesticMobile: '',
      domesticAddr: '',
      forwarderContact: '',
      forwarderMobile: '',
      agentContact: '',
      agentMobile: '',
      logisticsOtherVO: [],
      logisticsDocVO: [],
      overseasCountry:'',
      overseasProvince:'',
      overseasCity:'',
      overseasRegion:'',
      domesticCountry:'',
      domesticProvince:'',
      domesticCity:'',
      domesticRegion:''
    },
    rules: {},
    parameter_business: [{
      id: 1,
      name: '进口',
      code: 'I'
    }, {
      id: 2,
      name: '出口',
      code: 'E'
    }],
    parameter_transport: [{
      id: 1,
      name: '空运',
      code: '5'
    }, {
      id: 2,
      name: '海运',
      code: '2'
    }, {
      id: 3,
      name: '陆运',
      code: '4'
    }],
    parameter_goodstype: [{
      id: 1,
      name: '普货'
    }, {
      id: 2,
      name: '快件'
    }],
    urls: [],
    entrustModel: {
      churchyard: '',
      overseas: ''
    },
    transModes: [],
    city1: '',
    address1: '',
    city2: '',
    address2: '',
    overseasId: '',
    domesticId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.data.parameter_business[0].checked = true;
    this.data.parameter_transport[0].checked = true;
    this.data.parameter_goodstype[0].checked = true;
    this.setData({
      parameter_business: this.data.parameter_business,
      parameter_transport: this.data.parameter_transport,
      parameter_goodstype: this.data.parameter_goodstype,
    })
    this.data.reqData.iEFlag = this.data.parameter_business[0].code
    this.data.reqData.trafMode = this.data.parameter_transport[0].code
    this.data.reqData.goodsType = this.data.parameter_goodstype[0].name
    this.getTrade(this.data.reqData.iEFlag)
  },

  selectItems: function() {
    var that = this
    wx.showActionSheet({
      itemList: that.data.transModes,
      success: function(res) {
        var temp = that.data.reqData
        temp.transMode = that.data.transModes[res.tapIndex]
        that.setData({
          reqData: temp
        })
        console.log(temp)
      }
    })
  },
  //业务形式
  parameter_businessTap: function(e) {
    var that = this
    var this_checked = e.currentTarget.dataset.id
    var parameter_businessList = this.data.parameter_business
    for (var i = 0; i < parameter_businessList.length; i++) {
      if (parameter_businessList[i].id == this_checked) {
        parameter_businessList[i].checked = true;
        this.data.reqData.iEFlag = parameter_businessList[i].code
      } else {
        parameter_businessList[i].checked = false;
      }
    }
    that.setData({
      iEFlag: this.data.reqData.iEFlag,
      parameter_business: parameter_businessList
    })
    that.getTrade(this.data.reqData.iEFlag)
    that.changeTransport()
    that.onShow()
  },
  //物流方式
  parameter_transportTap: function(e) {
    var that = this
    var this_checked = e.currentTarget.dataset.id
    var parameter_transportList = this.data.parameter_transport
    for (var i = 0; i < parameter_transportList.length; i++) {
      if (parameter_transportList[i].id == this_checked) {
        parameter_transportList[i].checked = true;
        this.data.reqData.trafMode = parameter_transportList[i].code
      } else {
        parameter_transportList[i].checked = false;
      }
    }
    that.setData({
      parameter_transport: parameter_transportList
    })
  },
  //货物类型
  parameter_goodstypeTap: function(e) {
    var that = this
    var this_checked = e.currentTarget.dataset.id
    var parameter_goodstypeList = this.data.parameter_goodstype
    for (var i = 0; i < parameter_goodstypeList.length; i++) {
      if (parameter_goodstypeList[i].id == this_checked) {
        parameter_goodstypeList[i].checked = true;
        this.data.reqData.goodsType = parameter_goodstypeList[i].name
      } else {
        parameter_goodstypeList[i].checked = false;
      }
    }
    that.setData({
      parameter_goodstype: parameter_goodstypeList
    })
  },
  uploadImg: function(e) {
    var that = this
    if (that.data.urls.length >= 15) {
      wx.showModal({
        title: '',
        content: '最多上传十五张图片',
        showCancel: false,
      })
      return;
    }
    app.platformApi.uploadApi(function(data) {
      var data = JSON.parse(data)
      if (data.code == '0000') {
        wx.showToast({
          title: '上传成功！',
        })
        that.data.urls.push(data.result.url)
        var tmp = that.data.urls
        that.setData({
          urls: tmp
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '上传失败！',
        })
      }
    })
  },
  colseImg: function(e) {
    var index = e.currentTarget.dataset.index
    this.data.urls.splice(index, 1)
    var tmp = this.data.urls
    this.setData({
      urls: tmp
    })
  },
  chooseContact: function(e) {
    var value = e.currentTarget.dataset.value
    var name = ''
    var mobile = ''
    if (value != '') {
      name = value.substring(0, value.indexOf('/'))
      mobile = value.substring(value.indexOf('/') + 1)
    }
    wx.navigateTo({
      url: 'chooseContact?type=' + e.target.dataset.type + '&name=' + name + '&mobile=' + mobile,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  chooseAddress: function(e) {
    var that = this
    if (e.target.dataset.type == '1') {
      if (that.data.reqData.overseasMobile == '') {
        wx.showToast({
          icon: 'none',
          title: '请选择境外联系人',
        })
        return
      } else {
        that.data.userId = that.data.overseasId
      }
    }
    if (e.target.dataset.type == '2') {
      if (that.data.reqData.domesticMobile == '') {
        wx.showToast({
          icon: 'none',
          title: '请选择境内联系人',
        })
        return
      } else {
        that.data.userId = that.data.domesticId
      }
    }
    wx.navigateTo({
      url: 'chooseAddress?type=' + e.target.dataset.type + '&city1=' + this.data.city1 + '&city2=' + this.data.city2 + '&address1=' + this.data.address1 + '&address2=' + this.data.address2 + '&userId=' + this.data.userId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  nextstep: function(e) {
    var that = this
    var transMode = that.data.reqData.transMode
    if (transMode == 'FCA' || transMode == 'FAS' || transMode == 'FOB' || transMode == 'DAT' || transMode == 'CIF' || transMode == 'C&F' || transMode == 'CPT' || transMode == 'CIP') {
      that.setData({
        rules: {
          churchyard: {
            required: true,
          },
          goodsInfo: {
            required: true,
          },
        }
      })
      this.initValidate()
    } else {
      that.setData({
        rules: {
          overseas: {
            required: true,
          },
          churchyard: {
            required: true,
          },
          goodsInfo: {
            required: true,
          },
        }
      })
      this.initValidate()
    }
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else if (that.data.city1 == '' && that.data.address1 == '' && transMode != 'CIF' && transMode != 'FCA' && transMode != 'FAS' && transMode != 'FOB' && transMode != 'DAT' && transMode != 'C&F' && transMode != 'CPT' && transMode != 'CIP') {
      wx.showToast({
        icon: 'none',
        title: '境外收发货地址不为空',

      })
      return false
    } else if (that.data.city2 == '' && that.data.address2 == '') {
      wx.showToast({
        icon: 'none',
        title: '境内收发货地址不为空',
      })
      return false
    } else {
      if (that.data.reqData.customMaster && that.data.reqData.customMaster.trim() != '') {
        if (that.data.reqData.customMaster.trim().length != 4) {
          wx.showToast({
            icon: 'none',
            title: '请输入4位关区代码',
          })
          return false
        }
      }
      var docUrls = []
      var oldUrls = []
      var newUrls = []
      that.data.imgList.forEach(function(value) {
        if (value.indexOf('test.5itrade.cn') >= 0 || value.indexOf('www.5itrade.cn') >= 0 || value.indexOf('http://116.62.67.13:8084') >= 0) {
          oldUrls.push(value)
        } else {
          newUrls.push(value)
        }
      })
      wx.showLoading({
        title: '数据提交中...',
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      if (newUrls.length > 0) {
        newUrls.forEach(function(value) {
          app.platformApi.uploadFile(value, function(data) {
            var data = JSON.parse(data)
            docUrls.push(data.result.url)
            if (docUrls.length == newUrls.length) {
              that.data.reqData.logisticsDocVO = {
                docUrls: oldUrls.concat(docUrls)
              }
              app.platformApi.logistics("/logistics/addLogistics", that.data.reqData, function(data) {
                wx.hideLoading()
                if (data.code == '0000') {
                  wx.hideLoading()
                  that.data.reqData = data.result
                  wx.redirectTo({
                    url: 'chooseParties?obj=' + JSON.stringify(that.data.reqData)
                  })
                } else {
                  wx.showToast({
                    icon: 'none',
                    title: '新增失败',
                    duration: 1000,
                    success: function() {
                      wx.reLaunch({
                        url: 'logisticsTracking',
                      })
                    }
                  })
                }
              })
            }
          })
        })
      } else {
        oldUrls = that.data.evalList[0].tempFilePaths
        that.data.reqData.logisticsDocVO = {
          docUrls: oldUrls
        }
        app.platformApi.logistics("/logistics/addLogistics", that.data.reqData, function(data) {
          wx.hideLoading()
          if (data.code == '0000') {
            wx.hideLoading()
            that.data.reqData = data.result
            wx.redirectTo({
              url: 'chooseParties?obj=' + JSON.stringify(that.data.reqData)
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '新增失败',
              duration: 1000,
              success: function() {
                wx.reLaunch({
                  url: 'logisticsTracking',
                })
              }
            })
          }
        })
      }
    }
  },
  bindData: function(e) {
    var id = e.currentTarget.id
    this.data.reqData[id] = e.detail.value
  },
  initValidate() {
    // 验证字段的规则
    const rules = this.data.rules
    const messages = {
      overseas: {
        required: "境外提货人/联系方式不为空",
      },
      overseasAddr: {
        required: "境外提货地址不为空",
      },
      churchyard: {
        required: "境内提货人/联系方式不为空",
      },
      domesticAddr: {
        required: "境内提货地址不为空",
      },
      goodsInfo: {
        required: "货物信息不为空",
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
  getTrade: function(ieflag) {
    var that = this
    app.platformApi.logistics("/logistics/getTradeModel", {
      "iEFlag": ieflag
    }, function(data) {
      that.setData({
        transModes: data.result
      })
      that.data.reqData.transMode = that.data.transModes[0]
    })
    that.changeTransport()
    that.onShow()
  },
  bindPickerChange: function(e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    that.data.reqData.transMode = that.data.transModes[that.data.index]
    that.changeTransport()
    that.onShow()
  },
  showImg: function(e) {
    var url = e.currentTarget.dataset.url
    app.httpUtils.preview(url, ".jpg")
  },
  changeTransport: function() {
    var that = this
    var parameter_transport = []
    if (that.data.reqData.iEFlag == 'I') {
      if ('EXW、FCA、CPT、CIP、CIP'.indexOf(that.data.reqData.transMode) >= 0) {
        parameter_transport = [{
          id: 1,
          name: '空运',
          code: '5'
        }, {
          id: 2,
          name: '海运',
          code: '2'
        }, {
          id: 3,
          name: '陆运',
          code: '4'
        }]
      } else {
        parameter_transport = [{
          id: 1,
          name: '空运',
          code: '5'
        }, {
          id: 2,
          name: '海运',
          code: '2'
        }]
      }
    } else {
      if ('DDP、DAP、CPT、CIP、DAT、FCA'.indexOf(that.data.reqData.transMode) >= 0) {
        parameter_transport = [{
          id: 1,
          name: '空运',
          code: '5'
        }, {
          id: 2,
          name: '海运',
          code: '2'
        }, {
          id: 3,
          name: '陆运',
          code: '4'
        }]
      } else {
        parameter_transport = [{
          id: 1,
          name: '空运',
          code: '5'
        }, {
          id: 2,
          name: '海运',
          code: '2'
        }]
      }
    }
    parameter_transport[0].checked = true;
    that.setData({
      parameter_transport: parameter_transport
    })
  },
  //添加图片
  joinPicture: function(e) {
    var index = e.currentTarget.dataset.index;
    var evalList = this.data.evalList;
    var that = this;
    var imgNumber = evalList[index].tempFilePaths;
    if (imgNumber.length >= 15) {
      wx.showModal({
        title: '',
        content: '最多上传十五张图片',
        showCancel: false,
      })
      return;
    }
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage("album", imgNumber);
          } else if (res.tapIndex == 1) {
            that.chooseWxImage("camera", imgNumber);
          }
        }
      }
    })
  },
  chooseWxImage: function(type, list) {
    var img = list;
    var len = img.length;
    var that = this;
    var evalList = this.data.evalList;
    wx.chooseImage({
      count: 15,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: function(res) {
        var addImg = res.tempFilePaths;
        var addLen = addImg.length;
        if ((len + addLen) > 15) {
          for (var i = 0; i < (addLen - len); i++) {
            img.push(addImg[i]);
          }
        } else {
          for (var j = 0; j < addLen; j++) {
            img.push(addImg[j]);
          }
        }
        that.setData({
          evalList: evalList,
          imgList: img
        })
      },
    })
  },

  //删除图片
  clearImg: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var evalList = this.data.evalList
    var img = evalList[0].tempFilePaths
    img.splice(index, 1)
    this.setData({
      evalList: evalList,
      imgList: img
    })
  },
})