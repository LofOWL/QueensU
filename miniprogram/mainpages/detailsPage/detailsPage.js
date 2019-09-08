function getCarInfo(athis,options) {
  const db = wx.cloud.database()
  db.collection('CarData').orderBy("date", "asc").where({
    date: options.date,
    from: options.from,
    to: options.to,
    carType: options.carType
  }).get({
    success: res => {
      athis.setData({
        carlist: res.data,
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

function getExcInfo(athis,options) {
  const db = wx.cloud.database()
  db.collection('GoodsData').where({
    goods: options.goods,
    excType: options.excType
  }).get({
    success: res => {
      athis.setData({
        exclist: res.data,
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
  data:{
    type: 0,
    carlist: [],
    exclist: [],
  },
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  },
  onLoad: function(options){
    this.setData({
      type: options.type
    })
    if (options.type == 1){
      getCarInfo(this,options)
      console.log(this.data.carlist)
    }else if (options.type == 2){
      getExcInfo(this,options)
    }
  }
})
