//index.js

Page({
  data: {
    detail: {},
  },
  onLoad: function (options) {
    const info = JSON.parse(decodeURIComponent(options.info))
    this.setData({ detail: info });
  },
})
