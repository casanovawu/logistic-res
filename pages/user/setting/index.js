import { request } from "../../../request/index.js";
import { pageModule } from '../../../utils/common';

Page({

    pageId: 9,
    /**
     * 页面的初始数据
     */
    data: {
        showLang: false,
        showType: false,
        type:{},
        phone: '',
        langValue: "",
        typeValue: "",
        placeholder:"",
        actionsLang: [
            {
                name: '中文',
                code: 'chinese'
            }/* ,
            {
                name: '维语',
                code: 'english'
            } */
        ],
        actionsType: [
            {
                name: '司机',
                code: '1',
            },
            {
                name: '货主',
                code: '2',
            }
        ],
    },
    //防抖动
    TimeId: -1,
    lang:'',

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
    onShow() {
        this.queryUserInfo();
    },
    queryUserInfo() {
        const userInfo = wx.getStorageSync("userInfo");
        const data = {
            miniUserId: userInfo.miniUserId,
        };
        request({ url: "/user/queryInfo", method: "post", data }).then((result) => {
            if (result.data.type == 1) {
                this.setData({
                    placeholder: '请输入手机号(方便司机联系)'
                })
            }
            if (result.data.type == 0) {
                this.setData({
                    placeholder: '请输入手机号'
                })
            }
            this.setData({
                type: result.data.type,
                phone: result.data.phone,
                langValue: result.data.languageName,
                typeValue: result.data.typeName,
            })
            this.lang=result.data.language
        })
    },
    onCloseLang() {
        this.setData({ showLang: false });
    },
    onCloseType() {
        this.setData({ showType: false });
    },
    onSelectLang(event) {
        this.lang = event.detail.code
        this.setData({
            langValue: event.detail.name,
        })
    },
    onSelectType(event) {
        this.setData({
            type: event.detail.code,
            typeValue: event.detail.name,
        })
    },
    handleSelectLang() {
        this.setData({
            showLang: true
        })
    },
    handleSelectType() {
        this.setData({
            showType: true
        })
    },
    changePhone(e) {
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.data.phone = e.detail
        }, 10);
    },
    handleConfirmUpdate() {
        const userInfo = wx.getStorageSync("userInfo");
        const data = {
            miniUserId: userInfo.miniUserId,
            language: this.lang,
            type: this.data.type,
            phone: this.data.phone
        };
        request({ url: "/user/update", method: "post", data }).then((miniUser) => {
            const cacheUserInfo = miniUser.data;
            wx.removeStorageSync("userInfo");
            wx.setStorageSync("userInfo", cacheUserInfo);
            if (cacheUserInfo.type == 1) {
                wx.switchTab({
                    url: '/pages/driven/index/index'
                });
            } else {
                wx.switchTab({
                    url: '/pages/goods_owner/index/index'
                });
            }
        });
    }
})