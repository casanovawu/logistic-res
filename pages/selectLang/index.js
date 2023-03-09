import { request } from "../../request/index.js";
import { login, getSetting } from "../../utils/asyncWx.js";
import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */

  data: {
    showLang: false,
    showType: false,
    langValue: "中文",
    typeValue: "司机",
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
    avatarUrl: "",
    userName: "",
  },
  //防抖动
  TimeId: -1,
  langCode: "chinese",
  typeCode: 1,
  headImg: "",

  onCloseLang() {
    this.setData({ showLang: false });
  },
  onCloseType() {
    this.setData({ showType: false });
  },
  onSelectLang(event) {
    this.langCode = event.detail.code
    this.setData({
      langValue: event.detail.name,
    })
  },
  onSelectType(event) {
    this.typeCode = event.detail.code
    this.setData({
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
  onChooseAvatar(e) {
    console.log(e.detail)
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl,
    })
  },
  onUserNameChange(e) {
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.setData({
        userName: e.detail
      })
    }, 10);
  },
  handleConfirmSelect() {
    if (this.data.userName == "") {
      Toast.fail("昵称不能为空");
    } else if (this.data.avatarUrl == "") {
      Toast.fail("头像不能为空");
    } else {
      if (this.data.avatarUrl.slice(0, 10) == "http://tmp" || this.data.avatarUrl.slice(0, 9) == "wxfile://") {
        this.uploadFile(this.data.avatarUrl)
      } else {
        this.headImg = this.data.avatarUrl
        this.handleConfirmSelectAfter()
      }
    }
  },

  handleConfirmSelectAfter() {
    const tempUserInfo = wx.getStorageSync("tempUserInfo");
    const data = {
      headPic: this.headImg,
      sex: tempUserInfo.data.sex,
      userName: this.data.userName,
      language: this.langCode,
      type: this.typeCode,
      openId: tempUserInfo.data.openId,
      unionId: tempUserInfo.data.unionId
    };
    request({ url: "/user/auth", method: "post", data }).then((miniUser) => {
      const cacheUserInfo = miniUser.data;
      wx.setStorageSync("userInfo", cacheUserInfo);
      wx.removeStorageSync("tempUserInfo");
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
  },
  uploadFile(path) {
    wx.uploadFile({
      url: 'https://huoyun.xxtcw.cn/mini/web/picture/uploadHead',
      filePath: path,
      header: {
        "content-type": "multipart/form-data"
      },
      name: 'file',
      success: res => {
        const result = JSON.parse(res.data)
        this.headImg = result.data
        this.handleConfirmSelectAfter()
      },
    });
  }
})