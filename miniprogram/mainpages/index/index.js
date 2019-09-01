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
  db.collection(name).skip(index).limit(20).get({
    success: res =>{
      console.log("success")
      console.log(res.data)
      switch(name){
        case "CarData":
        console.log("car data")
        athis.setData({
          carlist: res.data,
        })
        break
        case "GoodsData":
        athis.setData({
          exclist: res.data,
        })
        break
        case "QueData":
        athis.setData({
          quelist: res.data
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
    result: ''
  },
  onPullDownRefresh: function(){
    this.onLoad()
  },
  onLoad: function(){
    getCarInfo(this)
    getExcInfo(this)
    getQueInfo(this)
  },
  // add Button used to navigate to createData Page
  onCreateData:function(){
    wx.navigateTo({
      url: '../createData/createData',
    })
  },

  toRightPage: function(){
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
    var type = e["currentTarget"]["id"]
    switch(this.data.page){
      case 1:
        console.log("1")
        console.log(this.data.carlist.length)
        if (type == "toNext"){
          if (this.data.carlist.length == 20) {
            this.setData({
              carIndex: this.data.carIndex + 20
            })
            getNextInfor(this, "CarData", this.data.carIndex)
          }
        }else if (type == "toPre"){
          if (this.data.carIndex != 0){
            this.setData({
              carIndex: this.data.carIndex - 20
            })
            getNextInfor(this, "CarData", this.data.carIndex)
          }
        }
        break
      case 2:
        console.log("2")
        if (type == "toNext"){
          if (this.data.exclist.length == 20) {
            this.setData({
              excIndex: this.data.excIndex + 20
            })
            getNextInfor(this, "GoodsData", this.data.excIndex)
          }
        }else if(type == "toPre"){
          if (this.data.excIndex != 0){
            this.setData({
              excIndex : this.data.excIndex - 20
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
              queIndex: this.data.queIndex + 20
            })
            getNextInfor(this, "QueData", this.data.queIndex)
          }
        }else if (type =="toPre"){
          if (this.data.queIndex != 0){
            this.setData({
              queIndex: this.data.queIndex - 20
            })
            getNextInfor(this,"QueData",this.data.queIndex)
          }
        }
        break
    }
  }
})
