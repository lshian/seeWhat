// pages/videoList/index.js

import { post } from '../../utils/request';
import api from '../../apis';
import { secondMinuteFormat, timeStampToFormat } from '../../utils/utils';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_path: '',
    history_list: [],
    isEnd: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { history } = options;
    this.setData({
      current_path: history,
    }, () => this.fetchVideoHistoryList());
  },

  fetchVideoHistoryList: function () {
    wx.showLoading({ title: '加载中' });
    const { current_path, history_list } = this.data;
    post(api.directrequest, current_path, (res) => {
      const { issueList } = res;
      if (issueList.length) {
        const { itemList, date } = issueList[0];
        const list = itemList.filter(item => item.type === 'video').map(item => ({
          id: item.data.id,
          playUrl: item.data.playUrl,
          url: item.data.cover.feed,
          title: item.data.title,
          author_title: `${item.data.author.name} / #${item.data.category}`,
          author_icon: item.data.author.icon,
          duration: secondMinuteFormat(item.data.duration),
        }))
        const current_list = {
          title: timeStampToFormat(date),
          list,
        };
        this.setData({
          history_list: [...history_list, current_list],
          current_path: res.nextPageUrl,
        }, () => wx.hideLoading());
      } else {
        this.setData({ isEnd: true }, () => wx.hideLoading());
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

  handleRouter:function(event) { // 跳转页面
    const { info } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../videoDetail/index?info=${JSON.stringify(info)}`
    })
  },

})