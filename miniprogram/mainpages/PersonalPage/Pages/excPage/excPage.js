// miniprogram/mainpages/PersonalPage/Pages/excPage/excPage.js
const app = getApp()

function goodsDataCollection(goods, excType) {
  console.log("get in goods data")
  console.log(excType)
  console.log(goods)
  var isExist = true;
  const db = wx.cloud.database()
  db.collection('GoodsDataCollect').where({
    goods: goods,
    excType: excType,
  }).get({
    success: res => {
      isExist = res.data.length != 0;
      console.log(isExist)
      console.log(res.data)

      // update or create database
      if (isExist) {
        console.log("@@@@@@@@@@")
        console.log(res.data[0].count)
        console.log(res.data[0].count -1)
        wx.cloud.callFunction({
          name: 'GoodsDataCollect',
          data: {
            goods: goods,
            excType: excType,
            count: res.data[0].count - 1
          },
          success: res => {
            console.log("cloud result")
            console.log(res)
          },
          fail: err => {
            console.log("err")
            console.log(err)
          }
        })
        console.log("finish the cloud function")
      } else {
        db.collection('GoodsDataCollect').add({
          data: {
            goods: goods,
            excType: athis.data.excType,
            count: 1
          }
        })
      }
    }
  })
}


Page({

  /**
   * Page initial data
   */
  data: {
    personalexcList:[],
    finish: false,
    adelete: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      finish: false
    })
    const db = wx.cloud.database()
    db.collection('GoodsData').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.setData({
          personalexcList: res.data,
          finish: true
        })
        wx.stopPullDownRefresh()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        this.setData({
          finish: true
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  onRemove: function (e) {
    this.setData({
      adelete: false
    })
    const db = wx.cloud.database()
    db.collection(e.currentTarget.dataset.name).doc(e.currentTarget.dataset.id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        // date from to carType
        goodsDataCollection(e.currentTarget.dataset.goods, e.currentTarget.dataset.exctype)
        this.setData({
          adelete: true
        })
        this.onLoad()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  }
})