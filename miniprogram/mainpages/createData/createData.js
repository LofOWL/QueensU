var loc = ["Kingston","Toronto","Montreal","Waterloo","Ottawa"]

function formatNumber(n){
  n = n.toString()
  return n[1] ? n : '0' + n
}

function carDataToDatabase(data){
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
      createDate: data.createDate
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

function carDataCollection(athis){
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
          success: res =>{
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
          success: res =>{
            wx.navigateBack()
          }
        })
      }
    }
  })
}

function goodsDataCollection(athis, goods, length, index){
  var isExist = true;

  var alist = goods.split(" ")
  const db = wx.cloud.database()
  db.collection('GoodsDataCollect').where({
    goods: alist[0],
    excType: alist[3],
  }).get({
    success: res => {
      isExist = res.data.length != 0;
      console.log(isExist)

      // update or create database
      if (isExist) {
        console.log("in goods")
        console.log(goods)
        console.log(athis.data.excType)
        console.log(res.data[0].count + 1)
        wx.cloud.callFunction({
          name: 'GoodsDataCollect',
          data: {
            goods: alist[0],
            excType: alist[3],
            count: res.data[0].count + 1
          },
          success: res => {
            console.log("cloud result")
            console.log(res)
            if (length-1 == index){
              wx.navigateBack()
            }
          },
          fail: err => {
            console.log("err")
            console.log(err)
            if (lenght-1 == index){
              wx.navigateBack()
            }
          }
        })
        console.log("finish the cloud function")
      } else {
        db.collection('GoodsDataCollect').add({
          data: {
            goods: alist[0],
            excType: alist[3],
            count: 1
          },
          success: res =>{
            if (length-1 == index){
              wx.navigateBack()
            }
          }
        })
      }
    }
  })
}

function excDataToDatabase(data, goods){
  var alist = goods.split(" ")
  console.log(alist)
  console.log(alist[0])
  console.log(alist[1])
  console.log(alist[2])
  console.log(alist[3])
  const db = wx.cloud.database()
  db.collection('GoodsData').add({
    data: {
      goods: alist[0],
      prices: alist[1],
      gooddetails: alist[2],
      excType: alist[3],
      details: data.details,
      contact: data.contact,
      createDate: data.createDate
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

function queDataToDatabase(data){
  const db = wx.cloud.database()
  db.collection('QueData').add({
    data: {
      question: data.question,
    },
    success: res => {
      wx.showToast({
        icon: "none",
        title: '上传成功'
      })
      wx.navigateBack()
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '长传失败'
      })
      wx.navigateBack()
    }
  })
}

function getConInfo(athis){
  const db = wx.cloud.database()
  db.collection("UserContact").where({
    _openid: getApp().globalData.openid
  }).get({
    success: res =>{
      athis.setData({
        contact: res.data[0].con
      })
    }
  })
}

Page({
  data:{
    type: 0,
    // car data
    carPage: 1,
    cfrom: "Kingston",
    cto: "Kingston",
    carType: "找车",
    nowDate: "2019-01-01",
    endDate: "",
    date: "",
    mulloc: [loc,loc],
    mulInex: [0,0],
    cheCheck: false,
    renCheck: false,
    // exc data
    excPage: 1,
    goods: "",
    prices: "",
    goodsDetails: "",
    itemListText: "",
    itemList: [],
    itemcount: 0,
    excType: "出售",
    chuCheck: false,
    xunCheck: false,
    // que data
    question: "",
    quePage: 1,
    // details
    details: "",
    contact: "",
    createDate: "",
  },
  onLoad: function(options){
      console.log(options.goods)
      console.log(options.excType)
      // change car type
      if (options.carType == "找车"){
        this.setData({
          cheCheck: true
        })
      }else{
        this.setData({
          renCheck: true
        })
      }

      //change good type
      if (options.excType == "出售"){
        this.setData({
          chuCheck: true
        })
      }else{
        this.setData({
          xunCheck: true
        })
      }

      getConInfo(this)

      this.setData({
        type : options.type
      })
      var date = new Date()
      var year = date.getFullYear()
      var endyear = date.getFullYear() + 3
      var month = date.getMonth() + 1
      var day = date.getDate()
      this.setData({
        goods: options.goods,
        excType: options.excType,
        cfrom: options.from,
        cto: options.to,
        carType: options.carType,
        date: options.date,
        createDate: [year,month,day].map(formatNumber).join('-'),
        endDate: [endyear,month,day].map(formatNumber).join('-'),
      })

  },
  // car function
  carselectDate: function(e){
      this.setData({
        date: e.detail.value
      })
  },
  carselectLocation: function(e){
      this.setData({
        mulIndex: e.detail.value,
        cfrom: loc[e.detail.value[0]],
        cto: loc[e.detail.value[1]]
      })
  },
  carselectType: function(e){
      this.setData({
        carType : e.detail.value
      })
  },
  carData: function(){
    this.setData({
      type: 1
    })
  },
  carNext: function(){
    this.setData({
      carPage: this.data.carPage + 1
    })
  },
  // exc function
  excaddItem: function(){
    if(this.data.goods.length != 0){
      console.log(this.data.goods)
      console.log(this.data.prices)
      console.log(this.data.goodsDetails)
      console.log(this.data.excType)
      var input = this.data.goods + " " + this.data.prices + " " + this.data.goodsDetails + " " + this.data.excType
      console.log(input)
      this.data.itemList.push(input)
      this.setData({
        itemcount: this.data.itemcount + 1,
        itemListText: this.data.itemList.join("\n") + "\n",
        goods: "",
        prices: "",
        goodsDetails: ""
      })
    }
  },
  excremoveItem: function(){
    if (this.data.itemList.length > 0){
      this.data.itemList.pop()
      this.setData({
        itemcount: this.data.itemcount - 1,
        itemListText: this.data.itemList.join("\n") + "\n",
        goods: ""
      })
    }
  },
  excselectType: function(e){
      this.setData({
        excType: e.detail.value
      })
  },
  excData: function(){
    this.setData({
      type: 2
    })
  },
  excNext: function(){
    this.setData({
      excPage: this.data.excPage + 1
    })
  },
  inputGoods: function(e){
    console.log(e.detail.value)
      this.setData({
        goods: e.detail.value
      })
  },
  inputPrices: function(e){
      console.log(e.detail.value)
      this.setData({
        prices: e.detail.value
      })
  },
  inputGoodsDetails: function(e){
    console.log(e.detail.value)
     this.setData({
       goodsDetails: e.detail.value
     })
  },
  // que function
  inputQuestion: function(e){
    this.setData({
      question: e.detail.value
    })
  },
  queData: function(){
    this.setData({
      type: 3
    })
  },
  queNext: function(){
    this.setData({
      quePage: this.data.quePage + 1
    })
  },
  // general deatils
  inputDetails: function(e){
      this.setData({
        details: e.detail.value
      })
  },
  inputContact: function(e){
    this.setData({
      contact: e.detail.value
    })
  },
  // submit
  carSubmit: function () {
    carDataToDatabase(this.data)
    carDataCollection(this)
  
  },
  excSubmit: function() {
    if (this.data.itemList.length != 0){
      var unique = [...new Set(this.data.itemList)];
      console.log(unique.length)
      for (var i in unique) {
        console.log(i)
        excDataToDatabase(this.data, unique[i])
        goodsDataCollection(this, unique[i], unique.length,i)
      }
    }else{
      wx.showToast({
        icon: 'none',
        title: '物品不可为空'
      })
    }
  },
  queSubmit: function(){
    queDataToDatabase(this.data)
  }
})

