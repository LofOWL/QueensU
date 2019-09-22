
function getExcInfo(athis, options) {
  const db = wx.cloud.database()
  db.collection('GoodsData').where({
    goods: options.goods,
    excType: options.excType
  }).get({
    success: res => {
      athis.setData({
        exclist: res.data,
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
    exclist: [],
    loading: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    getExcInfo(this, options)
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