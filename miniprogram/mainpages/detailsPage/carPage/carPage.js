function getCarInfo(athis, options) {
  const db = wx.cloud.database()
  console.log(options.date)
  console.log(options.from)
  console.log(options.to)
  console.log(options.carType)
  db.collection('CarData').orderBy("date", "asc").where({
    date: options.date,
    from: options.from,
    to: options.to,
    carType: options.carType
  }).get({
    success: res => {
      console.log("done ")
      console.log(res.data)
      athis.setData({
        carlist: res.data,
        loading: true
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

Page({

  /**
   * Page initial data
   */
  data: {
    carlist: [],
    loading: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    getCarInfo(this, options)
  },
  copy: function (e){
    console.log(e);
    console.log(e.currentTarget.dataset.contact);
    wx.setClipboardData({
      data: e.currentTarget.dataset.contact,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  }
})