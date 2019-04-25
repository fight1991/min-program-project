var platformHost = ""
var platformToken = ""

/**
 *  平台上传接口
 */
function uploadApi(callback) {
  var header = {
    "ssoToken": platformToken,
    "appWebFlag": "2",
    "sysId": "004",
    "content-type": "multipart/form-data"
  }
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      const tempFilePaths = res.tempFilePaths
      wx.uploadFile({
        header: header,
        url: platformHost + '/zuul/saas-upload' + '/upload/uploadFile',
        filePath: tempFilePaths[0],
        name: "multiFile",
        formData: {
          'randomNewFileName': 'true'
        },
        success(res) {
          callback(res.data)
        }
      })
    }
  })
}

/**
 *  平台公用api接口
 */
function aiApi(url, reqData, callback) {
  var data = {
    "appWebFlag": "2",
    "reqData": reqData,
    "sysId": "004"
  }
  var header = {
    'content-type': 'application/json',
    "ssoToken": platformToken
  }
  request(platformHost + "/zuul/saas-ai" + url, header, data, "POST", "json", callback)
}
/**
 *  平台AIapi接口
 */
function commonApi(url, reqData, callback) {
  var data = {
    "appWebFlag": "2",
    "reqData": reqData,
    "sysId": "004"
  }
  var header = {
    'content-type': 'application/json',
    "ssoToken": platformToken
  }
  request(platformHost + "/login" + url, header, data, "POST", "json", callback)
}

function decApi(url, reqData, callback) {
  var data = {
    "appWebFlag": "2",
    "reqData": reqData,
    "sysId": "004"
  }
  var header = {
    'content-type': 'application/json',
    "ssoToken": platformToken
  }
  request(platformHost + "/dec-common/dec/common/" + url, header, data, "POST", "json", callback)
}
/**
 * 物流跟踪接口
 */
function logistics(url, reqData, callback) {
  var data = {
    "appWebFlag": "2",
    "reqData": reqData,
    "sysId": "004"
  }
  var header = {
    'content-type': 'application/json',
    "ssoToken": platformToken
  }
  request(platformHost + "/logistics-common" + url, header, data, "POST", "json", callback)
}

/**
 * 平台字典数据服务
 */
function dictionary(url, reqData, callback) {
  var data = {
    "appWebFlag": "2",
    "reqData": reqData,
    "sysId": "004"
  }
  var header = {
    'content-type': 'application/json',
    "ssoToken": platformToken
  }
  request(platformHost + "/saas-dictionary" + url, header, data, "POST", "json", callback)
}


/**
 * 平台活动服务
 */
function activity(url, reqData, callback) {
  var data = {
    "appWebFlag": "2",
    "reqData": reqData,
    "sysId": "004"
  }
  var header = {
    'content-type': 'application/json',
  }
  request(platformHost + "/saas-activity" + url, header, data, "POST", "json", callback)
}

/**
 * 设置平台host地址
 */
function setHostAndToken(host, token) {
  platformHost = host
  platformToken = token
  console.log("init host ====>" + host)
  console.log("init token ====>" + token)
}

function setToken(token) {
  platformToken = token
  console.log("init token ====>" + token)
}


/**
 * http请求
 */
function request(url, header, data, method, dataType, callback) {
  console.log("请求地址：" + url)
  console.log("请求方式：" + method)
  console.log("请求参数" + JSON.stringify(data))
  wx.request({
    url: url,
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

function uploadFile(path, callback) {
  var header = {
    "ssoToken": platformToken,
    "appWebFlag": "2",
    "sysId": '004',
    "content-type": "multipart/form-data"
  }
  wx.uploadFile({
    header: header,
    url: platformHost + '/zuul/saas-upload' + '/upload/uploadFile',
    filePath: path,
    name: "multiFile",
    formData: {
      'randomNewFileName': 'true'
    },
    success(res) {
      callback(res.data)
    }
  })
}
module.exports = {
  setHostAndToken: setHostAndToken,
  commonApi: commonApi,
  logistics: logistics,
  uploadApi: uploadApi,
  uploadFile: uploadFile,
  dictionary: dictionary,
  activity: activity,
  setToken: setToken,
  aiApi: aiApi,
  decApi: decApi
}