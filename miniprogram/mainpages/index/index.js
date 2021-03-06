// mainpages/index/index.js
const app = getApp()

var loc = ["Kingston", "Toronto", "Montreal", "Waterloo", "Ottawa"]

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function userConDatabase(athis) {
  const db = wx.cloud.database()
  db.collection("UserContact").where({
    _openid: app.globalData.openid
  }).get({
    success: res => {
      if (res.data.length == 0) {
        db.collection("UserContact").add({
          data: {
            con: athis.data.userCon
          },
          success: res => {
            wx.showToast({
              title: '创建成功',
            })
          }
        })
      } else {
        console.log(athis.data.userConid)
        console.log(athis.data.userCon)
        db.collection("UserContact").doc(athis.data.userConid).update({
          data: {
            con: athis.data.userCon
          },
          success: res => {
            console.log(res)
            wx.showToast({
              title: '更新成功',
            })
          }
        })
      }
    }
  })
}

function getWeChat(athis){
  console.log("get in get wechat")
  const db = wx.cloud.database()
  db.collection("UserContact").where({
    _openid: app.globalData.openid
  }).get({
    success: res => {
      console.log("^^^^^^^^^")
      console.log(res)
      athis.setData({
        userConid: res.data[0]._id,
        userCon: res.data[0].con
      })
    }
  })
}

function getToday(){
  var date = new Date()
  var year = date.getFullYear()
  var endyear = date.getFullYear() + 3
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function getActInfo(athis) {
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('ActData').orderBy("date", "acs").get({
    success: res => {
      console.log(res.data)
      athis.setData({
        actlist: res.data
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

function getGoodSearch(athis,agoods,aexcType){
  
  const db = wx.cloud.database()
  const _ = db.command
  // athis.data.goods
  db.collection('GoodsDataCollect').where({
    goods: db.RegExp({
        regexp: agoods,
        options: 'i'
    }),
    excType: aexcType,
    count: _.gt(0)
  }).orderBy("count", "desc").orderBy("date", "acs").get({
    success: res => {
      athis.setData({
        finding: true,
        exclist: res.data,
        result: JSON.stringify(res.data, null, 2)
      })
      wx.showToast({
        icon: 'none',
        title: '下拉刷新返回'
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

function getCarSearch(athis,carType,cfrom,cto,date){
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('CarDataCollect').where({
    carType: carType,
    from: cfrom,
    to: cto,
    date: date,
    count: _.gt(0)
  }).orderBy("count", "desc").orderBy("date", "acs").get({
    success: res => {
      athis.setData({
        finding: true,
        carlist: res.data,
        result: JSON.stringify(res.data, null, 2)
      })
      wx.showToast({
        icon: 'none',
        title: '下拉刷新返回'
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

function getQueSearch(athis){
  console.log("get into que")
  console.log(athis.data.question)
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('QueData').where({
    question: _.in([athis.data.question])
  }).orderBy("count", "desc").orderBy("date", "acs").get({
    success: res => {
      athis.setData({
        finding: true,
        quelist: res.data,
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
  console.log("get into getqueinfo")
  console.log(athis.data.quelist.length)
  const db = wx.cloud.database()
  db.collection('QueData').orderBy("total", "desc").get({
    success: res => {
      console.log("get into success")
      console.log(res.data.length)
      athis.setData({
        quelist: res.data,
        finish: true
      })
      wx.stopPullDownRefresh()
    },
    fail: err => {
      console.log("get into fail")
      athis.setData({
        finish: true
      })
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      wx.stopPullDownRefresh()
    }
  })
}

function getCallInfo(athis) {
  console.log("get into getCallInfo")
  console.log(athis.data.quelist.length)
  const db = wx.cloud.database()
  db.collection('CallData').orderBy("total", "desc").get({
    success: res => {
      console.log("get into call")
      console.log(res.data)
      athis.setData({
        calllist: res.data,
      })
      wx.stopPullDownRefresh()
    },
    fail: err => {
      console.log("get into fail")
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      wx.stopPullDownRefresh()
    }
  })
}

function queDataToDatabase(athis) {
  const db = wx.cloud.database()
  db.collection('QueData').add({
    data: {
      question: athis.data.question,
      up: 0,
      down: 0,
      total: 0
    },
    success: res => {
      athis.setData({
        queUpdate: true
      })
      wx.showToast({
        icon: "none",
        title: '上传成功'
      })
      athis.onLoad()
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '长传失败'
      })
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


function getStatic(athis){
  const db = wx.cloud.database()
  db.collection('CarData').where({
    _openid: app.globalData.openid
  }).count({
    success: function (res) {
      athis.setData({
        carCount: res.total
      })
    }
  })

  db.collection('GoodsData').where({
    _openid: app.globalData.openid
  }).count({
    success: function (res) {
      athis.setData({
        excCount: res.total
      })
    }
  })

  db.collection('QueData').where({
    _openid: app.globalData.openid
  }).count({
    success: function (res) {
      athis.setData({
        queCount: res.total
      })
    }
  })
}

function getUpdateInfo(athis){
  const db = wx.cloud.database()
  db.collection("UserInfoUpdate").where({
    _openid: app.globalData.openid
  }).get({
    success: res=>{
      console.log("update info")
      console.log(res.data[0].updateList)
      var result = []
      var string = ""
      compare(athis,res.data[0].updateList,0,result,string)
    }
  })
}

function compare(athis,list,index,result,string){
  const db = wx.cloud.database()
  db.collection("chatroom").where({
    groupId: list[index].groupId
  }).count({
    success: res =>{
      var noUpdate = res.total == list[index].count
      if (list.length-1 == index){
        console.log("done")
        if (!noUpdate){
          result.push(list[index].groupId)
          string = string + list[index].groupId 
        }
        athis.setData({
          updateList: result,
          updateString: string,
          updateCount: result.length,
          getUpdateinfo: false
        })
        console.log("finish update")
        console.log(athis.data.updateList)
        console.log(string)
        console.log(result)
      }else{
        if (noUpdate) {
          index++
          compare(athis,list, index, result,string)
        } else {
          result.push(list[index].groupId)
          string = string + list[index].groupId + "@"
          index ++
          compare(athis,list, index, result,string)
        }
      }
      
    }
  })
}


Page({
  onCompClick(e) {
    switch(e.detail.type){
      case "queSearch":
        this.setData({
          finish: false
        })
        getQueInfo(this)
        break
      case "excSearch":
        this.setData({
          finding: false
        })
        getGoodSearch(this,e.detail.goods,e.detail.excType)
        break
      case "carSearch":
        console.log(e.detail)
        this.setData({
          finding: false
        })
        getCarSearch(this,e.detail.carType,e.detail.from,e.detail.to,e.detail.date)
        break

    }
  },
  data: {
    topNavi: ["拼车","二手","吐槽","打call","活动"],
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
    goods: "",
    excType: "出售",
    // que data
    quelist: [],
    queIndex: 0,
    showModalStatus: false,
    queId: "",
    queUp: 0,
    queDown: 0,
    queTotal: 0,
    queUpdate:true,
    // others
    question: "",
    page: 1,
    result: '',
    avatarUrl: "",
    userInfo: "",
    // call page
    calllist: [],
    // act page
    actlist: [],
    showLog: false,
    // static
    carCount: -1,
    excCount: -1,
    queCount: -1,
    updateCount: 0,
    updateList: [],
    updateString: "",
    getUpdateinfo: true,
    // wechat
    userConid: "",
    userCon: "",
    //login
    showLogin: false

  },
  onPullDownRefresh: function(){
    this.setData({
      carCount: -1,
      excCount: -1,
      queCount: -1,
      getUpdateinfo: true
    })
    this.onLoad()
  },
  onShow: function(){
    this.onLoad()
  },
  onLoad: function(){
    wx.showShareMenu()
    this.setData({
      finish: false
    })
    //get openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        getWeChat(this)
        getStatic(this)
        getUpdateInfo(this)
        getActInfo(this)
        getCarInfo(this)
        getCarTime(this)
        getCallInfo(this)
        getExcInfo(this)
        getQueInfo(this)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log("%%%%%%%%%%%")
              console.log(res)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }else{
          this.setData({
            showLog: true
          })
        }
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
  // que enter 
  inputQuestion: function (e){
    console.log(e.detail.value)
    this.setData({
      question: e.detail.value
    })
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
    }else if (e.currentTarget.dataset.type == 3){
      getQueSearch(this)
    }
  },
  onAdd: function(){
    wx.navigateTo({
      url: '../createData/createData?date={{this.data.date}}&cfrom={{this.data.cfrom}}&cto={{this.data.cto}}&carType={{this.data.carType}}&type={{1}}',
    })
  },
  onGetUserInfo: function (e) {
    console.log("get into")
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        showLog: false,
        logged: true,
        showLogin: false,
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
      case "吐槽":
        this.setData({
          page: 3
        })
        break
      case "打call":
        this.setData({
          page: 4
        })
      break
      case "活动":
        this.setData({
          page: 5
        })
        break
    }

  },
  editInformation: function(e){
    console.log(e.currentTarget.dataset.id)
    switch(e.currentTarget.dataset.type){
      case "start":
        this.setData({
          queUp: e.currentTarget.dataset.up,
          queDown: e.currentTarget.dataset.down,
          queTotal: e.currentTarget.dataset.total,
          queId: e.currentTarget.dataset.id,
          showModalStatus: true
        })
        break
      case "close":
        this.setData({
          queId: "",
          showModalStatus: false
        })
        break
    }
  },
  // change information
  queEdit: function(e){
    this.setData({
      queUpdate: false
    })
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('QueData').where({
      _id: this.data.queId
    }).get({
      success: res => {
        var down = res.data[0]["down"]
        var up = res.data[0]["up"]
        var total = res.data[0]["total"]
        switch (e.currentTarget.dataset.type) {
          case "up":
            console.log(this.data.queUp)
            console.log(this.data.queUp - this.data.queDown)
            wx.cloud.callFunction({
              name: 'editQuestion',
              data: {
                id: this.data.queId,
                up: up + 1,
                total: up + 1 - down
              },
              success: res => {
                console.log("cloud result")
                console.log(res)
                this.setData({
                  showModalStatus: false,
                  queUpdate: true
                })
                wx.showToast({
                  icon: 'none',
                  title: '上传成功'
                })
              },
              fail: err => {
                console.log("err")
                console.log(err)
                this.setData({
                  showModalStatus: false,
                  queUpdate: true
                })
              }
            })
            break
          case "down":
            wx.cloud.callFunction({
              name: 'editQuestion',
              data: {
                id: this.data.queId,
                down: down + 1,
                total: up - down - 1
              },
              success: res => {
                console.log("cloud result")
                console.log(res)
                this.setData({
                  showModalStatus: false,
                  queUpdate: true
                })
                wx.showToast({
                  icon: 'none',
                  title: '上传成功'
                })
              },
              fail: err => {
                console.log("err")
                console.log(err)
                this.setData({
                  showModalStatus: false,
                  queUpdate: true
                })
              }
            })
            
            break
        }
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
  onRemove: function(e){
    console.log(e.currentTarget.dataset.id)
    wx.cloud.callFunction({
      name: 'editQuestion',
      data: {
        id: e.currentTarget.dataset.id,
        question:"change "
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
          } else {
            wx.showToast({
              icon: 'none',
              title: '已经是最后页'
            })
          }
        }else if (type == "toPre"){
          if (this.data.carIndex != 0){
            this.setData({
              carIndex: this.data.carIndex - 20,
              finish: false
            })
            getNextInfor(this, "CarDataCollect", this.data.carIndex)
          } else {
            wx.showToast({
              icon: 'none',
              title: '已经是第一页'
            })
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
          } else {
            wx.showToast({
              icon: 'none',
              title: '已经是最后页'
            })
          }
        }else if(type == "toPre"){
          if (this.data.excIndex != 0){
            this.setData({
              excIndex : this.data.excIndex - 20,
              finish: false
            })
            getNextInfor(this, "GoodsData", this.data.excIndex)
          } else {
            wx.showToast({
              icon: 'none',
              title: '已经是第一页'
            })
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
          }else{
            wx.showToast({
              icon: 'none',
              title: '已经是最后页'
            })
          }
        }else if (type =="toPre"){
          if (this.data.queIndex != 0){
            this.setData({
              queIndex: this.data.queIndex - 20,
              finish: false
            })
            getNextInfor(this,"QueData",this.data.queIndex)
          }else{
            wx.showToast({
              icon: 'none',
              title: '已经是第一页'
            })
          }
        }
        break
    }
  },
  queSubmit: function () {
    this.setData({
      queUpdate: false
    })
    queDataToDatabase(this)
  },
  // wechat 
  loginIn: function(e){
    var check = e.currentTarget.dataset.statu;
    console.log(check)
    if (check == "loginstart"){
      this.setData({
        showLogin: true
      })
    } else if (check == "loginclose"){
      this.setData({
        showLogin: false
      })
    } else{
      this.setData({
        showLogin: false
      })
    }
  },
  editUserInformation: function (e) {
    var check = e.currentTarget.dataset.statu;
    console.log(check)
    if (check == "start") {
      this.setData({
        showModalStatus: true
      })
    } else if (check == "close") {
      this.setData({
        showModalStatus: false
      })
    } else {
      userConDatabase(this)
      this.setData({
        showModalStatus: false
      })
    }
  },
  changeCon: function (e) {
    this.setData({
      userCon: e.detail.value
    })
  },
  
})
