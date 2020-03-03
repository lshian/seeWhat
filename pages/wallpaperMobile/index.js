//index.js

import { post } from '../../utils/request';

const initData = {
  navbar: [
    { number: 0, title: '最新' },
    { number: 1, title: '最热' },
    { number: 2, title: '分类' },
  ],
  current_index: 0, // 默认第几屏
  limit: 30, // 每次加载张数
  iconClass: ['one', 'two', 'three'],
  category: [],
  new_info: { skip: 0, list: []},
  hot_info: { skip: 0, current: 0, list: []},
};

Page({
  data: { ...initData },
  onLoad: function () {
    this.fetchNew();
    this.fetchHot();
    this.fetchCategory();
  },

  // onPullDownRefresh: function() {
  //   setTimeout(() => {
  //     this.setData({ ...initData }, () => {
  //       this.fetchNew();
  //       this.fetchHot();
  //       this.fetchCategory();
  //       // 停止下拉动作
  //       wx.stopPullDownRefresh();
  //     });
  //   }, 1500);
  // },

  fetchCategory: function () {
    post('WallpaperMobile/category', null, (res) => { // 获取壁纸分类
      const { category } = res.res;
      this.setData({ category });
    });
  },

  fetchNew: function () {
    wx.showLoading({ title: '加载中' })
    const { new_info, limit } = this.data;
    const params = `order=new&skip=${new_info.skip}&limit=${limit}`;
    post('WallpaperMobile/hot_new', params, (res) => { // 获取最新壁纸
      const { vertical } = res.res;
      this.setData({
        new_info: {
          ...new_info,
          list: [ ...new_info.list, ...vertical ],
        },
      }, () => wx.hideLoading());
    })
  },

  fetchHot: function () {
    wx.showLoading({ title: '加载中' })
    const { hot_info, limit } = this.data;
    const params = `order=hot&skip=${hot_info.skip}&limit=${limit}`;
    post('WallpaperMobile/hot_new', params, (res) => { // 获取最热壁纸
      const { vertical } = res.res;
      this.setData({
        hot_info: {
          ...hot_info,
          list: [ ...hot_info.list, ...vertical ],
        }
      }, () => wx.hideLoading());
    })
  },

  handleSelectNavBar: function (event) {
    const { index } = event.currentTarget.dataset;
    this.setData({ current_index: index });
  },

  handleChangeSwiper: function (event) {
    const { current } = event.detail
    this.setData({ current_index: current });
  },

  handleChangeNewOrHot: function (event) { // 滚动最新壁纸swipe
    const {
      currentTarget: { dataset: { type } },
      detail: { current },
    } = event;
    const { new_info, hot_info, limit } = this.data;
    const new_remain = new_info.list.length - current;
    const hot_remain = hot_info.list.length - current;
    if (type === 'new' && new_remain <= 5) {
      this.setDataNew(new_info, new_info.skip + limit, current);
    }
    if (type === 'hot' && hot_remain <= 5) {
      this.setDataHot(hot_info, hot_info.skip + limit, current);
    }
  },

  setDataNew: function (new_info, skip, current) {
    this.setData({
      new_info: { ...new_info, current, skip },
    }, () => this.fetchNew());
  },

  setDataHot: function (hot_info, skip, current) {
    this.setData({
      hot_info: { ...hot_info, current, skip },
    }, () => this.fetchHot());
  },

  /**
   * 图片壁纸点击事件
   */
  handleSeeImage: function(event) {
    const { currentTarget: { dataset: { url }} } = event;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url], // 需要预览的图片http链接列表
    })
  },

  handleRouter: function (event) {
    const { info } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../wallpaperMobileList/index?info=${info.id}`
    })
  }
})
