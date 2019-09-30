function getQueInfo(athis) {
  const db = wx.cloud.database()
  db.collection('CallData').orderBy("total", "desc").get({
    success: res => {
      athis.setData({
        calllist: res.data,
        queUpdate: true
      })
      wx.showToast({
        icon: 'none',
        title: '更新成功'
      })

    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      wx.stopPullDownRefresh()
    }
  })
}

Component({
  /**
   * Component properties
   */
  properties: {
    calllist: Array
  },

  /**
   * Component initial data
   */
  data: {
    calllist: [],
    queUpdate: true,
  },
  lifetimes: {
    attached: function () {
      this.setData({
        calllist: this.properties.calllist
      })
    }
  },
  /**
   * Component methods
   */
  methods: {
    editInformation: function (e) {
      console.log(e.currentTarget.dataset.id)
      switch (e.currentTarget.dataset.type) {
        case "start":
          this.setData({
            queUp: e.currentTarget.dataset.up,
            queDown: e.currentTarget.dataset.down,
            queTotal: e.currentTarget.dataset.total,
            queId: e.currentTarget.dataset.id,
            showModalStatus: true
          })
          break
        case "close":
          this.setData({
            queId: "",
            showModalStatus: false
          })
          break
      }
    },
    queEdit: function (e) {
      console.log("get into!!!")
      this.setData({
        queUpdate: false
      })
      console.log(e.currentTarget.dataset.type)
      console.log(e.currentTarget.dataset.id)

      const db = wx.cloud.database()
      const _ = db.command
      db.collection('CallData').where({
        _id: e.currentTarget.dataset.id
      }).get({
        success: res => {
          console.log("get into success")
          var down = res.data[0]["down"]
          var up = res.data[0]["up"]
          var total = res.data[0]["total"]
          switch (e.currentTarget.dataset.type) {
            case "up":
              wx.cloud.callFunction({
                name: 'editQuestion',
                data: {
                  database: "CallData",
                  id: e.currentTarget.dataset.id,
                  up: up + 1,
                  total: up + 1 - down
                },
                success: res => {
                  // refresh
                  getQueInfo(this)

                },
                fail: err => {
                  console.log("err")
                  console.log(err)
                  this.setData({
                    queUpdate: true
                  })
                }
              })
              break
            case "down":
              wx.cloud.callFunction({
                name: 'editQuestion',
                data: {
                  id: e.currentTarget.dataset.id,
                  database: "CallData",
                  down: down + 1,
                  total: up - down - 1
                },
                success: res => {
                  //refresh
                  getQueInfo(this)

                },
                fail: err => {
                  console.log("err")
                  console.log(err)
                  this.setData({
                    showModalStatus: false,
                    queUpdate: true
                  })
                }
              })

              break
          }
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          wx.stopPullDownRefresh()
        }
      })
    }
  }
})
