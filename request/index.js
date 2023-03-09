let ajaxTimes = 0

export const request = (params) => {
  ajaxTimes++;
  //显示加载中 效果
  wx.showLoading({
    title: "加载中",
  });
  const userInfo = wx.getStorageSync('userInfo')
  const header={
    "Accept-Language":userInfo.language || "chinese"
  }
  if (params.method == 'post') {
    if (params.paginationDTO) {
      params.data = {
        reqDtos: params.data || {},
        paginationDTO: params.paginationDTO
      }
    } else {
      params.data = {
        reqDtos: params.data || {},
      }
    }
  }

  // 定义公共的url
  //const baseUrl = "http://127.0.0.1:8092/mini/web";
  //方便真机调试
  //const baseUrl = "http://192.168.0.111:8092/mini/web";
  //正式环境
  const baseUrl = "https://huoyun.xxtcw.cn/mini/web";


  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header:header,
      url: baseUrl + params.url,
      success: (result) => {
        if (!result.data.hasError) {
          resolve(result.data);
        } else {
          reject(result.data.errorMessage);
        }
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading();
        }
      }
    });
  })
}


