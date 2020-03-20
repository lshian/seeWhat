//index.js

import { post } from '../../utils/request';
import api from '../../apis';
import { secondMinuteFormat } from '../../utils/utils';

Page({
  data: {
    count: 30,
    current: 0,
    isEnd: false,
    playInfoList: [
      { title: '正在热映', start: 0, path: api.douban_theaters, list: [] },
      { title: '即将上映', start: 0, path: api.douban_soon, list: [] },
      { title: '高分榜单', start: 0, path: api.douban_top250, list: [] },
    ],
  },
  onLoad: function (options) {
    this.fetchHotPlay();
  },

  fetchHotPlay: function () {
    wx.showLoading({ title: '加载中' });
    const { count, current, playInfoList } = this.data;
    const params = `start=${playInfoList[current].start}&count=${count}`
    post(playInfoList[current].path, params, (res) => {
      if (!res.subjects.length) this.setData({ isEnd: true });
      else {
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
        this.setData({ playInfoList });
      }
      wx.hideLoading();
    })
  },

  additionalMovies: function () {
    const {
      playInfoList,
      current,
      count,
      isEnd,
    } = this.data;
    const new_playInfoList = [ ...playInfoList ];
    if (!isEnd) {
      new_playInfoList[current].start += count;
      this.setData({
        playInfoList: new_playInfoList
      }, this.fetchHotPlay());
    }
  },

  handleChangeTitle: function (event) {
    const { currentTarget: { dataset: { index = 0 } } } = event;
    this.setData({
      current: index,
      isEnd: false,
    });
  },

  handleChangeMovieType: function (e) {
    const { detail: { current } } = e;
    this.setData({
      current,
      isEnd: false,
    });
  },

  handleRouter:function(event) { // 跳转页面
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../movieDetail/index?info=${id}`
    })
  },
})
