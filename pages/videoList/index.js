// pages/videoList/index.js

import { post } from '../../utils/request';
import { secondMinuteFormat } from '../../utils/utils';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 20,
    start: 0,
    query: '',
    video_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { query } = options;
    this.setData({ query }, () => this.fetchVideoList());
  },

  fetchVideoList: function () {
    wx.showLoading({ title: '加载中' })
    const { num, start, video_list, query } = this.data;
    const params = `num=${num}&start=${start}&query=${query}`
    post('Kaiyan/search', params, (res) => {
      const { itemList } = res;
      const list = [];
      itemList.map(item => {
        if (item.type === 'video') {
          list.push({
            id: item.data.id,
            playUrl: item.data.playUrl,
            url: item.data.cover.feed,
            title: item.data.title,
            author_title: `${item.data.author ? item.data.author.name : ''} #${item.data.category}`,
            duration: secondMinuteFormat(item.data.duration),
          }) 
        }
      })
      this.setData({
        video_list: [ ...video_list, ...list ],
      }, () => wx.hideLoading());
    })
  },

  addVideoList: function () {
    const { num, start } = this.data;
    this.setData({
      start: start + num,
    }, () => this.fetchVideoList());
  },

  handleRouter:function(event) { // 跳转页面
    const { info } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../videoDetail/index?info=${JSON.stringify(info)}`
    })
  },

})