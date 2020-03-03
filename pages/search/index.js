// pages/search/index.js

import { post } from '../../utils/request';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    history_list: [],
    keys_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchHotSearchKeys();
  },

  onShow: function () {
    const search_keys = wx.getStorageSync('search_keys');
    this.setData({ history_list: search_keys ? search_keys.split(',') : [] });
  },

  fetchHotSearchKeys: function () {
    post('Kaiyan/hot', null, (res) => {
      this.setData({ keys_list: res });
    })
  },

  /**
   * 返回上一页
   */
  handleGoBack: function () {
    wx.navigateBack()
  },

  handleSearch: function (e) {
    const value = typeof e === 'object' ? e.detail.value : e;
    const { history_list } = this.data;
    const search_keys = [...history_list];
    if (value) {
      if (history_list.indexOf(value) < 0) search_keys.splice(0, 0, value);
      wx.setStorageSync('search_keys', search_keys.join(','));

      wx.navigateTo({ url: `../videoList/index?query=${value}` })
    }
  },

  handleClickKey: function (e) {
    const { dataset: { text } } = e.currentTarget;
    this.setData({ key: text }, () => {
      this.handleSearch(text);
    });
  },

  /**
   * 清空搜索历史
   */
  handleClearHistory: function () {
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定清空全部历史记录？',
      success (res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'search_keys',
            success: (res) => {
              that.setData({ history_list: [] })
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})