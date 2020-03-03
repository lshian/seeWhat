//index.js

import { post } from '../../utils/request';
import { secondMinuteFormat } from '../../utils/utils';

Page({
  data: {
    detailInfo: {},
  },
  onLoad: function (options) {
    const info = JSON.parse(decodeURIComponent(options.info))
    this.fetchMovieInfo(info);
  },

  fetchMovieInfo: function (id) {
    post('Douban/detail', id, (detailInfo) => {
      this.setData({ detailInfo });
    })
  }
})
