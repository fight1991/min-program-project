Component({
  options: {
    multipleSlots: true
  },
  properties: {
    title: {            
      type: String,     
      value: '标题'     
    },
    content: {
      type: String,
      value: '弹窗内容'
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '确定'
    }
  },
  data: {
    isShow: false
  },
  methods: {
    hideDialog() {
      this.setData({
        isShow: false
      })
    },
    showDialog() {
      this.setData({
        isShow: true
      })
    },
    _cancelEvent() {
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      this.triggerEvent("confirmEvent");
    }
  }
})