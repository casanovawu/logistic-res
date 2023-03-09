import { request } from "../../../../request/index.js";
import { pageModule } from '../../../../utils/common';

Page({

  pageId: 10,
  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    hasData: false
  },

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
  },

  queryList() {
    const userInfo = wx.getStorageSync('userInfo')
    const data = {
      miniUserId: userInfo.miniUserId
    };
    request({ url: "/line/subscribe/queryList", method: "post", data }).then((res) => {
      let data = res.data;
      this.setData({
        searchList: [...this.data.searchList, ...res.data],
        hasData: true,
      })
      wx.stopPullDownRefresh();
    })
  },
  //下拉刷新事件
  onPullDownRefresh() {
    //1.重置数组
    this.setData({
      searchList: []
    })
    //2.发送请求
    this.queryList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().initTarBar();
    this.onPullDownRefresh()
  },
  handleTapAddress(e) {
    console.log(e.currentTarget.dataset.subscribeid)
    wx.navigateTo({
      url: '/pages/driven/line/subscribeDetail/index?subscribeId='+e.currentTarget.dataset.subscribeid
    });
  },
  handleInsertLine(e) {
    wx.navigateTo({
      url: '/pages/driven/line/subscribe/index'
    });
  },

})