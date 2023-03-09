//Page Object
import { pageModule } from '../../../utils/common';
import { request } from "../../../request/index.js";

Page({
    pageId: 4,
    data: {
        headUrl: {},
        userName: {},
        type: {},
        notice:''
    },
    onShow() {
        this.getTabBar().initTarBar();
        this.queryUserInfo()
        this.queryNotice()
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
    queryUserInfo() {
        const userInfo = wx.getStorageSync('userInfo')
        const data = {
            miniUserId: userInfo.miniUserId,
        };
        request({ url: "/user/queryInfo", method: "post", data }).then((result) => {
            this.setData({
                headUrl: result.data.headUrl,
                userName: result.data.name,
                type:result.data.type
            })
        })
    },  
    queryNotice() {
        request({ url: "/notice/query", method: "post" }).then((result) => {
            this.setData({
                notice: result.data
            })
        })
    },
    //建议
    handleTapSuggest() {
        wx.navigateTo({
            url: '/pages/user/suggest/index/index'
        });
    },   
     //收藏
    handleTapCollection() {
        wx.navigateTo({
            url: '/pages/user/collection/index'
        });
    },      
     //关注
     handleTapFocus() {
        wx.navigateTo({
            url: '/pages/user/focus/index'
        });
    },    
    //设置
    handleTapSetting() {
        wx.navigateTo({
            url: '/pages/user/setting/index'
        });
    },
});