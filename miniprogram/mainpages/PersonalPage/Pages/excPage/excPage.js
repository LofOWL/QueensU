// miniprogram/mainpages/PersonalPage/Pages/excPage/excPage.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    personalexcList:[]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection('GoodsData').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.setData({
          personalexcList: res.data,
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