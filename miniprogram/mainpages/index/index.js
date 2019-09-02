// mainpages/index/index.js

function getCarInfo(athis){
  const db = wx.cloud.database()
  db.collection('CarDataCollect').orderBy("date","asc").get({
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
  db.collection('GoodsDataCollect').get({
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

function getQueInfo(athis){
  const db = wx.cloud.database()
  db.collection('QueData').get({
    success: res => {
      athis.setData({
        quelist: res.data
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

function getNextInfor(athis,name,index){
  const db = wx.cloud.database()
  db.collection(name).skip(index).limit(20).orderBy("date","asc").get({
    success: res =>{
      console.log("success")
      console.log(res.data)
      switch(name){
        case "CarDataCollect":
        console.log("car data")
        athis.setData({
          carlist: res.data,
          finish: true
        })
        break
        case "GoodsData":
        athis.setData({
          exclist: res.data,
          finish: true
        })
        break
        case "QueData":
        athis.setData({
          quelist: res.data,
          finish: true
        })
        break
      }
    },
    fail: err => {
      console.log(err)
      console.log(err.data)
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
    carIndex: 0,
    exclist: [],
    excIndex: 0,
    quelist: [],
    queIndex: 0,
    page: 1,
    result: '',
    avatarUrl: "",
    userInfo: ""
  },
  onPullDownRefresh: function(){
    this.onLoad()
  },
  onLoad: function(){
    getCarInfo(this)
    getExcInfo(this)
    getQueInfo(this)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  // add Button used to navigate to createData Page
  onCreateData:function(){
    wx.vibrateShort()
    wx.navigateTo({
      url: '../createData/createData',
    })
  },

  toRightPage: function(){
    wx.vibrateShort()
    if (this.data.page < 3){
      this.setData({
        page: this.data.page + 1
      })
    }else{
      this.setData({
        page: 1
      })
    }
  },
  toChangePage: function(e){
    wx.vibrateShort()
    var type = e["currentTarget"]["id"]
    switch(this.data.page){
      case 1:
        console.log("1")
        console.log(this.data.carlist.length)
        if (type == "toNext"){
          if (this.data.carlist.length == 20) {

            this.setData({
              carIndex: this.data.carIndex + 20,
              finish: false
            })
            getNextInfor(this, "CarDataCollect", this.data.carIndex)
          }
        }else if (type == "toPre"){
          if (this.data.carIndex != 0){
            this.setData({
              carIndex: this.data.carIndex - 20,
              finish: false
            })
            getNextInfor(this, "CarDataCollect", this.data.carIndex)
          }
        }
        break
      case 2:
        console.log("2")
        if (type == "toNext"){
          if (this.data.exclist.length == 20) {
            this.setData({
              excIndex: this.data.excIndex + 20,
              finish: false
            })
            getNextInfor(this, "GoodsData", this.data.excIndex)
          }
        }else if(type == "toPre"){
          if (this.data.excIndex != 0){
            this.setData({
              excIndex : this.data.excIndex - 20,
              finish: false
            })
            getNextInfor(this, "GoodsData", this.data.excIndex)
          }
        }
        break
      case 3:
        console.log("3")
        if (type == "toNext"){
          if (this.data.quelist.length == 20) {
            this.setData({
              queIndex: this.data.queIndex + 20,
              finish: false
            })
            getNextInfor(this, "QueData", this.data.queIndex)
          }
        }else if (type =="toPre"){
          if (this.data.queIndex != 0){
            this.setData({
              queIndex: this.data.queIndex - 20,
              finish: false
            })
            getNextInfor(this,"QueData",this.data.queIndex)
          }
        }
        break
    }
  }
})
