// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    detail:'',
    state:'',
    reason:'',
    items: [
      { name: '1', value: '质检通过' },
      { name: '2', value: '质检异常'}
    ],
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      type:wx.getStorageSync('type')
    })
    this.inspectionPopup = this.selectComponent("#insPopup");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

// 初始化获取数据
getInfo(){
  wx.$get({
    url:'/driver/delivery/sortingInfo',
    data:{
      id:this.data.id
    }
  }).then(res => {
    console.log(res)
    this.setData({
      detail:res.data
    })
  })
},
require_error(){
  this.inspectionPopup.hidePopup();
},
startInspection(){
  let id=this.data.id
  this.setData({
    id:id
  })
  this.inspectionPopup.showPopup();
},
//质检
inspection_success(){
  wx.$post({
    url: '/driver/delivery/qualityInspection',
    data: {
      state:this.data.state,
      id:this.data.id,
      unusual_reason:this.data.reason
    },//formData
  }).then(res => {
    console.log(res)
    wx.$alert('操作成功')
    this.inspectionPopup.hidePopup();
    this.getInfo()
  })
},
radioChange: function (e) {
  //var str = null;
  // for (var value of this.data.items) {
  //   if (value.name === e.detail.value) {
  //     str = value.value;
  //     break;
  //   }
  // }
  console.log(e.detail.value)
  this.setData({
    state:e.detail.value
  })
  if(e.detail.value == 2){
    // 出现理由填写
    this.setData({
      showReasonBox:true
    })
  }
  if(e.detail.value == 1){
    // 出现理由填写
    this.setData({
      showReasonBox:false
    })
  }
},
getReason(e){
  this.setData({
    reason:e.detail.value
  })
},
})