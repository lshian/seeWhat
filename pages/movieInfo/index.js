//index.js

import { post } from '../../utils/request';
import { secondMinuteFormat } from '../../utils/utils';

Page({
  data: {
    count: 30,
    current: 0,
    playInfoList: [
      { title: '正在热映', start: 0, path: 'theaters', list: [] },
      { title: '即将上映', start: 0, path: 'soon', list: [] },
      { title: '高分榜单', start: 0, path: 'top250', list: [] },
    ],
  },
  onLoad: function (options) {
    this.fetchHotPlay();
  },

  fetchHotPlay: function () {
    wx.showLoading({ title: '加载中' });
    const { count, current, playInfoList } = this.data;
    const params = `start=${playInfoList[current].start}&count=${count}`
    post(`Douban/${playInfoList[current].path}`, params, (res) => {
      const subjects = res.subjects.map(item => {
        const casts = item.casts.map(c => c.name);
        return {
          id: item.id,
          genres: item.genres.join(' | '),
          title: item.title,
          score: item.rating.average.toFixed(1),
          rating: item.rating,
          images: item.images.medium,
          pubdates: item.pubdates.join(' '),
          casts: casts.join(' '),
          year: item.year,
        }
      })
      playInfoList[current].list.push(...subjects);
      console.log(playInfoList);
      this.setData({ playInfoList }, () => wx.hideLoading());
    })
  }
})
