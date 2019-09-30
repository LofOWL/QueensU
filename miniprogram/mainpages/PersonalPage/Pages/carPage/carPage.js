// miniprogram/mainpages/PersonalPage/Pages/carPage/carPage.js
const app = getApp()

function carDataCollection(date, from, to, carType) {
  var isExist = true;
  const db = wx.cloud.database()
  db.collection('CarDataCollect').where({
    date: date,
    from: from,
    to: to,
    carType: carType
  }).get({
    success: res => {
      isExist = res.data.length != 0;
      console.log(isExist)

      // update or create database
      if (isExist) {
        console.log(res.data[0].count)
        wx.cloud.callFunction({
          name: 'CarDataCollect',
          data: {
            date: date,
            from: from,
            to: to,
            carType: carType,
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
      }
    }
  })
}

Page({

  /**
   * Page initial data
   */
  data: {
    personalcarList: [],
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
    db.collection('CarData').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          personalcarList: res.data,
          finish: true
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        this.setData({
          personalcarList: res.data,
          finish: true
        })
      }
    })
  },
  onRemove: function (e) {
    this.setData({
      adelete: false
    })
    var date = e.currentTarget.dataset.date
    var from = e.currentTarget.dataset.from
    var to = e.currentTarget.dataset.to
    console.log("get in car remove")
    console.log(e.currentTarget.dataset)
    console.log(e.currentTarget.dataset.cartype)
    const db = wx.cloud.database()
    db.collection(e.currentTarget.dataset.name).doc(e.currentTarget.dataset.id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.setData({
          adelete: true
        })
        this.onLoad()
        // date from to carType
        carDataCollection(date, from, to, e.currentTarget.dataset.cartype)
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