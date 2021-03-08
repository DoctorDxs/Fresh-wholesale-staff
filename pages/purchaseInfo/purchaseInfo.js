// pages/purchaseInfo/purchaseInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    info:'',
    stateName:'',
    items: [
      { name: '1', value: '质检通过' },
      { name: '2', value: '质检异常'}
    ],
    showReasonBox:false,
    purchaseId:'',
    state:'',
    reason:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.inspectionPopup = this.selectComponent("#inspectionPopup");
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
   //详情获取数据
   getInfo(){
    wx.$get({
      url:'/driver/delivery/info',
      data:{
        id:this.data.id
      }
    }).then(res => {
      console.log('123456789',this.data.id)
      this.setData({
        info:res.data
      })
      switch(true) {
        case res.data.state == 1:
           this.setData({
            stateName:'待备货'
           })
           break;
        case res.data.state == 2:
          this.setData({
            stateName:'待质检'
           })
           break;
        case res.data.state == 3:
          this.setData({
            stateName:'质检异常'
          })
        break;
        case res.data.state == 4:
          this.setData({
            stateName:'待提货'
        })
        break;   
        case res.data.state == 5:
          this.setData({
            stateName:'已提货'
        })
        break; 
        case res.data.state == 6:
          this.setData({
            stateName:'配送完成'
        })
        break; 
        default:
          this.setData({
            stateName:''
        })
      } 
    
    })
  },
  require_error(){
    this.inspectionPopup.hidePopup();
  },
  startInspection(e){
    let id=e.currentTarget.dataset.id
    this.setData({
      purchaseId:id
    })
    this.inspectionPopup.showPopup();
  },
  //质检
  inspection_success(){
    wx.$post({
      url: '/driver/delivery/qualityInspection',
      data: {
        state:this.data.state,
        id:this.data.purchaseId,
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
  goInfo(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/info/info?id=' + id
    })
  },
  goSeeGoods(){
    let detail = {
      supplier:this.data.info.supplier,
      purchase_delivery_goods:this.data.info.purchase_delivery_goods
    }
    wx.navigateTo({
      url: '/pages/goodsInfo/goodsInfo?detail=' + JSON.stringify(detail)
    })
  }
})