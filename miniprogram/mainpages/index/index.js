// mainpages/index/index.js
const app = getApp()

var loc = ["Kingston", "Toronto", "Montreal", "Waterloo", "Ottawa"]

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getToday(){
  var date = new Date()
  var year = date.getFullYear()
  var endyear = date.getFullYear() + 3
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function getGoodSearch(athis){
  console.log("get into goods")
  console.log(athis.data.goods)
  console.log(athis.data.excType)
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('GoodsDataCollect').where({
    goods: athis.data.goods,
    excType: athis.data.excType,
    count: _.gt(0)
  }).orderBy("count", "desc").orderBy("date", "acs").get({
    success: res => {
      athis.setData({
        finding: true,
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

function getCarSearch(athis){
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('CarDataCollect').where({
    carType: athis.data.carType,
    from: athis.data.cfrom,
    to: athis.data.cto,
    date: athis.data.date,
    count: _.gt(0)
  }).orderBy("count", "desc").orderBy("date", "acs").get({
    success: res => {
      athis.setData({
        finding: true,
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

function getCarInfo(athis){
  const db = wx.cloud.database()
  const _ = db.command
  var today = getToday()
  db.collection('CarDataCollect').where({
    count: _.gt(0),
    date: _.gte(today)
  }).orderBy("count", "desc").orderBy("date", "acs").get({
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

function getCarTime(athis){
  var date = new Date()
  var year = date.getFullYear()
  var endyear = date.getFullYear() + 3
  var month = date.getMonth() + 1
  var day = date.getDate()
  console.log("get into getCarTime")
  console.log([year,month,day].map(formatNumber).join('-'))
  athis.setData({
    date: [year, month, day].map(formatNumber).join('-'),
    createDate: [year, month, day].map(formatNumber).join('-'),
    endDate: [endyear, month, day].map(formatNumber).join('-'),
  })
}

function getExcInfo(athis){
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('GoodsDataCollect').where({
    count: _.gt(0)
  }).orderBy("count", "desc").get({
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
    topNavi: ["拼车","二手","讨论","??","??"],
    finish: false,
    personal: true,
    //car data
    carlist: [],
    carIndex: 0,
    nowDate: "2019-01-01",
    endDate: "",
    date: "",
    mulloc: [loc, loc],
    mulInex: [0, 0],
    cfrom: "Kingston",
    cto: "Kingston",
    carType: "找车",
    finding: true,
    //good data
    exclist: [],
    excIndex: 0,
    quelist: [],
    queIndex: 0,
    goods: "",
    excType: "出售",
    // others
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
    getCarTime(this)
    getExcInfo(this)
    getQueInfo(this)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    //get openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    
  },
  // search for the car date
  carselectDate: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // search for the car location
  carselectLocation: function (e) {
    this.setData({
      mulIndex: e.detail.value,
      cfrom: loc[e.detail.value[0]],
      cto: loc[e.detail.value[1]]
    })
  },
  // car select type
  carselectType: function (e) {
    this.setData({
      carType: e.detail.value
    })
  },
  // enter goods
  inputGoods: function(e){
    console.log(e.detail.value)
    this.setData({
      goods: e.detail.value
    })
  },
  // good select type
  excselectType: function (e){
    console.log(e.detail.value)
    this.setData({
      excType: e.detail.value
    })
    console.log(this.data.excType)
  },
  // find the car
  onFind: function(e){
    this.setData({
      finding: false
    })
    if (e.currentTarget.dataset.type == 1){
      getCarSearch(this)
    }else if (e.currentTarget.dataset.type == 2){
      getGoodSearch(this)
    }
  },
  onAdd: function(){
    wx.navigateTo({
      url: '../createData/createData?date={{this.data.date}}&cfrom={{this.data.cfrom}}&cto={{this.data.cto}}&carType={{this.data.carType}}&type={{1}}',
    })
  },
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onGetOpenid: function () {
    // 调用云函数
    this.setData({
      personal: false
    })
    if (app.globalData.openid){
      console.log("in")
      wx.navigateTo({
        url: '../PersonalPage/PersonalPage',
      })
      this.setData({
        personal: true
      })
    }else{
      console.log("not in")
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
          wx.navigateTo({
            url: '../PersonalPage/PersonalPage',
          })
          this.setData({
            personal: true
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }

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
  //top buttom
  topOntap: function (e) {
    console.log(e.currentTarget.dataset.item)
    switch(e.currentTarget.dataset.item){
      case "拼车":
        this.setData({
          page: 1
        })
        break
      case "二手":
        this.setData({
          page: 2
        })
        break
      case "讨论":
        this.setData({
          page: 3
        })
        break
    }

  },
  onRemove: function(e){
    console.log(e.currentTarget.dataset.id)
    const db = wx.cloud.database()
    db.collection("QueData").doc(e.currentTarget.dataset.id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
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
