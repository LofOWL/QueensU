function getQueInfo(athis) {
  const db = wx.cloud.database()
  db.collection('CallData').get({
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

  },

  /**
   * Component initial data
   */
  data: {
    que: ""
  },
  lifetimes: {
    
  },

  /**
   * Component methods
   */
  methods: {

  }
})
