import { request } from "../../../../request/index.js";
import { pageModule } from '../../../../utils/common';
import Toast from '@vant/weapp/toast/toast';

Page({

  pageId: 12,
  /**
   * 页面的初始数据
   */
  data: {
    //区域列表
    areaList: [],
    //出发城市
    departmentCityValue: "",
    showDepartmentCity: false,
    //目的城市
    arriveCityValue: "",
    showArriveCity: false,
    departmentAreaCode: "",
    arriveAreaCode: "",
    //用车类型
    showCarType: false,
    carTypeValue: "",
    carTypeList: [],
    carTypeCheckedList: [

    ],
  },
  subscribeId: {},
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
    this.queryCarTypeDic()
    this.queryOrganization()
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { subscribeId } = options;
    this.subscribeId = subscribeId;
    this.queryDetail();
  },
  queryDetail() {
    const data = {
      id: this.subscribeId,
    };
    request({ url: "/line/subscribe/queryOne", method: "post", data }).then((res) => {
      let data = res.data;
      this.setData({
        departmentCityValue: data.departureName,
        //目的城市
        arriveCityValue: data.arriveName,
        departmentAreaCode: data.departureAreaCode,
        arriveAreaCode: data.arriveAreaCode,
        carTypeValue: data.cartTypeName,
        carTypeCheckedList: data.cartTypeList,
      })
    })
  },
  queryOrganization() {
    const userInfo = wx.getStorageSync('userInfo')
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

    const address = province.name + city.name + area.name;
    this.setData({
      departmentCityValue: address,
      departmentAreaCode: area.code
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
    const address = province.name + city.name + area.name;
    this.setData({
      arriveCityValue: address,
      arriveAreaCode: area.code
    })
    this.setData({ showArriveCity: false });
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
  //确认修改
  handleUpdateDetail() {
    const userInfo = wx.getStorageSync("userInfo");
    const data = {
      id: this.subscribeId,
      departureAreaCode: this.data.departmentAreaCode,
      arriveAreaCode: this.data.arriveAreaCode,
      cartTypeList: this.data.carTypeCheckedList
    };
    wx.requestSubscribeMessage({
      tmplIds: ['LrMZNampNb4Hx-NsqCTnXM8tUEk8-kLN1G0OutfHbvw'],
      success(res) {
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          // res[templateId]: 'accept'、'reject'、'ban'、'filter'
          if (res['LrMZNampNb4Hx-NsqCTnXM8tUEk8-kLN1G0OutfHbvw'] == 'accept') {
            request({ url: "/line/subscribe/update", method: "post", data }).then(() => {
              wx.switchTab({
                url: '/pages/driven/line/index/index'
              });
            }).catch((err) => { console.log(err); Toast.fail(err); });
          }
        }
      }
    })
  },
  //下线
  handleOffline() {
    const userInfo = wx.getStorageSync("userInfo");
    const data = {
      id: this.subscribeId
    };
    request({ url: "/line/subscribe/delete", method: "post", data }).then(() => {
      wx.switchTab({
        url: '/pages/driven/line/index/index'
      });
    }).catch((err) => { console.log(err); Toast.fail(err); });
  },
})