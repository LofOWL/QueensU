// miniprogram/mainpages/createData/excPage/excPage.js
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function excDataToDatabase(data) {
  const db = wx.cloud.database()
  db.collection('GoodsData').add({
    data: {
      goods: data.goods,
      prices: data.prices,
      gooddetails: data.goodsDetails,
      excType: data.excType,
      details: data.details,
      contact: data.contact,
      createDate: data.createDate,
      imageList: data.fileIdarray,
      imageCount: data.fileIdarray.length
    },
    success: res => {
      console.log("get into excData")
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

function goodsDataCollection(athis) {
  var isExist = true;

  const db = wx.cloud.database()
  db.collection('GoodsDataCollect').where({
    goods: athis.data.goods,
    excType: athis.data.excType,
  }).get({
    success: res => {
      isExist = res.data.length != 0;
      console.log(isExist)

      // update or create database
      if (isExist) {
        console.log("in goods")
        console.log(athis.data.excType)
        console.log(res.data[0].count + 1)
        wx.cloud.callFunction({
          name: 'GoodsDataCollect',
          data: {
            goods: athis.data.goods,
            excType: athis.data.excType,
            count: res.data[0].count + 1
          },
          success: res => {
            console.log("cloud result")
            console.log(res)
            athis.setData({
              upload: true
            })
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
        db.collection('GoodsDataCollect').add({
          data: {
            goods: athis.data.goods,
            excType: athis.data.excType,
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

function uploadFiles(alist,length,index,athis){
  var filePath = alist[index].path
  var name = `${Math.random()}_${Date.now()}_${alist[index].size}`
  console.log("get in uploadFiles")
  wx.cloud.uploadFile({
    cloudPath: `excPictures/${name}.png`,
    filePath: filePath,
    success: res => {
      console.log(name)
      console.log("succes upload")
      athis.data.fileIdarray.push(res.fileID)
      if (length-1 == index){
        console.log(athis.data.fileIdarray)
        excDataToDatabase(athis.data)
        goodsDataCollection(athis)
      }
    },
    fail: e => {
      console.log(name)
      console.log("fail upload")
      this.showError('发送图片失败', e)
    },
    complete: e =>{
      index ++;
      uploadFiles(alist,length,index,athis)
    }
  })
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

Page({
  data: {
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
    details: "",
    contact: "",
    createDate: "",
    imageList: [],
    fileIdarray: [],
    upload: true
  },

  onLoad: function (options) {
    //change good type
    if (options.excType == "出售") {
      this.setData({
        chuCheck: true
      })
    } else {
      this.setData({
        xunCheck: true
      })
    }
    getConInfo(this)
    var date = new Date()
    var year = date.getFullYear()
    var endyear = date.getFullYear() + 3
    var month = date.getMonth() + 1
    var day = date.getDate()
    this.setData({
      goods: options.goods,
      excType: options.excType,
      createDate: [year, month, day].map(formatNumber).join('-')
    })
  },
  excselectType: function (e) {
    this.setData({
      excType: e.detail.value
    })
  },
  inputGoods: function (e) {
    console.log(e.detail.value)
    this.setData({
      goods: e.detail.value
    })
  },
  inputPrices: function (e) {
    console.log(e.detail.value)
    this.setData({
      prices: e.detail.value
    })
  },
  inputGoodsDetails: function (e) {
    console.log(e.detail.value)
    this.setData({
      goodsDetails: e.detail.value
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
  excSubmit: function () {
    this.setData({
      upload: false
    })
    if (this.data.imageList != 0 ){
      uploadFiles(this.data.imageList, this.data.imageList.length, 0, this)
    }else{
      excDataToDatabase(this.data)
      goodsDataCollection(this)
    }


  },
  chooseImages: function (){
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async res =>{
        console.log(res)
        console.log(res.tempFiles)
        this.setData({
          imageList: res.tempFiles
        })
      }
    })
  }
})
