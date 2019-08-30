// mainpages/index/index.js

function getCarInfo(athis){
  const db = wx.cloud.database()
  db.collection('CarData').get({
    success: res => {
      athis.setData({
        finish: true,
        carlist: res.data,
        result: JSON.stringify(res.data, null, 2)
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

function getExcInfo(athis){
  const db = wx.cloud.database()
  db.collection('GoodsData').get({
    success: res => {
      athis.setData({
        finish: true,
        exclist: res.data,
        result: JSON.stringify(res.data, null, 2)
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
  data: {
    finish: false,
    carlist: [],
    exclist: [],
    result: ''
  },
  onPullDownRefresh: function(){
    this.onLoad()
  },
  onLoad: function(){
    getCarInfo(this)
    getExcInfo(this)
  },
  // add Button used to navigate to createData Page
  onCreateData:function(){
    wx.navigateTo({
      url: '../createData/createData',
    })
  }
})
