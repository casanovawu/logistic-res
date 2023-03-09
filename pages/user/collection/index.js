import { request } from "../../../request/index.js";
import { pageModule } from '../../../utils/common';

Page({

    pageId: 13,
    /**
     * 页面的初始数据
     */
    data: {
        searchList: [],
        hasData: false
    },
    paginationDTO: {
        pageNumber: 1,
        pageSize: 10,
    },

    onShow() {
        this.onPullDownRefresh()
    },
    onLoad: function (options) {
        pageModule.queryPageModule(this.pageId).then((pageModuleMap) => {
            this.setData({
                pageModuleMap: pageModuleMap,
            })
            wx.setNavigationBarTitle({
                title: pageModuleMap.page_bar_title
            })
        });
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
            searchList: [],
            hasData: false
        })
        //2.重置页面
        this.paginationDTO.pageNumber = 1;
        //3.发送请求
        this.querySearchList();
    },
    querySearchList() {
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo.type == 1) {
          let paginationDTO = this.paginationDTO;
          let data = {
            isCollection: 1,
            miniUserId : userInfo.miniUserId
          };
          request({ url: "/driven/order/search", method: "post", data, paginationDTO }).then((res) => {
            if(res.data.length > 0){
                this.setData({
                    searchList: [...this.data.searchList, ...res.data],
                    hasData: true, 
                  })
            }
            this.totalPages = res.paginationDTO.totalPages
          });
        }
        wx.stopPullDownRefresh();
      },
})