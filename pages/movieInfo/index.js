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
      {
        title: '正在热映',
        start: 0,
        path: api.douban_theaters,
        list: [],
        isEnd: false
      },
      {
        title: '即将上映',
        start: 0,
        path: api.douban_soon,
        list: [],
        isEnd: false
      },
      {
        title: '高分榜单',
        start: 0,
        path: api.douban_top250,
        list: [],
        isEnd: false
      },
    ],
  },
  onLoad: function (options) {
    this.fetchMoviePlay();
  },

  fetchMoviePlay: function () {
    wx.showLoading({ title: '加载中' });
    const { count, current, playInfoList } = this.data;
    const params = `start=${playInfoList[current].start}&count=${count}`
    post(playInfoList[current].path, params, (res) => {
      if (!res.subjects.length) {
        const new_playInfoList = [...playInfoList];
        new_playInfoList[current].isEnd = true;
        this.setData({ playInfoList: new_playInfoList });
      } else {
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
    } = this.data;
    const new_playInfoList = [ ...playInfoList ];
    if (!playInfoList[current].isEnd) {
      new_playInfoList[current].start += count;
      this.setData({
        playInfoList: new_playInfoList
      }, () => this.fetchMoviePlay());
    }
  },

  handleChangeTitle: function (event) {
    const { currentTarget: { dataset: { index = 0 } } } = event;
    this.setData({ current: index });
  },

  handleChangeMovieType: function (e) {
    const { playInfoList } = this.data;
    const { detail: { current } } = e;
    this.setData({ current }, () => {
      if (!playInfoList[current].list.length) this.fetchMoviePlay();
    });
  },

  handleRouter:function(event) { // 跳转页面
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../movieDetail/index?info=${id}`
    })
  },
})
