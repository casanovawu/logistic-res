//Page Object
import { request } from "../../../request/index.js";
import { pageModule } from '../../../utils/common';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { store } from '../../../store/store';

Page({
  pageId: 2,
  data: {
    //组件名称
    pageModuleMap: {},
    hasData: false,
    myPublishList: [],
    priceStyleList: [],
    statusList: [
      { text: '全部状态', value: '' },
      { text: '审核中', value: 1 },
      { text: '已上线', value: 2 },
      { text: '已下线', value: 3 },
      { text: '审核拒绝', value: 4 },
    ],
    sortList: [
      { text: '默认排序', value: '' },
      { text: '发布时间升序', value: 'asc' },
      { text: '发布时间降序', value: 'desc' }
    ],
    status: '',
    sort: '',
  },
  paginationDTO: {
    pageNumber: 1,
    pageSize: 10,
  },
  totalPages: {},

  onShow() {
    this.getTabBar().initTarBar();
    this.initTarbarList();
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
  },
  queryMyPublishList() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo.type == 2) {
      let paginationDTO = this.paginationDTO;
      let data = {
        miniUserId: userInfo.miniUserId,
        status:this.data.status,
        sort:this.data.sort
      };
      request({ url: "/goodsowner/order/myPublish", method: "post", data, paginationDTO }).then((res) => {
        this.setData({
          myPublishList: [...this.data.myPublishList, ...res.data],
          hasData: true,
        })
        this.totalPages = res.paginationDTO.totalPages
      });
    }
    wx.stopPullDownRefresh();
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
  //页面上滑,滚动条触底事件
  onReachBottom() {
    if (this.paginationDTO.pageNumber < this.totalPages) {
      //还有下一页数据
      this.paginationDTO.pageNumber++;
      this.queryMyPublishList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh() {
    //1.重置数组
    this.setData({
      myPublishList: []
    })
    //2.重置页面
    this.paginationDTO.pageNumber = 1;
    //3.发送请求
    this.queryMyPublishList();
  },
  onChangeStatusList(e) {
    this.data.status = e.detail
    this.onPullDownRefresh();
  }, 
  onChangeSortList(e) {
    this.data.sort = e.detail
    this.onPullDownRefresh();
  },
});