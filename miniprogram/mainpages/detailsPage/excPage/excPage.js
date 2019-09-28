
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
  copy: function (e) {
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