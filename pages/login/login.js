// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    password:''
  },

  onLoad: function (options) {

  },

  loginOrRegister(e) {
    console.log(e)
    const data = e.detail.value
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  register() {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  getPhone(e) {
    this.setData({
      account: e.detail.value
    })
  },
  getPasssword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 重置密码
  forgetPassword() {
    wx.navigateTo({
      url: '/pages/setPwd/setPwd',
    })
  },
  login(e) {
    const formData = e.detail.value
    // if(!/^1\d{10}$/.test(formData.phone)) {
    //   wx.$alert('请输正确的入登录账号！')
    //   return
    // }
    // if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(formData.password)) {
    //   wx.$alert('请输正确的登录密码！')
    //   return
    // }
    wx.$post({
      url: '/driver/login/login',
      data: {
        // 15136655111 Mm123456 司机
        // 15136655113 Mm123456 质检员
        phone:this.data.account,
        password:this.data.password
      },//formData
    }).then(res => {
      //console.log(res)
      wx.setStorageSync('memberInfo', res.data)
      wx.setStorageSync('api_token', res.data.api_token)
      this.subscribe()
      
    })
    
    
  },

  subscribe() {
    const that = this
    wx.$get({
      url: '/driver/message/templateIds'
    }).then(res => {
      wx.requestSubscribeMessage({
        tmplIds: res.data || [],
        success: (res) => {
          that.wxLogin()
        },
        fail: (error) => {
          that.wxLogin()
        }
      })
    })
  },
  

  wxLogin() {
    wx.login({
      success: (wxRes) => {
        wx.$post({
          url: '/api/login/wxLogin',
          data: {
            code: wxRes.code,
            type: 3
          },
          loading: false,
        }).then(res => {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        })
      }
    })
  },

 
})