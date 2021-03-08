// pages/account/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:''
  },

  pweContor () {
    wx.navigateTo({
      url: '/pages/setPwd/setPwd',
    })
  },
  onShow() {
    this.getData()
  },
  getData() {
    wx.$get({
      url: '/driver/my/info',
      data: {},
    }).then(res => {
      //console.log(res)
      this.setData({
        userInfo:res.data
      })
    })
  },
  loginOut(){
    wx.setStorageSync('memberInfo', '')
    wx.setStorageSync('api_token', '')
    wx.setStorageSync('type', '')
    wx.redirectTo({
      url: '/pages/login/login',
    })
  }
})