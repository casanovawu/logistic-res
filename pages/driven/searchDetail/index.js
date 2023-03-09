import { request } from "../../../request/index.js";
import { pageModule } from '../../../utils/common';

Page({
  pageId: 6,
  /**
   * 页面的初始数据
   */
  data: {
    isFocus: {},
    isCollection: {},
    priceStyle: {},
    maxTon: {},
    minTon: {},
    headPic: "",
    phone: "",
    useStartDate: "",
    departureAddressName: "",
    arriveAddressName: "",
    cartTypeListName: "",
    price: "",
    goodsInfo: "",
    pageModuleMap: "",
    isLoadLocation: {},
    isUnloadLocation: {},
    loadAddress: "",
    unloadAddress: "",
    loadLatitude: {},
    loadLongitude: {},
    unloadLatitude: {},
    unloadLongitude: {},
    unloadMarkers: [],
    loadMarkers: [],
    isLogin:false
  },
  orderId: {},
  miniUserId: {},
  locationKey:"",
  locationReferer:"",
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    pageModule.queryPageModule(this.pageId).then((pageModuleMap) => {
      this.setData({
        pageModuleMap: pageModuleMap
      })
      wx.setNavigationBarTitle({
        title: pageModuleMap.page_bar_title
      })
    });
    this.querySysConfig()
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { orderId } = options;
    this.orderId = orderId;
    this.querySearchDetail();
    this.updateLook();
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        isLogin: true
      })
    }
  },

  showMarker(loadLatitude,loadLongitude,loadAddress,unloadLatitude,unloadLongitude,unloadAddress){
    const marker1 = {
      id: 1,
      latitude: loadLatitude,
      longitude: loadLongitude,
      width:1,
      height:1,
      callout: {
        content: loadAddress,
        color: '#ff0000',
        fontSize: 14,
        borderWidth: 5,
        borderRadius: 10,
        borderColor: '#fff',
        bgColor: '#fff',
        padding: 5,
        display: 'ALWAYS',
        textAlign: 'center',
        anchorX:0,
        anchorY:0,
      },
    }
    const marker2 = {
      id: 2,
      latitude: unloadLatitude,
      longitude: unloadLongitude,
      width:1,
      height:1,
      callout: {
        content: unloadAddress,
        color: '#ff0000',
        fontSize: 14,
        borderWidth: 5,
        borderRadius: 10,
        borderColor: '#fff',
        bgColor: '#fff',
        padding: 5,
        display: 'ALWAYS',
        textAlign: 'center',
        anchorX:0,
        anchorY:0,
      },
    }
    const loadMarkers = [marker1]
    const unloadMarkers = [marker2]
    this.setData({
      loadMarkers: loadMarkers,
      unloadMarkers: unloadMarkers,
    })
  },

  querySearchDetail() {
    const userInfo = wx.getStorageSync('userInfo')
    const data = {
      orderId: this.orderId,
      miniUserId: userInfo.miniUserId
    };
    request({ url: "/driven/order/searchDetail", method: "post", data }).then((res) => {
      let data = res.data;
      this.setData({
        isFocus: data.isFocus,
        isCollection: data.isCollection,
        priceStyle: data.priceStyle,
        maxTon: data.maxTon,
        minTon: data.minTon,
        headPic: data.headPic,
        phone: data.phone,
        useStartDate: data.useStartDate,
        departureAddressName: data.departureAddressName,
        arriveAddressName: data.arriveAddressName,
        cartTypeListName: data.cartTypeListName,
        price: data.price,
        goodsInfo: data.goodsInfo,
        isLoadLocation: data.isLoadLocation,
        isUnloadLocation: data.isUnloadLocation,
        loadAddress: data.loadAddress,
        unloadAddress: data.unloadAddress,
        loadLatitude: data.loadLatitude,
        loadLongitude: data.loadLongitude,
        unloadLatitude: data.unloadLatitude,
        unloadLongitude: data.unloadLongitude
      })
      this.miniUserId = data.miniUserId
      this.showMarker(data.loadLatitude,data.loadLongitude,data.loadAddress,data.unloadLatitude,data.unloadLongitude,data.unloadAddress)
      wx.stopPullDownRefresh();
    })
  },
  querySysConfig() {
    const data = {
      keyList: ["MINI_LOCATION_KEY","MINI_LOCATION_REFERER"]
    };
    request({ url: "/sys/config/queryList", method: "post", data }).then((data) => {
      this.locationKey = data.data.sysConfigMap.MINI_LOCATION_KEY,
      this.locationReferer = data.data.sysConfigMap.MINI_LOCATION_REFERER
    })
  },
  //下拉刷新事件
  onPullDownRefresh() {
    //发送请求
    this.querySearchDetail();
  },
  //拨打电话
  callphone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //关注
  handleTapFocus(e) {
    this.updateFocus(e.currentTarget.dataset.isfocus)
  },
  updateFocus(isfocus) {
    const userInfo = wx.getStorageSync('userInfo')
    const data = {
      miniUserFocusId: userInfo.miniUserId,
      miniUserId: this.miniUserId,
      isFocus: isfocus
    };
    request({ url: "/mini/focus/update", method: "post", data }).then((res) => {
      this.setData({
        isFocus: isfocus
      })
    })
  },
  //处理地图点击
  handleloadTapCallout(e) {
    let that=this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于 wx.openLocation 的经纬度
      success (res) {
        const latitude = parseFloat(that.data.loadLatitude)
        const longitude = parseFloat(that.data.loadLongitude)
        wx.openLocation({
          latitude:latitude,
          longitude:longitude,
          name:that.data.loadAddress,
          scale: 18
        })
      },
      fail(res){
        console.info('ready getLocation fail=' + JSON.stringify(res))
      },
     })
  },
  handleunloadTapCallout(e) {
    let that=this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于 wx.openLocation 的经纬度
      success (res) {
        const latitude = parseFloat(that.data.unloadLatitude)
        const longitude = parseFloat(that.data.unloadLongitude)
        wx.openLocation({
          latitude:latitude,
          longitude:longitude,
          name:that.data.unloadAddress,
          scale: 18
        })
      },
      fail(res){
        console.info('ready getLocation fail=' + JSON.stringify(res))
      }
     })
  },
  //收藏
  handleTapCollection(e) {
    this.updateCollection(e.currentTarget.dataset.iscollection)
  }, 
  updateCollection(iscollection) {
    const userInfo = wx.getStorageSync('userInfo')
    const data = {
      orderId: this.orderId,
      miniUserId: userInfo.miniUserId,
      isCollection: iscollection
    };
    request({ url: "/order/collection/update", method: "post", data }).then((res) => {
      this.setData({
        isCollection: iscollection
      })
    })
  },
  updateLook() {
    const userInfo = wx.getStorageSync('userInfo')
    const data = {
      orderId: this.orderId,
      miniUserId: userInfo.miniUserId
    };
    request({ url: "/order/look/update", method: "post", data });
  },
  //建议
  handleTapSuggest() {
    wx.navigateTo({
      url: '/pages/user/suggest/index/index?orderId='+this.orderId
    });
  },
})