// pages/deliveryOrderInfo/deliveryOrderInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    index: 0,
    chooseReason:'',
    id:'',
    info:'',
    stateName:'',
    formData:{
      qualification:[]
    },
    reason:'',
    deliveryClick:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getUnusualReason()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得popup组件
    this.popup = this.selectComponent("#popup");
    this.requirePopup = this.selectComponent("#requirePopup");
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

  showPopup() {
    if(!this.data.deliveryClick){
      this.popup.showPopup();
    }
  },
  //取消事件
  _error() {
    console.log('你点击了取消');
    this.popup.hidePopup();
  },
  //确认事件
  _success() {
    //console.log('你点击了确定');
    wx.$post({
      url: '/driver/delivery/abnormalDelivery',
      data: {
        id:this.data.id,
        reason:this.data.chooseReason,
        desc:this.data.reason,
        pics:this.data.formData.qualification
      }
    }).then(res => {
      console.log(res)
      this.setData({
        deliveryClick:true
      })
      wx.$alert('操作成功')
      this.getInfo()
    })
    this.popup.hidePopup();
  },
  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      chooseReason:this.data.array[e.detail.value]
    })
  },
  showRequirePopup(){
    this.requirePopup.showPopup();
  },
  require_error(){
    this.requirePopup.hidePopup();
  },
  //详情获取数据
  getInfo(){
    wx.$get({
      url:'/driver/delivery/info',
      data:{
        id:this.data.id
      }
    }).then(res => {
      console.log(res)
      this.setData({
        info:res.data
      })
      switch(true) {
          case res.data.state == 1 || res.data.state == 2 || res.data.state == 3:
             this.setData({
              stateName:'待质检'
             })
             break;
          case res.data.state == 4:
            this.setData({
              stateName:'待提货'
             })
             break;
          case res.data.state == 5:
            this.setData({
              stateName:'配送中'
            })
          break;
          case res.data.state == 6:
            this.setData({
              stateName:'已配送'
          })
          break;
          case res.data.state == 7:
            this.setData({
              stateName:'异常'
          })
          break;
          default:
            this.setData({
              stateName:''
          })
        }
    })
  },
  //从本地选择图片
  chooseImage(){
    const that = this
    const formData = this.data.formData
    const qualification = formData.qualification || []
    wx.chooseImage({
      count: 3 - qualification.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        const tempFiles = res.tempFiles;
        wx.$upload(tempFiles).then(res => {
          console.log(res)
          qualification.push(...res)
          for(var i=0;i<qualification.length;i++){
            qualification[i] = 'http:'+qualification[i]
          }
          formData.qualification = qualification
          that.setData({
            formData: formData
          })
        })
      }
    });
  },
  deleteImage(e){
    let index = e.currentTarget.dataset.index
    let param = this.data.formData.qualification
    const formData = {}
    param.splice(index,1)
    formData.qualification = param
    this.setData({
      formData:formData
    })
  },
  // 司机确认提货
  checkPickUp(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.$post({
      url: '/driver/delivery/takeDelivery',
      data: {
        id:id
      }
    }).then(res => {
      console.log(res)
      wx.$alert('操作成功')
      this.getInfo()
    })
  },
  goInfo(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/info/info?id=' + id
    })
  },
  getReason(e){
    this.setData({
      reason:e.detail.value
    })
  },
  getUnusualReason(){
    wx.$get({
      url:'/driver/delivery/abnormalReason',
      data:{}
    }).then(res => {
      console.log(res)
      let arr = []
      res.data.forEach(element => {
        arr.push(element.name)
      });
      this.setData({
        array:arr,
        chooseReason:res.data[0].name
      })
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
