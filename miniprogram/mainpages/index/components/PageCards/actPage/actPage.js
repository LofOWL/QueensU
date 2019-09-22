function getActInfo(athis) {
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('ActData').orderBy("date", "acs").get({
    success: res => {
      console.log(res.data)
      athis.setData({
        actList: res.data
      })
      wx.stopPullDownRefresh()
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
    actlist: Array
  },

  /**
   * Component initial data
   */
  data: {
    actList: []
  },
  lifetimes: {
  
    attached: function () {
      console.log("get in act page")
      console.log(this.properties.actlist)
      // console.log("get into act page")
      // getActInfo(this)
      this.setData({
        actList: this.properties.actlist
      })
    }
  },

  /**
   * Component methods
   */
  methods: {

  }
})
