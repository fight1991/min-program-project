import config from '../config/config'
// post请求
const ajax = ({ url, data={}, header=true, method='POST', isLoading=true, success, error,other }) => {
  // 配置入参
  let obj = {
    appWebFlag:'2',
    sysId : config['SYSID'],
    reqData:data
  }
  let params = {
    method,
    data: obj
  }
  // 头参数
  if(header) {
    params.header = {
      'ssoToken': wx.getStorageSync('unionid') || '',
    }
  }
  // api地址
  let baseURL = config[url.split('@')[0]]
  params.url = baseURL + '/' + url.split('@')[1]

  // 是否显示蒙层
  if(isLoading) {
    wx.showLoading({
      title: '加载中 ...',
      mask: true
    })
  }
   new Promise((resolve,reject) => {
    wx.request({
      ...params,
      success:resolve,
      fail:reject
    })
  })
  .then(res => {
    // 关闭蒙层
    if (isLoading) wx.hideLoading()
    let _result = res.data
    if(_result.code === '0000') {
      success && success(_result)
    }else {
      if(other) {
        other(_result)
      }else {
        if (_result.code === '0001') { // 业务报错
          wx.showToast({
            title: _result.message,
            duration: 2000,
            icon:'none'
          })
        }
        if(_result.code === '0002') { // token失效
          wx.showToast({
            title: _result.message,
            duration: 1500,
            icon:'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/accountBind/accountBind'
            })
          },1500)
        }
      }
    }
  })
  .catch(res => {
    // 关闭蒙层
    if (isLoading) wx.hideLoading()
    let _result = res.data
    error && error(_result)
  })
}
// 图片上传
const upload = ({ url, data = {}, name ='multiFile', isLoading=true, header=true, filePath, other, success, error }) => {
  // 配置入参
  let params = {
    filePath,
    name
  }
  // 头参数
  if (header) {
    params.header = {
      'Content-Type': 'multipart/form-data',
      'ssoToken': wx.getStorageSync('unionid') || '',
      'appWebFlag': '2',
      'sysId': config['SYSID']
    }
  }
  // api地址
  let baseURL = config[url.split('@')[0]]
  params.url = baseURL  + '/' +  url.split('@')[1]
  
  // 是否显示蒙层
  if(isLoading) {
    wx.showLoading({
      title: '上传中 ...',
      mask: true
    })
  }
  new Promise((resolve,reject) => {
    wx.uploadFile({
      ...params,
      formData: data,
      success: resolve,
      fail: reject
    })
  })
  .then(res => {
    // 关闭蒙层
    if (isLoading) wx.hideLoading()
    let _result = JSON.parse(res.data)
    if(_result.code === '0000') {
      success && success(_result)
    }else {
      if(other) {
        other(_result)
      }else {
        if (_result.code === '0001') { // 业务报错
          wx.showToast({
            title: _result.message,
            duration: 2000
          })
        }
        if(_result.code === '0002') { // token失效
          wx.showToast({
            title: _result.message,
            duration: 1500
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/accountBind/accountBind'
            })
          },1500)
        }
      }
    }
    
  })
  .catch(res => {
    // 关闭蒙层
    if (isLoading) wx.hideLoading()
    let _result = res.data
    error && error(_result)
  })
}

export { ajax, upload } 