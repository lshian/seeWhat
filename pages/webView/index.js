//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    url: '',
  },
  onLoad: function (info) {
    const url = JSON.parse(decodeURIComponent(info))
    this.setData({ url });
  }
})
