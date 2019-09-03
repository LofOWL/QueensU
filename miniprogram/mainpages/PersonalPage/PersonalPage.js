const app = getApp()

function getAll(athis){
  const db = wx.cloud.database()
  db.collection('CarData').where({
    _openid: app.globalData.openid
    }).get({
    success: res => {
      athis.setData({
        personalcarList: res.data,
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

  db.collection('GoodsData').where({
    _openid: app.globalData.openid
  }).get({
    success: res => {
      athis.setData({
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
}

function carDataCollection(date,from,to,carType) {
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

  data: {
    personalcarList: [],
    personalexcList: [],
    openid: ""
  },

  onLoad: function(){
    console.log(app.globalData.openid);
    this.setData({
      openid: app.globalData.openid
    })
    getAll(this)
  },

  onRemove: function(e){
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.name)
    console.log(this.data.openid)
    var date = e.currentTarget.dataset.date
    var from = e.currentTarget.dataset.from
    var to = e.currentTarget.dataset.to
    var carType = e.currentTarget.dataset.carType
    console.log(e.currentTarget.dataset.date)
    console.log(e.currentTarget.dataset.from)
    console.log(e.currentTarget.dataset.to)
    console.log(e.currentTarget.dataset.carType)
    const db = wx.cloud.database()
    db.collection(e.currentTarget.dataset.name).doc(e.currentTarget.dataset.id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        // date from to carType
        carDataCollection(date,from,to,carType)
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
