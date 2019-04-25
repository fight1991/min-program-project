var app = getApp()
Page({
  data: {
    tables: []
  },
  onLoad: function (options) {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        theme: userInfo.theme,
        userInfo: userInfo
      })
      that.getShotcutMenu(function (custome_rows) {
        var tables = []
        tables.push({
          "id": 0,
          "name": "已添加项",
          "rows": custome_rows
        })
        that.getMenu(function (datas) {
          for (var i = 0; i < datas.length; i++) {
            var rows = []
            var nodes = datas[i]["Nodes"]
            for (var j = 0; j < nodes.length; j++) {
              var item = nodes[j]
              if (!that.exsit(custome_rows, item["ID"])) {
                rows.push({
                  id: item["ID"], name: item["NAME"], normal: item["NORMAL_ICON"], pressed: item["PRESSED_ICON"], state: true, url: ".." + item["URL"], PID: item["PID"]
                })
              }
            }
            tables.push({
              "id": datas[i]["ID"],
              "name": datas[i]["Name"],
              "rows": rows
            })
          }
          that.setData({
            _tables: tables
          })
          that.initData()
        })
      })
    })
  },
  exsit: function (custome_rows, id) {
    for (var i = 0; i < custome_rows.length; i++) {
      if (custome_rows[i]["id"] == id) {
        return true
      }
    }
    return false
  },
  getMenu: function (callback) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    app.httpUtils.get("UserMenu", { "user_id": this.data.userInfo.userName, type: "01" }, function (data) {
      wx.hideLoading()
      if (data.Data5) {
        callback(data.Data5)
      }
    })
  },
  getShotcutMenu: function (callback) {
    var that = this
    app.httpUtils.get("UserMenu", { "user_id": this.data.userInfo.userName, type: '02' }, function (data) {
      if (data.Data5) {
        var rows = []
        for (var i = 0; i < data.Data5.length; i++) {
          var item = data.Data5[i]
          rows.push(
            {
              id: item["ID"], name: item["NAME"], normal: item["NORMAL_ICON"], pressed: item["PRESSED_ICON"], state: true, url: ".." + item["URL"], PID: item["PID"]
            })
        }
        callback(rows)
      }
    })
  },
  remove: function (e) {
    var index = e.currentTarget.dataset.index
    var tr = e.currentTarget.dataset.tr
    var td = e.currentTarget.dataset.td
    var node = this.data.tables[index].rows[tr][td]

    for (var i = 0; i < this.data._tables.length; i++) {
      if (this.data._tables[i].id == node.PID) {
        this.data._tables[i].rows.push(node)
      }
    }
    var curr_row = this.data._tables[0].rows
    var new_row = []
    for (var i = 0; i < curr_row.length; i++) {
      if (curr_row[i].id != node.id) {
        new_row.push(curr_row[i])
      }
    }
    this.data._tables[0].rows = new_row
    this.initData()
  },
  add: function (e) {
    var index = e.currentTarget.dataset.index
    var tr = e.currentTarget.dataset.tr
    var td = e.currentTarget.dataset.td
    var node = this.data.tables[index].rows[tr][td]
    var curr_row = this.data._tables[index].rows
    var new_row = []
    for (var i = 0; i < curr_row.length; i++) {
      if (curr_row[i].id != node.id) {
        new_row.push(curr_row[i])
      }
    }
    this.data._tables[index].rows = new_row
    this.data._tables[0].rows.push(node)
    this.initData()
  },
  initData: function () {
    console.log(this.data._tables)
    var tables = []
    for (var n = 0; n < this.data._tables.length; n++) {
      var data = this.data._tables[n]
      var count = Math.ceil(data.rows.length / 5)
      var rows = []
      for (var i = 0; i < count; i++) {
        var total = (i + 1) * 5
        if (total > data.rows.length) {
          total = data.rows.length
        }
        var tr = []
        for (var j = i * 5; j < total; j++) {
          var item = data.rows[j]
          tr.push(item)
        }
        var temp = 5 - tr.length
        for (var m = 0; m < temp; m++) {
          tr.push({
            id: "noe", name: "", normal: "", pressed: "", state: false, url: ""
          })
        }
        rows.push(tr)
      }
      tables.push({
        "name": data.name,
        "rows": rows
      })
    }
    this.setData({
      tables: tables
    })
  },
  edit: function () {

    var Menus = []
    for (var i = 0; i < this.data._tables[0].rows.length; i++) {
      Menus.push(this.data._tables[0].rows[i].id)
    }
    console.log(Menus)
    wx.showLoading({
      title: '提交中',
    })
    app.httpUtils.post('UserMenu', { type: 'set', "UserID": this.data.userInfo.userName, Menus: Menus }, function (data) {
      wx.hideLoading()
      if (data.Success) {
        wx.showToast({
          title: '修改成功',
        }) 
        wx.reLaunch({
          url: '../../pages/index/index'
        })
      } else {
        wx.showToast({
          title: '修改失败',
        })
      }
    })
  },
  reset: function () {
    var that = this
    wx.showLoading({
      title: '提交中',
    })
    app.httpUtils.post('UserMenu', { type: 'reset', "UserID": this.data.userInfo.userName, Menus: '' }, function (data) {
      wx.hideLoading()
      if (data.Success) {
        wx.showToast({
          title: '重置成功',
        })
        that.onLoad();
        wx.reLaunch({
          url: '../../pages/index/index'
        })
      } else {
        wx.showToast({
          title: '重置失败',
        })
      }
    })

  }
})