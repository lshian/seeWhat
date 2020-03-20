//index.js

import { post } from '../../utils/request';
import api from '../../apis';
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
    wx.showLoading({ title: '加载中' })
    post(api.douban_detail, id, (detail) => {
      const detailInfo = {
        id: detail.id,
        title: detail.title,
        image: detail.images.small || detail.images.medium || detail.images.large,
        score: detail.rating.average.toFixed(2),
        star: String(detail.rating.average / 2).split('.').map(item => Number(item)),
        genres: detail.genres.join(' / '),
        tags: detail.tags,
        pubdates: detail.pubdates.join(' / '),
        summary: detail.summary,
        trailers: detail.trailers.map(item => ({
          id: item.id,
          title: item.title,
          subject_id: item.subject_id,
          iamge: item.small || item.medium,
          resource_url: item.resource_url,
        })),
        share_url: detail.share_url,
        photos: detail.photos,
        languages: detail.languages.join(' / '),
        durations: detail.durations.join(' / '),
        directors: detail.directors,
        casts: detail.casts.map(item => ({
          id: item.id,
          name: item.name,
          name_en: item.name_en,
          image: item.avatars.small || item.avatars.medium || item.avatars.large,
        })),
        bloopers: detail.bloopers.map(item => ({
          id: item.id,
          title: item.title,
          subject_id: item.subject_id,
          iamge: item.small || item.medium,
          resource_url: item.resource_url,
        })),
        alt: detail.alt,
        aka: detail.aka.join(' / '),
      }
      console.log(detailInfo);
      this.setData({ detailInfo }, () => wx.hideLoading());
    })
  },

  handleRouter: function (e) {
    console.log(e);
    wx.navigateTo({ url: '../webView/index' })
  }
})
