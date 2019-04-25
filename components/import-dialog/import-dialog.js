Component({
  options: {
    multipleSlots: true
  },
  properties: {
    title: {            
      type: String,   
      value: '标题'
    }
  },
  data: {
    isShow: false,
    value:""
  },
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
    bindData:function(e){
      this.data["value"] = e.detail.value
    },
    clear:function(){
      this.setData({
        value: ""
      })
    },
    cancel: function () {
      this.triggerEvent("cancelEvent")
      
    },
    ok: function () {
      var data = { data: this.data["value"]}
      this.triggerEvent("confirmEvent", data) 
    }
  }
})