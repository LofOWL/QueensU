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

  db.collection('QueData').where({
    _openid: app.globalData.openid
  }).get({
    success: res => {
    
      athis.setData({
        peronsalqueList: res.data
      })
      console.log("get into QueData")
      console.log(res.data)
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

  db.collection("UserContact").where({
    _openid: app.globalData.openid
  }).get({
    success: res => {
      athis.setData({
        userConid: res.data[0]._id,
        userCon: res.data[0].con
      })
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

function goodsDataCollection(goods,excType) {
  var isExist = true;
  const db = wx.cloud.database()
  db.collection('GoodsDataCollect').where({
    goods: goods,
    excType: excType,
  }).get({
    success: res => {
      isExist = res.data.length != 0;
      console.log(isExist)

      // update or create database
      if (isExist) {
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

function userConDatabase(athis){
  const db = wx.cloud.database()
  db.collection("UserContact").where({
    _openid: app.globalData.openid
  }).get({
    success: res =>{
      if (res.data.length == 0){
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
      }else{
        db.collection("UserContact").doc(athis.data.userConid).update({
          data: {
            con: athis.data.userCon
          },
          success: res => {
            wx.showToast({
              title: '更新成功',
            })
          }
        })
      }
    }
  })
}


Page({

  data: {
    personalcarList: [],
    personalexcList: [],
    peronsalqueList: [],
    showModalStatus: false,
    userCon: "",
    userConid: "",
    openid: ""
  },
  onPullDownRefresh: function(){
    this.onLoad()
  },
  onLoad: function(){
    console.log(app.globalData.openid);
    this.setData({
      openid: app.globalData.openid
    })
    getAll(this)
  },
  editUserInformation: function(e){
    var check = e.currentTarget.dataset.statu;
    console.log(check)
    if (check == "start"){
      this.setData({
        showModalStatus: true
      })
    }else if(check == "close"){
      this.setData({
        showModalStatus: false
      })
    }else{
      userConDatabase(this)
      this.setData({
        showModalStatus: false
      })
    }
  },
  changeCon: function(e){
      this.setData({
        userCon: e.detail.value
      })
  },
  onRemove: function(e){
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.name)
    console.log(this.data.openid)
    var name = e.currentTarget.dataset.name

    var date = e.currentTarget.dataset.date
    var from = e.currentTarget.dataset.from
    var to = e.currentTarget.dataset.to
    var carType = e.currentTarget.dataset.carType
    
    var excType = e.currentTarget.dataset.excType
    var goods = e.currentTarget.dataset.goods

    const db = wx.cloud.database()
    db.collection(e.currentTarget.dataset.name).doc(e.currentTarget.dataset.id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        // date from to carType
        if (name == "CarData"){
          carDataCollection(date, from, to, carType)
        }else if (name == "GoodsData"){
          goodsDataCollection(goods, carType)
        }
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
