//Page Object
import { formatTimeDYM } from '../../../utils/util';
import { pageModule } from '../../../utils/common';
import { request } from "../../../request/index.js";
import Toast from '@vant/weapp/toast/toast';

Page({
  pageId: 1,
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
    showUpdatePhone:false,
    minDate: new Date().getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    currentDateValue: formatTimeDYM(new Date()),
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
    departmentAreaCode: "",
    arriveAreaCode: "",
    loadLocationAddress:"",
    unloadLocationAddress:"",
    //价格
    priceStyle: "1"
  },
  //防抖动
  TimeId: -1,

  //出发城市
  minTon: "",
  maxTon: "",
  price: "",
  goodsInfo: "",
  loadLatitude: "",
  unloadLatitude: "",
  loadLongitude: "",
  unloadLongitude: "",
  updatePhone:"",

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

  onShow() {
    this.getTabBar().initTarBar();
    const userInfo = wx.getStorageSync('userInfo')
    pageModule.queryPageModule(this.pageId).then((pageModuleMap) => {
      this.setData({
        pageModuleMap: pageModuleMap
      })
      wx.setNavigationBarTitle({
        title: pageModuleMap.page_bar_title
      })
    });
    this.queryOrganization(userInfo)
    this.queryCarTypeDic()
  },

  onLoad: function (options) {
    pageModule.queryPageModule(this.pageId).then((pageModuleMap) => {
      this.setData({
        pageModuleMap: pageModuleMap,
        departmentCityValue: pageModuleMap.please_department_city,
        arriveCityValue: pageModuleMap.please_arrive_city
      })
      wx.setNavigationBarTitle({
        title: pageModuleMap.page_bar_title
      })
    });
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
      this.maxTon = e.detail
    }, 10);
  },
  onChangeTonMin(e) {
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.minTon = e.detail
    }, 10);
  },
  onInputUpdatePhone(e) {
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.updatePhone = e.detail
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
      this.price = e.detail
    }, 10);
  },
  //货源信息
  onInputGoodsInfo(e) {
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.goodsInfo = e.detail
    }, 10);
  },
  //发布
  handleSubmit() {
    const userInfo = wx.getStorageSync("userInfo");
    const data = {
      miniUserId: userInfo.miniUserId,
  };
  request({ url: "/user/queryInfo", method: "post", data }).then((result) => {
      if (result.data.phone) {
        this.handleSubmitProcess()
      }else{
        this.setData({ showUpdatePhone: true });
      }
  })
 },
  handleSubmitProcess() {
    const userInfo = wx.getStorageSync("userInfo");
    const data = {
      miniUserId: userInfo.miniUserId,
      departureAreaCode: this.departmentAreaCode,
      arriveAreaCode: this.arriveAreaCode,
      useStartDate: this.data.currentDateValue,
      minTon: this.minTon,
      maxTon: this.maxTon,
      priceStyle: this.data.priceStyle,
      price: this.price,
      goodsInfo: this.goodsInfo,
      loadLatitude: this.loadLatitude,
      unloadLatitude: this.unloadLatitude,
      loadLongitude: this.loadLongitude,
      unloadLongitude: this.unloadLongitude,
      loadAddress: this.data.loadLocationAddress,
      unloadAddress: this.data.unloadLocationAddress,
      cartTypeList: this.data.carTypeCheckedList
    };
    request({ url: "/goodsowner/order/publish", method: "post", data }).then(() => {
      this.setData({ showUpdatePhone: false });
      wx.switchTab({
        url: '/pages/goods_owner/index/index'
      });
    }).catch((err) => { 
      console.log(err); 
      Toast.fail(err);
      this.setData({ showUpdatePhone: false });
     });
  },
  invokeWxMiniPluginGetLocationLoad() {
    let that=this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于 wx.openLocation 的经纬度
      success (res) {
        wx.chooseLocation({
          latitude:res.latitude,
          longitude:res.longitude,
          success: (res1)=>{
            const locationAddress = (res1.address?res1.address : "") + (res1.name?res1.name : "")
              that.setData({
                loadLocationAddress:locationAddress
              });
              that.loadLatitude=res1.latitude
              that.loadLongitude=res1.longitude
          }
        })
      },
      fail(res){
        console.info('ready getLocation fail=' + JSON.stringify(res))
      }
     })
  },
  invokeWxMiniPluginGetLocationunLoad() {
    let that=this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于 wx.openLocation 的经纬度
      success (res) {
        wx.chooseLocation({
          latitude:res.latitude,
          longitude:res.longitude,
          success: (res1)=>{
            const locationAddress = (res1.address?res1.address : "") + (res1.name?res1.name : "")
              that.setData({
                unloadLocationAddress:locationAddress
              });
              that.unloadLatitude=res1.latitude
              that.unloadLongitude=res1.longitude
          }
        })
      },
      fail(res){
        console.info('ready getLocation fail=' + JSON.stringify(res))
      }
     })
  },
  onUnload () {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
  },
  handleUpdatePhone() {
    const userInfo = wx.getStorageSync("userInfo");
    if(this.updatePhone==""){
      Toast.fail("手机号修改不能为空");
    }else{
        const data = {
          miniUserId: userInfo.miniUserId,
          phone: this.updatePhone
      };
      request({ url: "/user/update", method: "post", data }).then((miniUser) => {
        this.handleSubmitProcess()
      });
    }
}
});