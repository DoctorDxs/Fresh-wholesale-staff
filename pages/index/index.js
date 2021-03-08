
//获取应用实例
const app = getApp()

Page({
  data: {
    number: 0,
    activeId:'1',
    //默认
    tabData:[],
    userInfo:'',
    orderList:[],
    items: [
      { name: '1', value: '质检通过' },
      { name: '2', value: '质检异常'}
    ],
    showReasonBox:false,
    id:'',
    state:'',
    reason:''
  },
  
  onShow() {
    this.getData()
  },

  onLoad: function () {
    //获得popup组件
    this.popup = this.selectComponent("#popup");
    this.inspectionPopup = this.selectComponent("#inspectionPopup");
  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList(this.data.activeId)
  },
 //获取用户信息根据type判断tab  	type=1司机 type=2质检
  getData() {
    wx.$get({
      url: '/driver/my/info',
      data: {},
    }).then(res => {
      //console.log(res)
      wx.setStorageSync('type', res.data.type)
      console.log('获取数据')
      this.setData({
        userInfo:res.data
      })
      //type=1司机 type=2质检
      if(res.data.type == 1){
        this.setData({
          tabData:[{
            name:'待质检',
            icon:res.data.qcing_count,
            state:'3'
          },
          {
            name:'待提货',
            icon:res.data.taking_count,
            state:'4'
          },
          {
            name:'配送中',
            icon:res.data.taken_count,
            state:'5'
          },
          {
            name:'已配送',
            icon:res.data.finish_count,
            state:'6'
          },
          {
            name:'异常',
            icon:res.data.delivery_abnormal_count,
            state:'7'
          }],
          activeId:'3'
        }),
        this.getList(3)
      }
      if(res.data.type == 2){
        this.setData({
          tabData:[{
            name:'备货中',
            icon:res.data.prepare_count,
            state:'1'
          },
          {
            name:'待质检',
            icon:res.data.qcing_count,
            state:'2'
          },
          {
            name:'质检异常',
            icon:res.data.qc_fail_count,
            state:'3'
          },
          {
            name:'待提货',
            icon:res.data.taking_count,
            state:'4'
          },
          {
            name:'已提货',
            icon:res.data.taken_count,
            state:'5'
          }],
          activeId:'1'
        })
        this.getList(1)
      }
    })
  },

  //获取列表
  getList(state){
    wx.$get({
      url:'/driver/delivery/list',
      data:{
        state:state
      }
    }).then(res => {
      //console.log(res)
      // 判断状态中文名
      // 司机对应的状态有：(1,2,3待质检) 4待提货 5配送中 6已配送
      // 质检对应的状态有：1待备货 2待质检 3质检异常 4质检成功待提货 (5,6已提货待配送)
      if(res.data.data){
        let arrayList = res.data.data
        for(var i=0;i<arrayList.length;i++){
          //司机
        if(this.data.userInfo.type == 1){
            if( arrayList[i]['state'] == 1 || arrayList[i]['state'] == 2 || arrayList[i]['state'] == 3 ){
              arrayList[i]['stateName'] = '待质检'
            }
            if( arrayList[i]['state'] == 4 ){
              arrayList[i]['stateName'] = '待提货'
            }
            if( arrayList[i]['state'] == 5 ){
              arrayList[i]['stateName'] = '配送中'
            }
            if( arrayList[i]['state'] == 6 ){
              arrayList[i]['stateName'] = '已配送'
            }
        }
        //质检
        if(this.data.userInfo.type == 2){
          if( arrayList[i]['state'] == 1 ){
            arrayList[i]['stateName'] = '待备货'
          }
          if( arrayList[i]['state'] == 2 ){
            arrayList[i]['stateName'] = '待质检'
          }
          if( arrayList[i]['state'] == 3 ){
            arrayList[i]['stateName'] = '质检异常'
          }
          if( arrayList[i]['state'] == 4 ){
            arrayList[i]['stateName'] = '待提货'
          }
          if( arrayList[i]['state'] == 5 || arrayList[i]['state'] == 6 ){
            arrayList[i]['stateName'] = '已提货'
          }
        }
      }
      this.setData({
        orderList:res.data.data
      })
    }
    })
  },

  //tab切换
  toggleTab(e){
    //console.log(e)
    //获取角标
    wx.$get({
      url: '/driver/my/info',
      data: {},
    }).then(res => {
      //console.log(res)
      wx.setStorageSync('type', res.data.type)
      //console.log('获取数据')
      this.setData({
        userInfo:res.data
      })
      //type=1司机 type=2质检
      if(res.data.type == 1){
        this.setData({
          tabData:[{
            name:'待质检',
            icon:res.data.qcing_count,
            state:'3'
          },
          {
            name:'待提货',
            icon:res.data.taking_count,
            state:'4'
          },
          {
            name:'配送中',
            icon:res.data.taken_count,
            state:'5'
          },
          {
            name:'已配送',
            icon:res.data.finish_count,
            state:'6'
          },
          {
            name:'异常',
            icon:res.data.delivery_abnormal_count,
            state:'7'
          }]
        })
      }
      if(res.data.type == 2){
        this.setData({
          tabData:[{
            name:'备货中',
            icon:res.data.prepare_count,
            state:'1'
          },
          {
            name:'待质检',
            icon:res.data.qcing_count,
            state:'2'
          },
          {
            name:'质检异常',
            icon:res.data.qc_fail_count,
            state:'3'
          },
          {
            name:'待提货',
            icon:res.data.taking_count,
            state:'4'
          },
          {
            name:'已提货',
            icon:res.data.taken_count,
            state:'5'
          }]
        })
      }
    })
    this.setData({
      activeId:e.currentTarget.dataset.item.state
    })
    this.getList(e.currentTarget.dataset.item.state)
  },
  //跳转详情
  goPurchaseInfo(e){
    let id=e.currentTarget.dataset.id
    if(this.data.userInfo.type == 1){
      wx.navigateTo({
        url: '/pages/deliveryOrderInfo/deliveryOrderInfo?id=' + id,
      })
    }
    if(this.data.userInfo.type == 2){
      wx.navigateTo({
        url: '/pages/purchaseInfo/purchaseInfo?id=' + id,
      })
    }
    
  },

  //以下是弹窗涉及的事件
  showPopup() {
    this.popup.showPopup();
  },
  //取消事件
  _error() {
    console.log('你点击了取消');
    this.popup.hidePopup();
  },
  //确认事件
  _success() {
    console.log('你点击了确定');
    this.popup.hidePopup();
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  startInspection(e){
    let id=e.currentTarget.dataset.id
    this.setData({
      id:id
    })
    this.inspectionPopup.showPopup();
  },
  require_error(){
    this.inspectionPopup.hidePopup();
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

    })
  },
  //提货装车
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
  accountInfo(){
    wx.navigateTo({
      url: '/pages/account/set',
    })
  }
})
