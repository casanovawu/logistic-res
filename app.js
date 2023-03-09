// app.js
App({
    appTimeId: -1,

    onLaunch() {
        this.updateManager()
    },

    /** updateManager 检测升级 */
    updateManager() {
        let startParamObj = wx.getLaunchOptionsSync();
        if (wx.canIUse('getUpdateManager') && startParamObj.scene != 1154) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function (res) {
                        this.appTimeId = setTimeout(() => {
                            wx.showModal({
                                title: '更新提示',
                                content: '发现新版本，是否重启应用?',
                                success(res) {
                                    if (res.confirm) {
                                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                        updateManager.applyUpdate()
                                    }
                                }
                            })
                        }, 300);
                    })
                }
            })
            // 新的版本下载失败
            updateManager.onUpdateFailed(function () {
                this.appTimeId = setTimeout(() => {
                    wx.showModal({
                        title: '发现新版本',
                        content: '请删除当前小程序，重启搜索打开...',
                        success(res) {
                            if (res.confirm) {
                                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                updateManager.applyUpdate()
                            }
                        }
                    })
                }, 300);
            })
        }
    },

    globalData: {

    }
})
