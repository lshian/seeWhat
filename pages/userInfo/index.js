//index.js
//获取应用实例
const app = getApp()

import { post, get } from '../../utils/request';
import { secondMinuteFormat, getDateAndWeek } from '../../utils/utils';

import { requestUrl } from '../../config';

Page({
  data: {
    userInfo: {
      avatarUrl: '../../public/images/avatar.png',
    },
    openid: '',
    session_key: '',
    operList: [
      { title: '我的分享', },
      { title: '我的下载', },
      { title: '观看记录', }
    ]
  },
  onLoad: function () {

  },

  getUserInfo: function () {
    wx.getUserInfo({
      success: (res) => {
        console.log(res);
        this.setData({ userInfo: res.userInfo })
      }
    })
  }
})
