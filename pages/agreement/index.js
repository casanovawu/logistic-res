import { request } from "../../request/index.js";

Page({
    data: {
        content:"",
      },

      onLoad(options) {
        const { id } = options;
        this.queryAgreement(id);
      },
      queryAgreement(id) {
        const data = id;
        request({ url: "/agreement/query", method: "post", data }).then((result) => {
            this.setData({
              content:result.data.text
            }) 
            wx.setNavigationBarTitle({
                title: result.data.name || ""
            })
        })
    }, 

})