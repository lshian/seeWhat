//index.js

import { post } from '../../utils/request';
import api from '../../apis';
import { secondMinuteFormat } from '../../utils/utils';

Page({
  data: {
    imgShowHeight: 0,
    recommend_list: [],
    category_list: [],
    ranking_list: [],
    history: '',
  },
  onLoad: function (options) {
    this.fetchVideoCommend();
    this.fetchVideoCategory();
    this.fetchRankingList();
  },

  fetchVideoCommend: function () { // 获取每日推荐
    post(api.kaiyan_feed, null, (res) => {
      const { issueList } = res;
      if (issueList.length) {
        const { itemList } = issueList[0];
        const data = itemList.filter(item => item.type === 'video').map(item => ({
          id: item.data.id,
          playUrl: item.data.playUrl,
          url: item.data.cover.feed,
          title: item.data.title,
          author_title: `${item.data.author.name} / #${item.data.category}`,
          author_icon: item.data.author.icon,
          duration: secondMinuteFormat(item.data.duration),
        }))
        this.setData({
          recommend_list: data,
          history: res.nextPageUrl,
        });
      }
    });
  },

  fetchVideoCategory: function () {
    post(api.kaiyan_categories, null, (res) => {
      const response = [...res];
      const request = [];
      const mapCount = Math.ceil(res.length / 2);
      while(request.length < mapCount) {
        request.push(response.splice(0, 2));
      }
      this.setData({ category_list: request })
    })
  },

  fetchRankingList: function () {
    const params = 'strategy=weekly&num=5&start=0'
    post(api.kaiyan_ranking, params, (res) => {
      const { itemList = [] } =res;
      const list = itemList.map(item => ({
        id: item.data.id,
        playUrl: item.data.playUrl,
        url: item.data.cover.feed,
        title: item.data.title,
        author_title: `${item.data.author ? item.data.author.name : ''} #${item.data.category}`,
        duration: secondMinuteFormat(item.data.duration),
      }))
      this.setData({ ranking_list: list });
    })
  },

  /**
   * 设置swiper高度
   */
  imageLoad: function (e) {
    const windowWidth = wx.getSystemInfoSync().windowWidth - 30; // 图片显示宽度
    const { width, height } = e.detail;
    const imgShowHeight = windowWidth / width * height + 60;
    this.setData({ imgShowHeight });
  },

  /**
   * 跳转到列表
   */
  handleRouterList: function (e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `../videoList/index?id=${id}` })
  },

  handleSearch: function () {
    wx.navigateTo({ url: '../search/index' });
  },

  handleRouterHistory: function () {
    const { history } = this.data;
    wx.navigateTo({ url: `../videoHistory/index?history=${history}` });
  },

  handleRouterRank: function () {
    wx.navigateTo({ url: '../videoRank/index' });
  },

  handleRouterDetail: function (event) {
    const { info } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../videoDetail/index?info=${JSON.stringify(info)}`
    })
  }
})
