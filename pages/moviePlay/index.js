//index.js

import { post } from '../../utils/request';
import api from '../../apis';
import { secondMinuteFormat } from '../../utils/utils';

Page({
  data: {
    current: {
      index: 0,
      title: '',
      image: '',
      url: '',
    },
    video_list: {},
  },
  onLoad: function (options) {
    const info = JSON.parse(decodeURIComponent(options.info))
    const { index = 0, videos = [] } = info;
    this.setData({
      current: {
        index: index,
        title: videos[index].title,
        image: videos[index].iamge,
        url: videos[index].resource_url
      },
      video_list: videos,
    });
  }
})
