//index.js
//获取应用实例
const app = getApp()

import { requestUrl } from '../../config';

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    console.log(app);
    this.fetchHomeData();
  },
  
  fetchHomeData: function() {
    wx.request({
      url: `${requestUrl}/home/home`,
      data: {},
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log(res)
      },
      fail: () => {},
      complete: () => {}
    });
      
  }
})
