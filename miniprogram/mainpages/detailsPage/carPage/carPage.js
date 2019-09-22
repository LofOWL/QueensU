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

  }
})