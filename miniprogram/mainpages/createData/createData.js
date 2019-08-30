var loc = ["Kingston","Toronto","Montreal","Waterloo","Ottawa"]

function formatNumber(n){
  n = n.toString()
  return n[1] ? n : '0' + n
}

function carDataToDatabase(data){
  const db = wx.cloud.database()
  db.collection('CarData').add({
    data: {
      date: data.date,
      from: data.cfrom,
      to: data.cto,
      carType: data.carType
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

function excDataToDatabase(data, goods){
  const db = wx.cloud.database()
  db.collection('GoodsData').add({
    data: {
      goods: goods,
      excType: data.excType
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
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '长传失败'
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
    nowDate: "",
    endDate: "",
    date: "",
    mulloc: [loc,loc],
    mulInex: [0,0],
    // exc data
    excPage: 1,
    goods: "",
    itemListText: "",
    itemList: [],
    excType: "出售",
    // que data
    question: "",
    quePage: 1
    
  },
  onLoad: function(){
      var date = new Date()
      var year = date.getFullYear()
      var endyear = date.getFullYear() + 3
      var month = date.getMonth() + 1
      var day = date.getDate()
      this.setData({
        nowDate : [year,month,day].map(formatNumber).join('-'),
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
      this.data.itemList.push(this.data.goods)
      this.setData({
        itemListText: this.data.itemList.join("\n") + "\n",
        goods: ""
      })
    }
  },
  excremoveItem: function(){
    if (this.data.itemList.length > 0){
      this.data.itemList.pop()
      this.setData({
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
      this.setData({
        goods: e.detail.value
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
  // submit
  carSubmit: function () {
    carDataToDatabase(this.data)
    wx.navigateBack()
  },
  excSubmit: function() {
    var unique = [...new Set(this.data.itemList)];
    for (var i in unique) {
      excDataToDatabase(this.data, unique[i])
    }
    wx.navigateBack()
  },
  queSubmit: function(){
    queDataToDatabase(this.data)
    wx.navigateBack()
  }
})

