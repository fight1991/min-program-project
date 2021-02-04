// pages/aiLab/cv/correction/index.js
let app = getApp()
Page({

    /**
     * Page initial data
     */
    data: {
        tempFilePath: null,
        imgUrl: null,
        ocrResult: '',
        warn: ''
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        var that = this
        app.getUserInfo(function (userInfo) {
            that.setData({
                userInfo: userInfo,
                warn: '请先选择图片(将待识别文件置于深色背景中，保持边缘清晰)'
            })
        })
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {

    },

    /**
     * Lifecycle function--Called when page hide
     */
    onHide: function () {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload: function () {

    },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh: function () {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom: function () {

    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage: function () {

    },

    chooseImage: function () {
        let _this = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                _this.setData({
                    tempFilePath: res.tempFilePaths,
                    imgUrl: null,
                    ocrResult: null,
                    warn: ''
                })

                wx.showLoading({
                    title: '处理中，请稍等...',
                })

                wx.uploadFile({
                    url: _this.data.userInfo.platformHost + "/saas-ai/ocr/fileOCRByTemplateCode",
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    formData: {
                        lang: 'chi_sim',
                        psm: -1,
                        templateCode: 'T844277559737715527',
                        useDirectOCR: 'true'
                    },
                    header: {
                        "ssoToken": _this.data.userInfo.token,
                        "appWebFlag": "2",
                        "sysId": "004",
                        "content-type": "multipart/form-data"
                    },
                    success(res) {
                        console.log(res);
                        wx.hideLoading()
                        if (!(200 === res.statusCode)) {
                            wx.showToast({
                                title: '网络异常',
                                icon: 'none',
                                duration: 1000
                            })
                            return
                        }
                        let data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                        if (!('0000' === data.code)) {
                            wx.showToast({
                                title: '处理异常',
                                icon: 'none',
                                duration: 1000
                            })
                            return
                        }
                        _this.setData({ocrResult: data.result.result[0], imgUrl: data.result.info.imgUrl});
                        _this.setData({warn: '识别结果'})
                    },
                    fail: function (error) {
                        wx.hideLoading()
                        console.log(error);
                        wx.showToast({
                            title: '识别失败',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                })
            }
        })
    },

    previewImage: function (e) {
        var current=e.target.dataset.src;
        wx.previewImage({
            current: current,
            urls: this.data.tempFilePath
        })
    },

    previewResult: function (e) {
        var current=e.target.dataset.src;
        wx.previewImage({
            current: current,
            urls: [this.data.imgUrl]
        })
    }
})