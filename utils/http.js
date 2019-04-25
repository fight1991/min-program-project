var utils = require('util.js')
var baseUrl = ''
var AccessToken = ''

function setApiUrl(api) {
  baseUrl = api
}

function setToken(token) {
  AccessToken = token
}

function login(host, http_method, data, callback, errcallback) {
  wx.login({
    success: function(res) {
      if (res.code) {
        wx.getUserInfo({
          success: function(r) {
            console.log(r)
            data.encryptedData = r.encryptedData
            data.iv = r.iv
            data.code = res.code
            wx.request({
              url: host + '/Api/Auth',
              method: http_method,
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: data,
              success: function(data) {
                wx.hideLoading()
                console.log(data)
                data.statusCode == 200 && (typeof callback == "function") && callback(data.data)
              },
              fail: function(err) {
                console.log(123)
                typeof errcallback == "function" && errcallback(err)
                console.log('系统错误')
                console.log(err)
              }
            })
          },
          fail: function(res) {
            console.log(res)
          }
        })
      } else {
        wx.showModal({
          title: '警告',
          content: '获取用户登录态失败！' + res.errMsg,
          success: function(res) {
            if (res.confirm) {}
          }
        })
      }
    }
  })
}

function unbind(host, data1, callback, errcallback) {
  console.log(host)
  console.log(data1)
  console.log(callback)
  console.log(errcallback) 
  wx.request({
    url: host + '/Api/Auth',
    method: 'Delete',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      "AccessToken": AccessToken
    },
    data: data1,
    success: function(data) {
      wx.hideLoading()
      data.statusCode == 200 && (typeof callback == "function") && callback(data.data)
    },
    fail: function(err) {
      typeof errcallback == "function" && errcallback(err)
      console.log('系统错误')
      console.log(err)
    }
  })
}
/**
 * http请求
 */
function request(url, header, data, method, dataType, callback) {
  if (!header) {
    header = {
      AccessToken: AccessToken
    }
  } else {
    header.AccessToken = AccessToken
  }
  console.log("请求地址：" + url)
  console.log("请求方式：" + method)
  console.log("请求参数" + JSON.stringify(data))
  wx.request({
    url: baseUrl + url,
    data: data,
    method: method,
    dataType: dataType,
    header: header,
    success: function(res) {
      console.log(res.data)
      if (callback) {
        callback(res.data)
      }
    },
    complete: function(res) {
      console.log(res)
    },
    fail: function(res) {
      console.log(res)
    }
  })
}

/**
 * post请求
 */
function post(url, data, callback) {
  request(url, {
    'content-type': 'application/json'
  }, data, "POST", "json", callback)
}

/**
 * get请求
 */
function get(url, data, callback) {
  request(url, {
    'content-type': 'application/json'
  }, data, "GET", "json", callback)
}

/**
 * 上传文件 
 * fileType为0代表图片
 * fileType为1代表文档
 */
function upload(url, postdata, callback, fileType) {
  if (fileType == 0) {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '',
        })
        uploadFile(url, tempFilePaths, 0, postdata, callback)
        console.log("-------------" + tempFilePaths)
      },
      fail: function(result) {
        console.log(result)
      }
    })
  } else {
    wx.chooseImage({
      success: function(res) {
        wx.showLoading({
          title: '',
        })
        var tempFilePaths = res.tempFilePaths
        uploadFile(url, tempFilePaths, 0, postdata, callback)
      },
      fail: function(result) {
        // wx.showToast({
        //   title: '上传失败',
        //   icon: 'success',
        //   duration: 2000
        // })
        console.log(result)
      }
    })
  }
}

function uploadFile(url, tempFilePaths, i, postdata, callback) {
  wx.uploadFile({
    url: url,
    filePath: tempFilePaths[i],
    name: 'file',
    formData: postdata,
    header: {
      'content-type': 'multipart/form-data',
      'AccessToken': AccessToken
    },
    success: function(res) {
      wx.hideLoading()
      console.log(res)
      var j = i + 1;
      if (j < tempFilePaths.length) {
        uploadFile(url, tempFilePaths, j, postdata)
      } else if (callback) {
        callback()
      }
    },
    fail: function(res) {
      wx.hideLoading()
      // wx.showToast({
      //   title: '上传失败',
      // })
      console.log(res)
    }
  })
  // uploadTask.onProgressUpdate((res) => {
  //   console.log('上传进度', res.progress)
  //   console.log('已经上传的数据长度', res.totalBytesSent)
  //   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
  // })
  //uploadTask.abort() 
}

/**
 * 预览 
 * fileType为0代表图片
 * fileType为1代表文档
 */
function preview(url, fileType) {
  if (getFileType(fileType) == 0) {
    previewImg(url)
  } else {
    previewFile(url)
  }
}

/**
 * 预览图片
 */
function previewImg(url) {
  wx.previewImage({
    current: "",
    urls: [url]
  })
}


/**
 * 预览文档
 */
function previewFile(url) {
  wx.showLoading({
    title: 'downloading...',
  })
  wx.downloadFile({
    url: url,
    success: function(res) {
      wx.hideLoading()
      var filePath = res.tempFilePath
      wx.openDocument({
        filePath: filePath,
        success: function(res) {
          console.log(url + '打开成功')
        },
        fail: function() {
          console.log(url + '预览失败')
          wx.showToast({
            title: '预览失败',
          })
        }
      })
    },
    fail: function(res) {
      wx.hideLoading()
      wx.showToast({
        title: '下载失败' + res,
      })
      console.log(res)
    }
  })
}

/**
 * 扫描二维码 并回调返回扫码结果
 */
function scanCode(callback) {
  success: (res) => {
    console.log(res)
    if (callback) {
      callback(res.result)
    }
  }
}

function getFileType(extsion) {
  var list = ["image/jpeg", "image/png", ".bmp", ".jpg", ".png", ".tiff", ".gif", ".pcx", ".tga", ".exif", ".fpx", ".svg", ".psd", ".cdr", ".pcd", ".dxf", ".ufo", ".eps", ".ai", ".raw", ".WMF"]
  for (var i = 0; i < list.length; i++) {
    if (extsion.toLowerCase() == list[i]) {
      return 0 //图片
    }
  }
  return 1
}

//initData
function initData(that, flag, path) {
  if (that.data.status_flag) {
    return
  }
  that.data.status_flag = true
  if (that.data.showTitle == "0") {
    wx.showLoading({
      title: '加载中...',
    })
  }
  get(path, that.data.searchModel, function(data) {
    if (data.Success) {
      if (flag == true) {
        that.setData({
          datas: []
        })
      }
      var datas = that.data.datas
      console.log(datas),
        data.Data5.rows.forEach(function(val, index) {
          if (path == "Act") {
            val.RCV_DATE = utils.dateFormatter(val.RCV_DATE)
            val.CREATE_DATE = utils.dateFormatter(val.CREATE_DATE)
          } else if (path == "Entry") {
            val.D_DATE = utils.dateFormatter(val.D_DATE)
          } else if (path == "Information") {
            if (val.EditTime != null) {
              val.EditTime = utils.dateTimeFormatter(val.EditTime)
            } else {

              val.EditTime = ' '
            }
          } else if (path == "DecTimeLine") {
            val.TIME_0 = utils.dateFormatter(val.TIME_0)
          }
          datas.push(val)
        })
      that.data.searchModel.PageIndex += 1
      if (data.Data5.total <= datas.length) {
        that.data.searchModel.enable = false
      } else {
        that.data.searchModel.enable = true
      }
      if (datas.length == 0) {
        that.setData({
          showflag: 2,
          searchNone: true
        })
      } else if (datas.length > 0) {
        that.setData({
          searchNone: false,
          showflag: 0
        })
      }
      
      if (flag == true) {
        //设置延迟
        setTimeout(function() {
          that.setData({
            //加载成功
            showTitle: "3"
          })
        }, 500)
        setTimeout(function() {
          that.setData({
            margin_top: 0,
            showTitle: "0",
            //判断当前刷新是否完成
            showFinish: true,
            scroll: true
          })
        }, 900)
      } 
      that.setData({
        datas: datas,
        showList: true
      }) 
      
      
      wx.hideLoading()
    } else {
      wx.hideLoading()
      wx.showToast({
        title: data.ErrorMessage + "",
      })
    }
    that.data.status_flag = false
  })
}

function initData4ccba(that, flag, path) {
  if (that.data.status_flag) {
    return
  }
  that.data.status_flag = true
  if (that.data.showTitle == "0") {
    wx.showLoading({
      title: '加载中...',
    })
  }
  get(path, that.data.searchModel, function(data) {
    if (data.Success) {
      if (flag == true) {
        that.setData({
          datas: []
        })
      }
      var datas = that.data.datas
      console.log(datas),
        data.Data5.data.forEach(function(val, index) {
          val.I_E_DATE = utils.dateTimeFormatter(val.I_E_DATE)
          datas.push(val)
        })
      if (datas.length == 0) {
        that.setData({
          showflag: 2,
          searchNone: true
        })
      } else if (datas.length > 0) {
        that.setData({
          searchNone: false,
          showflag: 0
        })
      }
      wx.hideLoading()
      if (flag == true) {
        //设置延迟
        setTimeout(function() {
          that.setData({
            //加载成功
            showTitle: "3"
          })
        }, 500)
        setTimeout(function() {
          that.setData({
            margin_top: 0,
            showTitle: "0",
            //判断当前刷新是否完成
            showFinish: true,
            scroll: true
          })
        }, 900)
      }
      that.setData({
        datas: datas,
        showList: true
      })
    } else {
      wx.showToast({
        title: data.ErrorMessage + "",
      })
    }
    that.data.status_flag = false
  })
}

function approveInitData(that, path) {
  if (that.data.status_flag) {
    return
  }
  that.data.status_flag = true
  wx.showLoading({
    title: '加载中...',
  })
  get(path, that.data.searchModel, function(data) {
    if (data.Success) {
      that.data.total = data.Data5.total
      var datas = that.data.datas
      data.Data5.rows.forEach(function(val, index) {
        if (path == "Approve") {
          val.UPDATE_TIME = utils.dateFormatter(val.UPDATE_TIME)
        } else if (path == "EntryApprove") {
          val.RCV_DATE = utils.dateFormatter(val.RCV_DATE)
        }
        datas.push(val)
      })
      that.data.searchModel.PageIndex += 1
      if (data.Data5.total <= datas.length) {
        that.data.searchModel.enable = false
      } else {
        that.data.searchModel.enable = true
      }
      if (datas.length == 0) {
        that.setData({
          showflag: 2,
          searchNone: true
        })
      } else if (datas.length > 0) {
        that.setData({
          showflag: 0
        })
      }
      that.setData({
        datas: datas
      })
      wx.hideLoading()
    } else {
      wx.showToast({
        title: data.ErrorMessage + "",
      })
    }
    that.data.status_flag = false
  })
}

function approveInitData_ed(that, path) {
  if (that.data.status_flag_ed) {
    return
  }
  that.data.status_flag_ed = true
  wx.showLoading({
    title: '加载中...',
  })
  get(path, that.data.searchModel_ed, function(data) {
    if (data.Success) {
      that.data.total_ed = data.Data5.total
      var datas_ed = that.data.datas_ed
      data.Data5.rows.forEach(function(val, index) {
        if (path == "Approve") {
          val.UPDATE_TIME = utils.dateFormatter(val.UPDATE_TIME)
        } else if (path == "EntryApprove") {
          val.AUDIT_TIME = utils.dateFormatter(val.AUDIT_TIME)
        }
        datas_ed.push(val)
      })
      that.data.searchModel_ed.PageIndex += 1
      if (data.Data5.total <= datas_ed.length) {
        that.data.searchModel_ed.enable = false
      } else {
        that.data.searchModel_ed.enable = true
      }
      if (datas_ed.length == 0) {
        that.setData({
          showflag1: 2,
          searchNone1: true
        })
      } else if (datas_ed.length > 0) {
        that.setData({
          showflag1: 0
        })
      }
      that.setData({
        datas_ed: datas_ed
      })
      wx.hideLoading()
    } else {
      wx.showToast({
        title: data.ErrorMessage + "",
      })
    }
    that.data.status_flag_ed = false
  })
}

function util(path, search, that, currentStatu) {
  console.log(search)
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  that.animation = animation
  animation.opacity(0).rotateX(-100).step()
  that.setData({
    animationData: animation.export()
  })
  setTimeout(function() {
    animation.opacity(1).rotateX(0).step()
    that.setData({
      animationData: animation
    })
    if (currentStatu == "close") {
      that.setData({
        showModalStatus: false,
        scroll: true
      })
    }
  }.bind(that), 200)
  if (currentStatu == "open") {
    get(path, search, function(data) {
      if (data.Success) {
        that.setData({
          obj: data.Data5,
          scroll: false,
          showModalStatus: true
        })
      }
    })
  }
}

module.exports = {
  scanCode: scanCode,
  preview: preview,
  upload: upload,
  post: post,
  get: get,
  request: request,
  login: login,
  uploadFile: uploadFile,
  initData: initData,
  util: util,
  approveInitData: approveInitData,
  approveInitData_ed: approveInitData_ed,
  initData4ccba: initData4ccba,
  setApiUrl: setApiUrl,
  unbind: unbind,
  setToken: setToken
}