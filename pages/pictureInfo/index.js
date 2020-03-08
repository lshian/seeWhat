//index.js

import { post } from '../../utils/request';
import { secondMinuteFormat } from '../../utils/utils';

Page({
  data: {
    start: 0,
    count: 20,
    current: 0,
    is_open: false,
    category_list: [],
    picture_list: [],
  },
  onLoad: function (options) {
    this.fetchPictureInfo();
  },

  fetchPictureInfo: function () {
    const params = 'c=WallPaperAndroid&a=getAllCategories';
    post('Wallpaper360/index', params, (res) => {
      const picture_list = res.data.map((item) => ({ ...item, list: [], start: 0 }));
      this.setData({ picture_list }, () => {
        this.fetchPictureList(res.data[0].id);
      });
    })
  },

  fetchPictureList: function (cid) {
    wx.showLoading({ title: '加载中' })
    const { start, count, picture_list } = this.data;
    const params = `c=WallPaper&a=getAppsByCategory&cid=${cid}&start=${start}&count=${count}`;
    post('Wallpaper360/index', params, (res) => {
      const data = res.data.map(item => ({
        ...item,
        title: item.tag.replace(/_/g, '').replace(/category/g, '').replace(/全部/g, ''),
      }))
      picture_list.map(item => {
        if (data[0].class_id && data[0].class_id === item.id) {
          item.list = [...item.list, ...data];
        }
      });
      this.setData({ picture_list }, () => wx.hideLoading());
    })
  },

  handleShowBox: function () {
    const { is_open } = this.data;
    this.setData({ is_open: !is_open });
  },

  handleHideBox: function () {
    this.setData({ is_open: false });
  },

  handleSelect: function (event) {
    const { picture_list } = this.data;
    const { dataset: { index, info } } = event.currentTarget;
    this.setData({ current: index }, () => {
      this.handleHideBox();
      const currentInfo = picture_list.find(item => item.id === info.id);
      const { list = [] } = currentInfo;
      if (!list.length) this.fetchPictureList(picture_list[index].id);
    });
  },

  addPicList: function () {
    const { count, start, picture_list, current } = this.data;
    this.setData({
      start: start + count,
    }, () => this.fetchPictureList(picture_list[current].id));
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
})
