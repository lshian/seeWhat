// pages/videoList/index.js

import { post } from '../../utils/request';
import api from '../../apis';
import { secondMinuteFormat } from '../../utils/utils';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgShowHeight: 0,
    num: 10,
    start: 0,
    current: 0,
    rank_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchVideoRankInfo();
  },

  fetchVideoRankInfo: function () {
    post(api.kaiyan_rankList, null, (res) => {
      const { tabInfo: { tabList = [] } } = res;
      this.setData({
        rank_list: tabList.map((item, index) => ({
          name: item.name,
          list: [],
          index,
          apiUrl: item.apiUrl,
          isEnd: false,
        })),
      }, () => this.fetchVideoRankList());
    });
  },

  fetchVideoRankList: function () {
    wx.showLoading({ title: '加载中' });
    const {
      num,
      start,
      rank_list,
      current,
    } = this.data;
    const params = `${rank_list[current].apiUrl}&start=${start}&num=${num}`
    post(api.directrequest, params, (res) => {
      const { itemList } = res;
      if (!itemList.length) {
        rank_list[current].isEnd = true;
        this.setData({ rank_list }, () => wx.hideLoading());
      } else {
        const data = itemList.filter(item => item.type === 'video').map(item => ({
          id: item.data.id,
          playUrl: item.data.playUrl,
          url: item.data.cover.feed,
          title: item.data.title,
          author_title: `${item.data.author.name} / #${item.data.category}`,
          author_icon: item.data.author.icon,
          duration: secondMinuteFormat(item.data.duration),
        }))
        rank_list[current].list.push(...data);
        this.setData({
          rank_list,
        }, () => wx.hideLoading());
      }
    });
  },

  additionalVideos: function () {
    const { num, start, current, rank_list } = this.data;
    if (!rank_list[current].isEnd) {
      this.setData({
        start: start + num,
      }, () => this.fetchVideoRankList());
    }
  },

  handleChangeTitle: function (event) {
    const { currentTarget: { dataset: { index = 0 } } } = event;
    this.setData({ current: index });
  },

  handleChangeVideoType: function (e) {
    const { rank_list } = this.data;
    const { detail: { current } } = e;
    this.setData({ current }, () => {
      if (!rank_list[current].list.length) this.fetchVideoRankList();
    });
  },

  /**
   * 设置swiper高度
   */
  imageLoad: function (e) {
    const windowWidth = wx.getSystemInfoSync().windowWidth - 30; // 图片显示宽度
    const { width, height } = e.detail;
    const imgShowHeight = windowWidth / width * height + 60;
    console.log(imgShowHeight);
    this.setData({ imgShowHeight });
  },

  handleRouter:function(event) { // 跳转页面
    const { info } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../videoDetail/index?info=${JSON.stringify(info)}`
    })
  },

})