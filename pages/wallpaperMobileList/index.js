//index.js

import { post } from '../../utils/request';

Page({
  data: {
    skip: 0,
    limit: 30,
    fetchId: '',
    paper_list: [],
  },
  onLoad: function (options) {
    this.setData({
      fetchId: options.info,
    }, () => this.fetchList());
  },

  fetchList: function () {
    wx.showLoading({ title: '加载中' })
    const { skip, limit, fetchId } = this.data;
    const params = `${fetchId}/vertical?skip=${skip}&limit=${limit}`;
    post('Wallpapermobile/paper_list', params, (res) => {
      const { vertical } = res.res;
      const { paper_list } = this.data;
      this.setData({ paper_list: [...paper_list, ...vertical] }, () => wx.hideLoading());
    })
  },

  addPaperList: function () {
    const { skip, limit } = this.data;
    this.setData({
      skip: skip + limit,
    }, () => this.fetchList());
  },

  handleSeeImage: function(event) {
    const { currentTarget: { dataset: { url }} } = event;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url], // 需要预览的图片http链接列表
    })
  },
})
