
// pages/jobs/jobDetails.js
let app = getApp()
import { api } from '../../utils/qrcode'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobId:'',
    winHeight:'',
    winWidth: '',
    // bgImage: 'https://www.5itrade.cn/files/wechat/share_top.png',
    bgImage: '',
    ewmPath: 'https://www.5itrade.cn/wx/talent/',
    ewmImg: '',
    portPath:'', // canvas生成海报地址
    jobDetail:{},
    canvasData:[],
    canvasSize:{
      height: '',
      width: ''
    },
    lineH: 22, // canvas文字行高
    isShowMask: true,
    ewmIsShow: true,
    portIsShow: false,
    userInfo:{},
    openId: '',
    sessionKey: '',
    isLogin: false, // 判断用户是否登录
    mobile: '',
    shareMobile: '' // 分享人带过来的手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let token = wx.getStorageSync('unionid')
    // let token = false
    if(token) {
      this.setData({
        isLogin: true,
        mobile: wx.getStorageSync('mobile')
      })
    }else {
      this.getSessionKey()
    }
    this.setData({
      winHeight: app.globalData.winHeight,
      winWidth: app.globalData.winWidth
    })
    
    if(options.jobId) {
      this.setData({
        jobId: options.jobId
      })
      wx.setStorageSync('jobId', options.jobId)
    }
    // 需要判断是否是直接扫码到详情页的 将jobId 保存到本地
    if(options.q) {
      let url = decodeURIComponent(options.q)
      let temp = url.split('/')
      this.setData({
        jobId: temp[temp.length-1]
      })
      wx.setStorageSync('jobId', temp[temp.length-1])
    }
    // 直接登录页跳转过来
    if(options.from === 'zp') {
      // 从本地取jobId
      this.setData({
        jobId: wx.getStorageSync('jobId')
      })
    }
    this.getJobsDetail(this.data.jobId, function(that) {
      if(options.shareMobile) { // 分享页带过来的手机号
        // 比对自己本地存储的手机号和带过来的手机号是否一样
        let temp = wx.getStorageSync('shareMobileSelf') || wx.getStorageSync('mobile')
        that.data.shareMobile = options.shareMobile
        if(temp !== options.shareMobile) {
          let {jobName} = that.data.jobDetail
          that.addLogRecord('2','职位详情-' + jobName,options.shareMobile)
        }
      }
    })
    this.createQrCode()
    this.getImageInfo()
  },
  // 获取简历详情
  getJobsDetail(id, fn) {
    let that = this
    wx.ajax({
      url:'API@plat-manager/jobManage/getJobDetail',
      data:{
        jobId:id
      },
      success: res => {
        let obj = that.translate(res.result)
        for( let key in obj ) {
          if(key === 'area') { 
            if(obj[key].length > 0) {
              obj[key] = obj[key].replace(/\+/g,'/')
            }else {
              obj[key] = ''
            }
          }
          if(key === 'duty' ||  key === 'requirement' || key === 'contact') {
            if(obj[key].length > 0) {
              obj[key] = obj[key].replace(/\n/g,'').split('$')
            }else {
              obj[key] = []
            }
          }
        }
        // 数据再处理,处理成canvas需要的数据
        let canvasData = [0,0,0,0]
        for(let k in obj) {
          if(k === 'jobName') {
            let salary = '', workYears= '', count = '', education = '', workNature = ''
            if(obj['salary']) {
              salary = obj['salary'] + ' · '
            }
            if(obj['workYears']) {
              workYears = obj['workYears'] + ' · '
            }
            if(obj['count']) {
              count = obj['count'] + '人' + ' · '
            }
            if(obj['education']) {
              education = obj['education'] + ' · '
            }
            if(obj['workNature']) {
              workNature = obj['workNature'] === 'full' ? '全职': '兼职'
            }
            let temp = {
              title:obj['jobName'],
              info: [obj['area'],salary + workYears + count + education + workNature],
              fize: 16
            }
            canvasData.splice(0,1,temp)
          }
          if(k === 'contact') {
            let temp = {
              title: '联系方式',
              info: [...obj['contact']],
              fize:14
            }
            canvasData.splice(1,1,temp)
          }
          if(k === 'duty') {
            let temp = {
              title: '岗位职责',
              info: [...obj['duty']],
              fize:14
            }
            canvasData.splice(2,1,temp)
          }
          if(k === 'requirement') {
            let temp = {
              title: '任职要求',
              info: [...obj['requirement']],
              fize:14
            }
            canvasData.splice(3,1,temp)
          }
        }
        that.setData({
          jobDetail: obj,
          canvasData: canvasData
        })
        fn && fn(that)
        // 获取节点宽高
        that.getRect(that)
      }
    })
  },
  // 拨打电话
  phoneCall() {
    let { dail } = this.data.jobDetail
    wx.makePhoneCall({
      phoneNumber: dail || '',
      fail:err => {
        if(err.errMsg == 'makePhoneCall:fail'){
          wx.showModal({
            title: '获取电话权限失败',
            content:contact || '',
            showCancel:false
          })
        }
      }
    })
  },
  // 选择文件,并发送简历
  chooseFileAndSend() {
    let that = this
    // 提示信息
    wx.showModal({
      title: '提示',
      content: '请选择微信联系人对话中已存在的文件上传',
      success(res) {
        if (res.confirm) {
          // 判断用户是否登录
          let isLogin = wx.getStorageSync('unionid')
          if(!isLogin) {
            wx.showModal({
              title: '提示',
              content: '选择登录',
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/accountBind/accountBind?flag=resume'
                  })
                } else if (res.cancel) {
                  
                }
              }
            })
            return
          }
          // 从会话端选择文件
          wx.chooseMessageFile({
            count: 1,
            type: 'file',
            extension:['docx','doc'],
            success( res ) {
              let tempFilePaths = res.tempFiles        
              that.uploadFile(tempFilePaths[0])
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  // 发送简历
  sendResume(url,that) {
    let { cms_user } = app.globalData
    let { jobName } =  that.data.jobDetail
    wx.ajax({
      url:'API@plat-manager/resumeManage/sendResume',
      data:{
        jobId: that.data.jobId,
        jobName: jobName,
        mobile: cms_user.mobile || wx.getStorageSync('mobile'),
        userName:cms_user.name || wx.getStorageSync('userName'),
        source: 'wechat',
        url: url
      },
      isLoading: false,
      success: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
        // 统计简历投递数,永远记在分享带过来的手机号
        if(that.data.shareMobile) {
          that.addLogRecord('3','职位详情-' + jobName ,that.data.shareMobile)
        }
      },
      other: res => {
        if(res.code === '0002') { // token失效
          wx.showToast({
            title: res.message,
            duration: 1500,
            icon:'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/accountBind/accountBind?flag=resume'
            })
          },1500)
        }
      },
      error:(e) => {
        console.log(e)
        wx.hideLoading()
        wx.showToast({
          title: '发送失败,请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 上传word
  uploadFile(file) {
    let that = this
    wx.showLoading({
      title: '发送中,请稍后',
      mask: true
    })
    wx.upload({
      url: 'FILE@saas-upload/upload/uploadFile',
      filePath:file.path,
      data: file,
      isLoading: false,
      success: res => {
        let { url } = res.result
        that.sendResume(url,that)
      },
      error: () => {
        wx.hideLoading()
        wx.showToast({
          title: '发送失败,请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
    // 监听上传进度
    // uploadTask.onProgressUpdate((res) => {
    //   console.log('上传进度', res.progress)
    //   console.log('已经上传的数据长度', res.totalBytesSent)
    //   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    // })
  },
  // 翻译
  translate(arr) {
    if(Array.isArray(arr)) {
      arr.forEach(v => {
        switch(v.jobType) {
          case '1':
            v.jobName = '销售经理'
            break;
          case '2':
          v.jobName = '咨询顾问'
          break;
          case '3':
          v.jobName = '需求分析师'
          break;
          default:
          v.jobName = '尚未维护'
        }
        switch(v.company) {
          case 'longnows':
          v.companyName = '朗新一诺(苏州)信息科技有限公司'
          break;
          case 'longshine':
          v.companyName = '朗新金关信息科技有限公司'
          break;
          default:
          v.companyName = '朗新一诺(苏州)信息科技有限公司/朗新金关信息科技有限公司'
          }
      })
    }else {
      switch(arr['company']) {
        case 'longnows':
          arr.companyName = '朗新一诺(苏州)信息科技有限公司'
          break;
        case 'longshine':
          arr.companyName = '朗新金关信息科技有限公司'
        break;
        default:
          arr.companyName = '朗新一诺(苏州)信息科技有限公司/朗新金关信息科技有限公司'
      }
    }
    return arr
  },
  // 获取节点高度
  getRect (that) {
      wx.createSelectorQuery().select('#pageScroll').boundingClientRect(function(rect){
        // 节点的宽度
        // 节点的高度
        that.setData({
          'canvasSize.height': rect.height,
          'canvasSize.width': rect.width
        })
    }).exec()
    
  },
  // 生成海报
  saveCanvas() {
    this.setData({
      isShowMask: true
    })
    // 统计分享次数
    let {jobName} = this.data.jobDetail
    if(this.data.isLogin) {
      let userId = wx.getStorageSync('userId')
      this.addSharePage('职位详情-' + jobName , userId, this.data.mobile)
      this.addLogRecord('1','职位详情-' + jobName, this.data.mobile)
    }
    // 未登录,且已经获取过手机号了
    if(!this.data.isLogin && this.data.mobile) {
      this.addSharePage('职位详情-' + jobName , '', this.data.mobile)
      this.addLogRecord('1','职位详情-' + jobName, this.data.mobile)
    }
    // 如果portPath有值 直接预览
    if(this.data.portPath) {
      wx.previewImage({
        current: this.data.portPath,
        urls: [this.data.portPath]
      })
      return
    }
    let that = this
    let {height,width} = that.data.canvasSize
    let {canvasData,lineH} = that.data
    let context = wx.createCanvasContext('shareImg')
    let bgImgHeight = 364*width/750
    context.setFillStyle('#fff');
    context.fillRect(0, 0, width, height+that.data.winWidth*364/750);
    // 1. 放置头部图片
    context.drawImage(that.data.bgImage,0,0,width,bgImgHeight)
    // 2. 放置职位信息文字
    that.setTextOnCanvas(context,canvasData,bgImgHeight,that,width,lineH)
    
    // 3. 放置底部二维码图片和文字信息
    let posY = height-110 + width*364/750
    context.drawImage(that.data.ewmImg, 15, posY, 100, 100)
    // 第一行
    context.font =  `normal bold ${16}px Microsoft YaHei`
    context.setFillStyle("#444")
    context.fillText('智慧通关正在招募关务牛人', 130, posY+40)
    // 第二行
    context.font =  `normal bold ${14}px Microsoft YaHei`
    context.setFillStyle("#444")
    context.fillText('长按打开小程序马上投递', 130, posY+70)
    wx.showLoading({
      title:'图片生成中...',
      mask: true
    })
    context.draw()
    // 生成海报地址
    setTimeout(()=> {
      that.canvasToTempImage(that, 'shareImg', 'portPath',function(){
        that.setData({
          portIsShow: true
        })
        wx.hideLoading()
        // 预览图片
        wx.previewImage({
          current: that.data.portPath,
          urls: [that.data.portPath]
        })
      })
    },1500)
    
  },
  // 生成图片上的文字
  setTextOnCanvas(context,canvasData,bgImgHeight,that, width, lineH) {
    var total = 0
    var breakWord = 0
    canvasData.forEach((v, i)=> {
      context.font = `normal bold ${v.fize}px Microsoft YaHei`
      context.setFillStyle("#444")
      context.fillText(v.title, 20, bgImgHeight+lineH*(total + 1+breakWord) + 40*i)
      v.info.forEach((item, index) => {
        context.font = `normal ${12}px Microsoft YaHei`
        context.setFillStyle("#666")
        breakWord += that.drawText(context,item,20, bgImgHeight + lineH*(index+total+2+breakWord)+40*i, width-40)
        // context.fillText(item, 20, bgImgHeight + 20*(index+i+total+2))
      })
      total += v.info.length
    })
    // context.stroke()
  },
  // 字体换行
  drawText(ctx, str, leftWidth, initHeight , canvasWidth) {        
    var lineWidth = 0;        
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引 
    var breakWord = 0
    for (let i = 0; i < str.length; i++) { 
        lineWidth += ctx.measureText(str[i]).width;            
        if (lineWidth > canvasWidth) {             
            ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分                
            initHeight += 20;             
            lineWidth = 0;                
            lastSubStrIndex = i;                
            // titleHeight += 30; 
            breakWord += 1 // 记录换行的次数    
        }            
        if (i == str.length - 1) { //绘制剩余部分                
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight)
        }        
    }        // 标题border-bottom 线距顶部距离        
    // titleHeight = titleHeight + 10;        
    // return titleHeight  
    return breakWord  
  },
  // 生成二维码图片
  createQrCode() {
    let that = this
    let { jobId, ewmPath} = that.data
    api.draw(ewmPath+jobId,'ewmImg',100,100,that)
    setTimeout(() => {
      that.canvasToTempImage(that,'ewmImg','ewmImg')
    }, 1500)
  },
  // 获取临时二维码路径保存在data中
  canvasToTempImage(that, canvasId, ewmImg, fn) {
    //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
    wx.canvasToTempFilePath({
        canvasId: canvasId,
        success: function(res) {
          var tempFilePath = res.tempFilePath
          let obj = {}
          obj[ewmImg] = tempFilePath
          that.setData(obj)
          fn && fn()
        }
    })
  },
  // 获取网络图片的信息
  getImageInfo() {
    wx.getImageInfo({
      src:'https://www.5itrade.cn/files/wechat/share_top.png',
      success: res => {
        // 获取本地路径
        this.setData({
          bgImage: res.path
        })
      }
    })
  },
  // 弹出蒙层
  showModal(e) {
    if(e && e.currentTarget.dataset.share === 'loginShare') { // 登录时的分享按钮
      // let { cms_user } = app.globalData
      // let {jobName} = this.data.jobDetail
      // let id = cms_user.userName || wx.getStorageSync('userId')
      // let mobile = cms_user.mobile || wx.getStorageSync('mobile')
      // this.addSharePage('职位详情-' + jobName, id, mobile)
      // this.addLogRecord('1','职位详情-' + jobName, mobile )
    }
    this.setData({
      isShowMask: false
    })
  },
  // 关闭蒙层
  cancelMask() {
    this.setData({
      isShowMask: true
    })
  },
  // 用户授权,调取用户信息
  getUserInfo() {
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success () {
              wx.getUserInfo({
                success: function(res) {
                  that.setData({
                    userInfo: res.userInfo
                  })
                  // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                }
              })
            }
          })
        }else {
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                userInfo: res.userInfo
              })
              // var gender = userInfo.gender //性别 0：未知、1：男、2：女
            }
          })
        }
      }
    })
  },
  // 添加引流日志记录
  addLogRecord(type,page,mobile) {
    wx.ajax({
      url:'API@plat-manager/drainageStatistics/addLogRecord',
      data:{
        "logType": type, // 记录类型1分享页转发数2分享页浏览数3简历投递数
        "sharePage": page,
        "sharePhone": mobile || ''
      },
      isLoading: false,
      success: res => {}
    })
  },
  addSharePage(page,id,mobile) {
    wx.ajax({
      url:'API@plat-manager/drainageStatistics/addSharePage',
      data:{
        "sharePage": page || '',
        "userId": id || '',
        "wxNickName": '',
        "wxPhone": mobile
      },
      isLoading: false,
      success: res => {}
    })
  },
  // 获取小程序sessionKy
  getSessionKey() {
    let that = this
    wx.login({
      success(res){
        wx.ajax({
          url:'API@login/login/queryWxLoginInfo',
          data: res.code,
          success: res => {
            that.setData({
              sessionKey: res.result.sessionKey
            })
          }
        })
      }
    })
    
  },
  // 获取手机号
  getPhoneNumber(e) {
    let that = this
    // 同意
    let {encryptedData, iv} = e.detail
    if(e.detail.errMsg === "getPhoneNumber:ok") {
      //发起网络请求
      that.queryWxPhone(that.data.sessionKey, encryptedData, iv, function(res) {
        // 获取返回的手机号
        let mobile = JSON.parse(res.result).phoneNumber
        that.setData({
          mobile: mobile
        })
        that.setStorageSync('shareMobileSelf', mobile)
        let {jobName} = that.data.jobDetail
        that.showModal()
        that.addSharePage('职位详情-' + jobName , '', mobile)
        that.addLogRecord('1','职位详情-' + jobName, mobile)
      })
    }else { // 拒绝
      that.cancelMask()
    }
  },
  // 获取手机号服务端api
  queryWxPhone(sessionKey, data, iv, fn) {
    wx.ajax({
      url:'API@plat-manager/drainageStatistics/queryWxPhone',
      data:{
        "sessionKey": sessionKey,
        "encryptedData": data,
        "iv": iv
      },
      success: res => {
        fn && fn(res)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 点击右上角胶囊按钮转发且必须是登录状态下统计分享次数
    let {jobName} = this.data.jobDetail
    if(this.data.isLogin) {
      let userId = wx.getStorageSync('userId')
      this.addSharePage('职位详情-' + jobName , userId, this.data.mobile)
      this.addLogRecord('1','职位详情-' + jobName, this.data.mobile)
    }
    // 未登录,且已经获取过手机号了
    if(!this.data.isLogin && this.data.mobile) {
      this.addSharePage('职位详情-' + jobName , '', this.data.mobile)
      this.addLogRecord('1','职位详情-' + jobName, this.data.mobile)
    }
    // 分享按钮获取的手机号或分享带过来的手机号
    let endMobile = this.data.mobile || this.data.shareMobile
    return {
      title:'职位信息',
      path: `/pages/jobs/jobDetails?shareMobile=${endMobile}&jobId=${this.data.jobId}`
    }
  } 
})