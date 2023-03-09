// pages/login/index.js
import { request } from "../../request/index.js";
import { login, getSetting } from "../../utils/asyncWx.js";
import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo.type == 1) {
      wx.redirectTo({
        url: '/pages/driven/index/index'
      });
    } else if (userInfo.type == 2) {
      wx.redirectTo({
        url: '/pages/goods_owner/index/index'
      });
    }
  },
  onChangecheckbox(event) {
    this.setData({
      checked: event.detail,
    });
  },
  onClickShowContent(e) {
    wx.navigateTo({
      url: '/pages/agreement/index?id='+e.currentTarget.dataset.id
    });
  },


  //获取用户登录信息
  //获取code,根据code获取openId
  //根据openId 去查询后台接口员工是否注册过
  //如果注册过了 更新接口并进入相对应得首页
  //如果没有注册过 选择语言 做新增操作 然后进入相对应得首页
  async handleGetUserInfo(e) {
    if(this.data.checked){
      const { code } = await login();
      const setting = await getSetting();
      const scopeUserInfo = setting.authSetting["scope.userInfo"];
      if (scopeUserInfo === false) return;
      try {
        request({ url: "/user/getSession?code=" + code }).then(
          (session) => {
            const openId = session.data.openId;
            const unionId = session.data.unionId;
            request({ url: "/user/checkRegister?openId=" + openId }).then(
              (checkRegister) => {
                const data = {
                  openId,
                  unionId
                };
                if (!checkRegister.data) {
                  const tempUserInfo = { data };
                  wx.setStorageSync("tempUserInfo", tempUserInfo);
                  wx.navigateTo({
                    url: '/pages/selectLang/index'
                  });
                } else {
                  request({ url: "/user/auth", method: "post", data }).then((miniUser) => {
                    const cacheUserInfo = miniUser.data;
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
              }
            )
          })
      } catch (err) {
        console.log(err)
      }
    }else{
      Toast("请同意用户协议和隐私政策");
    }
  },
})