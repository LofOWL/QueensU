var loc = ["Kingston", "Toronto", "Montreal", "Waterloo", "Ottawa"]
var peoplenumberlist = [1,2,3,4,5,6,7,8,9,10,11,12]
var luggagelist = [0,1,2,3,4,5,6,7,8,9,10]


function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getConInfo(athis) {
  const db = wx.cloud.database()
  db.collection("UserContact").where({
    _openid: getApp().globalData.openid
  }).get({
    success: res => {
      athis.setData({
        contact: res.data[0].con
      })
    }
  })
}

function carDataToDatabase(data) {
  console.log("submit ")
  console.log(data.details)
  const db = wx.cloud.database()
  db.collection('CarData').add({
    data: {
      date: data.date,
      from: data.cfrom,
      to: data.cto,
      carType: data.carType,
      details: data.details,
      contact: data.contact,
      createDate: data.createDate,
      peoplenumber: data.peoplenumber,
      luggagenumber: data.luggagenumber
    },
    success: res => {
      wx.showToast({
        icon: "none",
        title: '上传成功'
      })
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '长传失败'
      })
    }
  })
}

function carDataCollection(athis) {
  var isExist = true;
  const db = wx.cloud.database()
  db.collection('CarDataCollect').where({
    date: athis.data.date,
    from: athis.data.cfrom,
    to: athis.data.cto,
    carType: athis.data.carType
  }).get({
    success: res => {
      isExist = res.data.length != 0;
      console.log(isExist)

      // update or create database
      if (isExist) {
        console.log(res.data[0].count + 1)
        console.log(athis.data.date)
        console.log(athis.data.cfrom)
        console.log(athis.data.cto)
        console.log(athis.data.carType)
        wx.cloud.callFunction({
          name: 'CarDataCollect',
          data: {
            date: athis.data.date,
            from: athis.data.cfrom,
            to: athis.data.cto,
            carType: athis.data.carType,
            count: res.data[0].count + 1
          },
          success: res => {
            console.log("cloud result")
            console.log(res)
            wx.navigateBack()
          },
          fail: err => {
            console.log("err")
            console.log(err)
            wx.navigateBack()
          }
        })
        console.log("finish the cloud function")
      } else {
        db.collection('CarDataCollect').add({
          data: {
            date: athis.data.date,
            from: athis.data.cfrom,
            to: athis.data.cto,
            carType: athis.data.carType,
            count: 1
          },
          success: res => {
            wx.navigateBack()
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
    carPage: 1,
    cfrom: "Kingston",
    cto: "Kingston",
    carType: "找车",
    nowDate: "2019-01-01",
    endDate: "",
    date: "",
    mulloc: [loc, loc],
    mulInex: [0, 0],
    peoplenumberlist: peoplenumberlist,
    peoplenumberIndex: 0,
    peoplenumber: 1,
    luggagelist: luggagelist,
    luggageIndex: 0,
    luggagenumber: 0,
    cheCheck: false,
    renCheck: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // change car type
    if (options.carType == "找车") {
      this.setData({
        cheCheck: true
      })
    } else {
      this.setData({
        renCheck: true
      })
    }

    getConInfo(this)

    var date = new Date()
    var year = date.getFullYear()
    var endyear = date.getFullYear() + 3
    var month = date.getMonth() + 1
    var day = date.getDate()
    this.setData({
      cfrom: options.from,
      cto: options.to,
      carType: options.carType,
      date: options.date,
      createDate: [year, month, day].map(formatNumber).join('-'),
      endDate: [endyear, month, day].map(formatNumber).join('-'),
    })
  },
  carselectDate: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  carselectLocation: function (e) {
    this.setData({
      mulIndex: e.detail.value,
      cfrom: loc[e.detail.value[0]],
      cto: loc[e.detail.value[1]]
    })
  },
  peroplenumberselect: function (e) {
    console.log(e.detail.value)
    this.setData({
      peoplenumberIndex: e.detail.value,
      peoplenumber: peoplenumberlist[e.detail.value]
    })
  },
  luggagenumberselect: function (e){
    this.setData({
      luggageIndex: e.detail.value,
      luggagenumber: luggagelist[e.detail.value]
    })
  },
  carselectType: function (e) {
    this.setData({
      carType: e.detail.value
    })
  },
  inputDetails: function (e) {
    this.setData({
      details: e.detail.value
    })
  },
  inputContact: function (e) {
    this.setData({
      contact: e.detail.value
    })
  },
  carSubmit: function () {
    carDataToDatabase(this.data)
    carDataCollection(this)

  }
})