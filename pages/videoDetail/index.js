//index.js

import { post } from '../../utils/request';
import api from '../../apis';
import { secondMinuteFormat } from '../../utils/utils';

Page({
  data: {
    detail: {},
    autoplay: false,
    recommend: [],
  },
  onLoad: function (options) {
    const info = JSON.parse(decodeURIComponent(options.info))
    this.fetchDetail(info);
    this.fetchRecommend(info);
  },

  fetchDetail: function (id) {
    post(api.kaiyan_detail, id, (res) => { // 获取视频详情
      res.duration = secondMinuteFormat(res.duration);
      this.setData({ detail: res });
    });
  },

  fetchRecommend: function (id) {
    const params = `${id}?num=10`;
    post(api.kaiyan_related, params, (res) => { // 获取推荐视频
      const { videoList } = res;
      const recommend = videoList.map(item => ({
        id: item.id,
        playUrl: item.playUrl,
        url: item.coverForDetail,
        title: item.title,
        author_title: `${item.author.name} #${item.category}`,
        duration: secondMinuteFormat(item.duration),
      }));
      this.setData({ recommend });
    });
  },

  handleHideDialog: function () {
    this.setData({ showDialog: false });
  },

  handleRouter:function(event) { // 跳转页面
    const { info } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../videoDetail/index?info=${JSON.stringify(info)}`
    })
  },
})
