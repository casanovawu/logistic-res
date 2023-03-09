// pages/goods_owner/publishDetail/index.js
import { formatTimeDYM } from '../../../utils/util';
import { pageModule } from '../../../utils/common';
import { request } from "../../../request/index.js";
import Toast from '@vant/weapp/toast/toast';

Page({
  pageId: 3,
  data: {
    //组件名称
    pageModuleMap: [],
    //区域列表
    areaList: [],
    //出发城市
    departmentCityValue: "",
    showDepartmentCity: false,
    //目的城市
    arriveCityValue: "",
    showArriveCity: false,
    //使用时间
    showUseStartTime: false,
    minDate: new Date().getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    currentDateValue: "",
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    //用车类型
    showCarType: false,
    carTypeValue: "",
    carTypeList: [],
    carTypeCheckedList: [

    ],
    minTon: "",
    maxTon: "",

    //价格
    priceStyle: "1",
    price: "",
    goodsInfo: "",
    orderStatus: "",
    loadLocationAddress:"",
    unloadLocationAddress:"",
  },
  //防抖动
  TimeId: -1,

  //出发城市
  departmentAreaCode: "",
  arriveAreaCode: "",
  orderId:"",
  loadLatitude: "",
  unloadLatitude: "",
  loadLongitude: "",
  unloadLongitude: "",
  isLoadLocation: false,
  isUnloadLocation: false,
  updateLocation: false,


  queryOrganization(userInfo) {
    const data = {
      lang: userInfo.language,
    };
    request({ url: "/organization/queryList", method: "post", data }).then((areaList) => {
      this.setData({
        areaList: areaList.data
      })
    })
  },

  queryCarTypeDic() {
    const data = "car_type";
    request({ url: "/dic/queryList", method: "post", data }).then((data) => {
      this.setData({
        carTypeList: data.data
      })
    })
  },

  queryPublishDetail(orderId) {
    const data = {
      orderId: orderId,
    };
    request({ url: "/goodsowner/order/publishDetail", method: "post", data }).then((res) => {
      let data = res.data;
      this.setData({
        departmentCityValue: data.departureAddressName,
        arriveCityValue: data.arriveAddressName,
        currentDateValue: data.useStartDate,
        minTon: data.minTon,
        maxTon: data.maxTon,
        carTypeCheckedList: data.cartTypeList,
        priceStyle: data.priceStyle,
        price: data.price,
        goodsInfo: data.goodsInfo,
        orderStatus: data.status,
        loadLocationAddress:data.loadAddress,
        unloadLocationAddress:data.unloadAddress
      })
      this.departmentAreaCode = data.departureAreaCode
      this.arriveAreaCode = data.arriveAreaCode
      this.isUnloadLocation = data.isUnloadLocation
      this.isLoadLocation = data.isLoadLocation
      this.loadLatitude = data.loadLatitude
      this.loadLongitude = data.loadLongitude
      this.unloadLatitude = data.unloadLatitude
      this.unloadLongitude = data.unloadLongitude
    })
  },

  onShow() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { orderId } = options;
    this.orderId = orderId;
    if(!this.updateLocation){
      this.queryPublishDetail(orderId);
      this.updateLocation =false
    }
  },

  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    pageModule.queryPageModule(this.pageId).then((pageModuleMap) => {
      this.setData({
        pageModuleMap: pageModuleMap,
      })
      wx.setNavigationBarTitle({
        title: pageModuleMap.page_bar_title
      })
    });
    this.queryOrganization(userInfo)
    this.queryCarTypeDic()
  },

  //出发城市
  handleClickDepartmentCity() {
    this.setData({ showDepartmentCity: true });
  },
  onCloseDepartmentCity() {
    this.setData({ showDepartmentCity: false });
  },
  onCancelDepartmentCity() {
    this.setData({ showDepartmentCity: false });
  },
  handelConfirmDepartmentCity(e) {
    const values = e.detail.values;
    const province = values[0];
    const city = values[1];
    const area = values[2];
    this.departmentAreaCode = area.code;
    const address = province.name + city.name + area.name;
    this.setData({
      departmentCityValue: address
    })
    this.setData({ showDepartmentCity: false });
  },

  //目的城市
  handleClickArriveCity() {
    this.setData({ showArriveCity: true });
  },
  onCloseArriveCity() {
    this.setData({ showArriveCity: false });
  },
  onCancelArriveCity() {
    this.setData({ showArriveCity: false });
  },
  handelConfirmArriveCity(e) {
    const values = e.detail.values;
    const province = values[0];
    const city = values[1];
    const area = values[2];
    this.arriveAreaCode = area.code;
    const address = province.name + city.name + area.name;
    this.setData({
      arriveCityValue: address
    })
    this.setData({ showArriveCity: false });
  },
  //使用开始时间
  handleClickUseStartTime() {
    this.setData({ showUseStartTime: true });
  },
  onCloseUseStartTime() {
    this.setData({ showUseStartTime: false });
  },
  onCancelUseStartTime() {
    this.setData({ showUseStartTime: false });
  },
  handelConfirmUseStartTime(e) {
    this.setData({
      currentDateValue: formatTimeDYM(new Date(e.detail)),
      currentDate: e.detail
    })
    this.setData({ showUseStartTime: false });
  },

  //吨位
  onChangeTonMax(e) {
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.data.maxTon = e.detail
    }, 10);
  },
  onChangeTonMin(e) {
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.data.minTon = e.detail
    }, 10);
  },

  //用车类型
  handleTapCarType(e) {
    this.setData({ showCarType: !e.currentTarget.dataset.showtype });
  },
  onChangeCarType(e) {
    let carTypeValue = ""
    e.detail.forEach(v => {
      carTypeValue += this.data.carTypeList[v - 1].name
    })
    this.setData({
      carTypeValue,
      carTypeCheckedList: e.detail
    });
  },
  //价格
  onChangePrice(e) {
    this.setData({
      priceStyle: e.detail
    })
  },
  onChangeLoadAddress(e) {
    this.setData({
      loadLocationAddress: e.detail
    })
  }, 
  onChangeUnLoadAddress(e) {
    this.setData({
      unloadLocationAddress: e.detail
    })
  },
  onInputPrice(e) {
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.data.price = e.detail
    }, 10);
  },
  //货源信息
  onInputGoodsInfo(e) {
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.data.goodsInfo = e.detail
    }, 10);
  },
  //修改状态
  handleUpdateStatus() {
    const data = {
      id: this.orderId,
      status: 3
    };
    request({ url: "/goodsowner/order/updateStatus", method: "post", data }).then(() => {
      wx.switchTab({
        url: '/pages/goods_owner/index/index'
      });
    }).catch((err) => { console.log(err); Toast.fail(err); });
  },

  //修改详情
  handleUpdateDetail() {
    const userInfo = wx.getStorageSync("userInfo");
    const data = {
      id: this.orderId,
      miniUserId: userInfo.miniUserId,
      departureAreaCode: this.departmentAreaCode,
      arriveAreaCode: this.arriveAreaCode,
      useStartDate: this.data.currentDateValue,
      minTon: this.data.minTon,
      maxTon: this.data.maxTon,
      priceStyle: this.data.priceStyle,
      price: this.data.price,
      goodsInfo: this.data.goodsInfo,
      loadLatitude: this.loadLatitude,
      unloadLatitude: this.unloadLatitude,
      loadLongitude: this.loadLongitude,
      unloadLongitude: this.unloadLongitude,
      loadAddress: this.data.loadLocationAddress,
      unloadAddress: this.data.unloadLocationAddress,
      cartTypeList: this.data.carTypeCheckedList
    };
    request({ url: "/goodsowner/order/updateDetail", method: "post", data }).then(() => {
      wx.switchTab({
        url: '/pages/goods_owner/index/index'
      });
    }).catch((err) => { console.log(err); Toast.fail(err); });
  },
  invokeWxMiniPluginGetLocationLoad() {
    wx.chooseLocation({
      latitude:this.loadLatitude,
      longitude:this.loadLongitude,
      success: (res1)=>{
        this.updateLocation = true
        const locationAddress = (res1.address?res1.address : "") + (res1.name?res1.name : "")
        this.setData({
            loadLocationAddress:locationAddress
          });
        this.loadLatitude=res1.latitude
        this.loadLongitude=res1.longitude
      },
      fail(res){
        console.info('ready chooseLocation fail=' + JSON.stringify(res))
      }
    })
  },
  invokeWxMiniPluginGetLocationunLoad() {
    wx.chooseLocation({
      latitude:this.unloadLatitude,
      longitude:this.unloadLongitude,
      success: (res1)=>{
        this.updateLocation = true
        const locationAddress = (res1.address?res1.address : "") + (res1.name?res1.name : "")
          this.setData({
            unloadLocationAddress:locationAddress
          });
          this.unloadLatitude=res1.latitude
          this.unloadLongitude=res1.longitude
      },
      fail(res){
        console.info('ready chooseLocation fail=' + JSON.stringify(res))
      }
    })
  },
});