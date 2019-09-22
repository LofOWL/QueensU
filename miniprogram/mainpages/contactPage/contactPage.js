const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: null,
    logged: false,
    imageload: true,
    takeSession: false,
    requestResult: '',
    // chatRoomEnvId: 'release-f8415a',
    chatRoomCollection: 'chatroom',
    chatRoomGroupId: '',
    chatRoomGroupName: '聊天室',

    //user information
    prices: "",
    details: "",
    contact: "",

    //goods information
    imageList: [],

    // functions for used in chatroom components
    onGetUserInfo: null,
    getOpenID: null,
  },

  onLoad: function (options) {
    console.log(options.id)
    console.log(options.prices)
    console.log(options.details)
    console.log(options.contact)
    console.log(options.imageList)
    if (options.imageList != 0){
      this.setData({
        imageload: false
      })
    }
    var imageList = options.imageList.split(",")
    console.log(imageList)
    this.setData({
      chatRoomGroupId: options.id,
      prices: options.prices,
      details: options.details,
      contact: options.contact,
      types: options.types,
      imageList: imageList
    })
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

    this.setData({
      onGetUserInfo: this.onGetUserInfo,
      getOpenID: this.getOpenID,
    })

    wx.getSystemInfo({
      success: res => {
        console.log('system info', res)
        if (res.safeArea) {
          const { top, bottom } = res.safeArea
          this.setData({
            containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
          })
        }
      },
    })
  },

  getOpenID: async function () {
    if (this.openid) {
      return this.openid
    }

    const { result } = await wx.cloud.callFunction({
      name: 'login',
    })

    return result.openid
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

  onShareAppMessage() {
    return {
      title: '即时通信 Demo',
      path: '/pages/im/room/room',
    }
  },

  imageLoad: function(e){
    console.log(e)
    this.setData({
      imageload: true
    })
  },
  onViewImage: function(e){
    var current = e.target.dataset.src;
    this.setData({
      imageload: false
    })
    console.log(current)
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })

    this.setData({
      imageload: true
    })

  }
})
