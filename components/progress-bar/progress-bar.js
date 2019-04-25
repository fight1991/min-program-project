// components/progress-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    i:1
  },
  ready: function() {
    var that = this
    var cxt_arc = wx.createCanvasContext(this.data.canvasId, this);
 
    //var cxt_arc = wx.createCanvasContext('canvasArc', this);
    cxt_arc.setLineWidth(this.data.borderWidth);
    cxt_arc.setStrokeStyle('#d2d2d2');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath()
    cxt_arc.arc(this.data.r, this.data.r, this.data.r - this.data.borderWidth, 0, Math.PI * 2, false)
    cxt_arc.stroke()
    // console.log("size======================" + this.data.fontSize)
    cxt_arc.setFontSize(this.data.fontSize)
    cxt_arc.setFillStyle('black')
    cxt_arc.setTextAlign('center')
    // console.log(parseInt(this.data.r)  + this.data.fontSize / 2 - this.data.borderWidth / 2)
    cxt_arc.fillText(this.data.rate, parseInt(this.data.r), parseInt(this.data.r) + this.data.fontSize / 2 - this.data.borderWidth)

    cxt_arc.setFontSize(this.data.fontSize / 2)
    cxt_arc.setFillStyle('black')
    cxt_arc.setTextAlign('center')
    cxt_arc.fillText('%', parseInt(this.data.r), parseInt(this.data.r) + parseInt(this.data.fontSize) - this.data.borderWidth / 2)

    cxt_arc.setLineWidth(this.data.borderWidth)
    if (this.data.rate == 100) {
      cxt_arc.setStrokeStyle('#25CB73')
    }
    else if (this.data.rate >= 50) {
      cxt_arc.setStrokeStyle('#47B0DB')
    } else {
      cxt_arc.setStrokeStyle('#FBA6A6')
    }
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath()
    // console.log((this.data.rate / 100 / 2))
    cxt_arc.arc(this.data.r, this.data.r, this.data.r - this.data.borderWidth, -Math.PI * 1 / 2, 2 * Math.PI * (this.data.rate / 100) - Math.PI * 1 / 2, false)
    cxt_arc.stroke()
    cxt_arc.draw(true,function() {  
      wx.canvasToTempFilePath({
        canvasId: that.data.canvasId,
        success: function(res) {
          console.log(res.tempFilePath)
          that.setData({
            result_src: res.tempFilePath,
            i:0
          })
        }
      }, that)
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getDateTimeString: function() {
      var date = new Date();
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()

      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds()
      var milliseconds = date.getMilliseconds()

      return [year, month, day].join('') + [hour, minute, second, milliseconds].join('')
    },
    getGuid: function() {
      //return (S4() + S4()  + S4()  + S4()  + S4()  + S4() + S4() + S4());
      var result = 'xxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
      return result + this.getDateTimeString()
    }
  },
  properties: {
    r: {
      type: Int32Array,
      value: 40,
    },
    borderWidth: {
      type: Int32Array,
      value: 8,
    },
    fontSize: {
      type: Int32Array,
      value: 30,
    },
    rate: {
      type: Int32Array,
      value: 30,
    },
    canvasId: {
      type: String,
      value: 'canvasId',
    }
  }
})