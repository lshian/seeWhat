//index.js

import { post } from '../../utils/request';
import api from '../../apis';
import { secondMinuteFormat } from '../../utils/utils';

Page({
  data: {
    detailInfo: {},
    current: {},
    video_list: {},
    showPlay: false
  },
  onLoad: function (options) {
    const info = JSON.parse(decodeURIComponent(options.info))
    this.fetchMovieInfo(info);
  },

  fetchMovieInfo: function (id) {
    wx.showLoading({ title: '加载中' })
    post(api.douban_detail, id, (detail) => {
      const { images = {} } = detail;
      const detailInfo = {
        id: detail.id,
        title: detail.title,
        image: images.small || images.medium || images.large,
        score: detail.rating.average.toFixed(2),
        star: String(detail.rating.average / 2).split('.').map(item => Number(item)),
        genres: detail.genres.join(' / '),
        tags: detail.tags,
        pubdates: detail.pubdates.join(' / '),
        summary: detail.summary,
        videos: [
          ...detail.trailers.map(item => ({
          id: item.id,
          title: item.title,
          subject_id: item.subject_id,
          iamge: item.medium || item.small,
          resource_url: item.resource_url,
        })),
        ...detail.bloopers.map(item => ({
          id: item.id,
          title: item.title,
          subject_id: item.subject_id,
          iamge: item.medium || item.small,
          resource_url: item.resource_url,
        }))
      ],
        share_url: detail.share_url,
        photos: detail.photos,
        languages: detail.languages.join(' / '),
        durations: detail.durations.join(' / '),
        directors: detail.directors,
        casts: detail.casts.map(item => {
          const { avatars } = item;
          const image = avatars
            ? (avatars.small || avatars.medium || avatars.large)
            : '../../public/images/avatar.png';
          return {
            id: item.id,
            name: item.name || '--',
            name_en: item.name_en || '--',
            image,
          }
        }),
        alt: detail.alt,
        aka: detail.aka.join(' / '),
        popular_comments: detail.popular_comments,
      }
      
      this.setData({
        current: {
          index: 0,
          title: detailInfo.videos[0].title,
          image: detailInfo.videos[0].iamge,
          url: detailInfo.videos[0].resource_url
        },
        video_list: detailInfo.videos,
        detailInfo,
      }, () => wx.hideLoading());
    })
  },

  handleSeeImage: function (event) {
    const { currentTarget: { dataset: { url }} } = event;
    const { detailInfo: { photos = [] } } = this.data;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: photos.map(item => item.image), // 需要预览的图片http链接列表
    })
  },

  handleHidePlay: function (e) { // 隐藏播放控件
    this.setData({ showPlay: false })
  },
  handleShowPlay: function (e) { // 展示播放控件
    const { currentTarget: { dataset } } = e;
    const { index, info } = dataset;
    this.setData({
      showPlay: true,
      current: {
        index: index,
        title: info[index].title,
        image: info[index].iamge,
        url: info[index].resource_url
      },
    })
  },

  changePlayInfo: function () { // 播放到末尾事
    const { current, video_list } = this.data;
    const index = current.index + 1;
    const new_current = video_list[index] ? {
      index: index,
      title: video_list[index].title,
      image: video_list[index].iamge,
      url: video_list[index].resource_url
    } : {};
    this.setData({ current: new_current });
  }
})
