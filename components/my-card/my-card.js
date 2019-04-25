Component({
  options: {
    multipleSlots: true
  },
  properties: {
    
    userName: {
      type: String, 
      value: ''
    },
    companyName: {
      type: String,
      value: ''
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false,
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {  
    hide() {
      this.setData({
        isShow: false
      })
    }, 
    show() {
      this.setData({
        isShow: true
      })
    },
    test:function(){
      console.log("test")
    }, 
    setImgSource:function(url){
      this.setData({
        url: url
      })
    },
    getImageUrl:function(){
      return this.data.url
    },
    download:function(){
      var img_url = this.data.url
      wx.downloadFile({
        url: img_url,
        success: function (res) {
          if (res.statusCode === 200) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success(res) {
                wx.showToast({
                  icon:'none',
                  title: "保存成功"
                })
              }
            })
          }
        }
      })
      
    }
  }
})