import {storeBindingsBehavior} from 'mobx-miniprogram-bindings'
import {store} from "../store/store" 

Page({
    behaviors:[storeBindingsBehavior],
    storeBindings:{
        //数据源
        store,
        fields:{
            tarbarList:'tarbarList'
        },
    },
    data: {
        active: 0
    },
    onChangeTabbar(event) {
        this.setData({ active: event.detail });
        wx.switchTab({
            url: this.data.tarbarList[event.detail].url
        });
    },
    initTarBar() {
        const page = getCurrentPages().pop();
        this.setData({
            active: this.data.tarbarList.findIndex(item => item.url === `/${page.route}`)
        });
    }
})

