import { request } from "../../../../request/index.js";
import { pageModule } from '../../../../utils/common';
import Toast from '@vant/weapp/toast/toast';

Page({

    pageId: 8,
    /**
     * 页面的初始数据
     */
    data: {
        fileList: [],
        pageModuleMap: {},
        pictureIdList: [],
        label: "123123",
        placeholder: '',
    },
    //防抖动
    TimeId: -1,

    orderId: {},
    type: {},
    content: '',
    contactName: '',
    contactPhone: '',
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        pageModule.queryPageModule(this.pageId).then((pageModuleMap) => {
            this.setData({
                pageModuleMap: pageModuleMap
            })
        });
        const { orderId } = options;
        const { type } = options;
        this.orderId = orderId;
        this.type = type;
        let page_bar_title = ''
        if (type == 1) {
            page_bar_title = '服务投诉'
            this.setData({
                label: '投诉内容',
                placeholder: '输入10字以上的投诉内容,详细描述货主给你带来的问题,以便我们为你提供更好的帮助'
            })
        }
        if (type == 2) {
            page_bar_title = '功能异常'
            this.setData({
                label: '反馈内容',
                placeholder: '输入10字以上的反馈内容,以便我们为你提供更好的帮助'
            })
        }
        if (type == 3) {
            page_bar_title = '新功能建议'
            this.setData({
                label: '建议内容',
                placeholder: '输入10字以上的建议内容,以便我们为你提供更好的帮助'
            })
        }
        if (type == 4) {
            page_bar_title = '违规举报'
            this.setData({
                label: '举报内容',
                placeholder: '输入10字以上的违规举报内容,详细描述货主给你带来的问题,以便我们为你提供更好的帮助'
            })
        }
        wx.setNavigationBarTitle({
            title: page_bar_title
        })
    },
    afterRead(event) {
        const { file } = event.detail;
        const userInfo = wx.getStorageSync('userInfo')
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
            url: 'https://huoyun.xxtcw.cn/mini/web/picture/upload', 
            filePath: file.url,
            name: 'file',
            formData: { miniUserId: userInfo.miniUserId },
            success: res => {
                const result = JSON.parse(res.data)
                const { fileList = [] } = this.data;
                fileList.push({ ...file, url: result.data.url });
                this.setData({ fileList });
                this.setData({
                    pictureIdList: [...this.data.pictureIdList, result.data.id]
                });
            },
        });
    },
    // 删除图片
    deleteImg: function (e) {
        const idx = e.detail.index
        // 获取图片索引
        const pictureId = this.data.pictureIdList[idx];
        const data = {
            id: pictureId
        };
        this.data.fileList.splice(idx, 1);
        this.setData({
            fileList: this.data.fileList
        })
        request({ url: "/picture/delete", method: "post", data }).then(() => {
        }).catch((err) => { console.log(err); Toast.fail(err); });
        this.data.pictureIdList.splice(idx, 1);
        this.setData({
            pictureIdList: this.data.pictureIdList
        })
    },
    changeContactName(e) {
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.contactName = e.detail
        }, 10);
    },
    changeContactPhone(e) {
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.contactPhone = e.detail
        }, 10);
    },
    changeContent(e) {
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.content = e.detail
        }, 10);
    },
    //提交
    handleSubmit() {
        const userInfo = wx.getStorageSync("userInfo");
        const data = {
            miniSuggestUserId: userInfo.miniUserId,
            orderId: this.orderId,
            type: this.type,
            content: this.content,
            contactName: this.contactName,
            contactPhone: this.contactPhone,
            pictureList: this.data.pictureIdList
        };
        request({ url: "/suggest/submit", method: "post", data }).then(() => {
            if(userInfo.type==1){
                wx.switchTab({
                    url: '/pages/driven/index/index'
                });
            }else if(userInfo.type==2){
                wx.switchTab({
                    url: '/pages/goods_owner/index/index'
                });
            }
        }).catch((err) => { console.log(err); Toast.fail(err); });
    },
})