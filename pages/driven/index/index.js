//Page Object
import { request } from "../../../request/index.js";
import { pageModule } from '../../../utils/common';
import { store } from '../../../store/store';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { formatTimeDYM } from '../../../utils/util';

Page({
  pageId: 5,
  data: {
    areaList: [],
    departureAreaCode:'',
    arriveAreaCode:'',
    departmentCityValue:"起点",
    arriveCityValue:"终点",
    useDateRange:'',
    showUseStartDate: false,
    showCarType: false,
    carTypeList: [],
    carTypeCheckedList: [
    ],
    searchList:[],
    hasData:false
  },
  //防抖动
  TimeId: -1,
  paginationDTO: {
    pageNumber: 1,
    pageSize: 10,
  },
  keyword: '',  
  useStartDate: '',
  useEndDate: '',
  minTon: '',
  maxTon: '',
  minPrice: '',
  maxPrice: '',

  totalPages: {},

  onShow() {
      this.getTabBar().initTarBar();
      this.initTarbarList()
      const userInfo = wx.getStorageSync('userInfo')
      if(!userInfo){
        wx.navigateTo({
            url: '/pages/login/index'
          });
      }
    this.onPullDownRefresh()
  },
  onLoad: function (options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['tarbarList'],
      actions: ['updateTarbarList']
    })
    pageModule.queryPageModule(this.pageId).then((pageModuleMap) => {
      this.setData({
        pageModuleMap: pageModuleMap,
      })
      wx.setNavigationBarTitle({
        title: pageModuleMap.page_bar_title
      })
    });
    this.queryOrganization()
    this.queryCarTypeDic()
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },
  initTarbarList() {
    const userInfo = wx.getStorageSync('userInfo')
    let data = {
      miniUserType: userInfo.type,
      lang: userInfo.language
    };
    request({ url: "/tabbar/queryList", method: "post", data }).then((res) => {
      this.updateTarbarList(res.data)
    });
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
  querySearchList() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo.type == 1) {
      let paginationDTO = this.paginationDTO;
      let data = {
        departureAreaCode: this.data.departureAreaCode,
        arriveAreaCode: this.data.arriveAreaCode,
        minTon: this.minTon,
        maxTon: this.maxTon,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        useStartDate: this.useStartDate,
        useEndDate: this.useEndDate,
        keyword: this.keyword,
        cartTypeList: this.carTypeCheckedList
      };
      request({ url: "/driven/order/search", method: "post", data, paginationDTO }).then((res) => {
        this.setData({
          searchList: [...this.data.searchList, ...res.data],
          hasData: true,
        })
        this.totalPages = res.paginationDTO.totalPages
      });
    }
    wx.stopPullDownRefresh();
  },
  onChange(e) {
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.keyword = e.detail
    }, 10);
  },
  onSearch() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo.type == 1) {
      const paginationDTO = this.paginationDTO;
      let data = {
        departureAreaCode: this.data.departureAreaCode,
        arriveAreaCode: this.data.arriveAreaCode,
        minTon: this.minTon,
        maxTon: this.maxTon,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        useStartDate: this.useStartDate,
        useEndDate: this.useEndDate,
        keyword: this.keyword,
        cartTypeList: this.carTypeCheckedList
      };
      request({ url: "/driven/order/search", method: "post", data, paginationDTO }).then((res) => {
        this.setData({
          searchList: res.data,
          hasData: true,
        })
        this.totalPages = res.paginationDTO.totalPages
      });
    }
  },
  handelConfirmDepartmentCity(e) {
    const values = e.detail.values;
    const province = values[0];
    const city = values[1];
    const area = values[2];
    const address = province.name + city.name + area.name;
    this.setData({
      departmentCityValue: address,
      departureAreaCode : area.code
    })
    var showDepartmentCity =this.selectComponent('#showDepartmentCity');
    showDepartmentCity.toggle(false);
  },
  onCancelDepartmentCity() {
    var showDepartmentCity =this.selectComponent('#showDepartmentCity');
    this.setData({
      departmentCityValue: "起点",
      departureAreaCode : ''
    })
    showDepartmentCity.toggle(false);
  }, 
  handelConfirmArriveCity(e) {
    const values = e.detail.values;
    const province = values[0];
    const city = values[1];
    const area = values[2];
    const address = province.name + city.name + area.name;
    this.setData({
      arriveCityValue: address,
      arriveAreaCode : area.code
    })
    var showArriveCity =this.selectComponent('#showArriveCity');
    showArriveCity.toggle(false);
  },
  onCancelArriveCity() {
    var showArriveCity =this.selectComponent('#showArriveCity');
    this.setData({
      arriveCityValue: "终点",
      arriveAreaCode : ''
    })
    showArriveCity.toggle(false);
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
  //价格
  onChangeMinPrice(e) {
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.minPrice = e.detail
    }, 10);
  },
  onChangeMaxPrice(e) {
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.maxPrice = e.detail
    }, 10);
  },
  onDisplayUseStartDate() {
    this.setData({ showUseStartDate: true });
  },
  onCloseUseStartDate() {
    this.setData({ showUseStartDate: false });
  },
  formatDateMD(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirmUseStartDate(event) {
    console.log(event)
    const [start, end] = event.detail;
    this.setData({
      showUseStartDate: false,
      useDateRange: `${this.formatDateMD(start)} - ${this.formatDateMD(end)}`,
    });
    this.useStartDate = formatTimeDYM(start),
    this.useEndDate =formatTimeDYM(end)
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
  //滚动穿透问题
  onOpenDropdownMenu() {
    this.setData({
      showDropdownMenu: true
    })
  },
  onCloseDropdownMenu() {
    this.setData({
      showDropdownMenu: false
    })
  },
  //页面上滑,滚动条触底事件
  onReachBottom() {
    if (this.paginationDTO.pageNumber < this.totalPages) {
      //还有下一页数据
      this.paginationDTO.pageNumber++;
      this.querySearchList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh() {
    //1.重置数组
    this.setData({
      searchList: []
    })
    //2.重置页面
    this.paginationDTO.pageNumber = 1;
    //3.发送请求
    this.querySearchList();
  }
});