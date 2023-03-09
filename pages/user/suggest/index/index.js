import { request } from "../../../../request/index.js";
import { pageModule } from '../../../../utils/common';

Page({

    pageId: 7,
    /**
     * 页面的初始数据
     */
    data: {
        orderId:{},
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
  
    /**
     * 生命周期函数--监听页面显示
     */
     onShow() {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        let options = currentPage.options;
        const { orderId } = options;
        this.orderId = orderId;
    },
    handleClick(e) {
        if(this.orderId){
            wx.navigateTo({
                url: '/pages/user/suggest/submit/index?type='+e.currentTarget.dataset.type+'&orderId='+this.orderId
            });
        }else{
            wx.navigateTo({
                url: '/pages/user/suggest/submit/index?type='+e.currentTarget.dataset.type
                });
            }
    }
  })