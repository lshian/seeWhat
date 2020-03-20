//index.js
//获取应用实例
const app = getApp()

import { post } from '../../utils/request';
import api from '../../apis';
import { secondMinuteFormat, getDateAndWeek } from '../../utils/utils';

Page({
  data: {
    default: '../../public/images/default.png',
    windowWidth: wx.getSystemInfoSync().windowWidth,
    titleScroll: 0,
    page: 1,
    count: 20,
    current_id: '',
    current_index: 0,
    prev_index: 0,
    newsInfoList: [],
    list: [],
  },
  onLoad: function (options) {
    this.fetchNewsClass();
  },

  fetchNewsClass: function () {
    post(api.toutiao_newsClass, null, (res) => {
      const { showapi_res_body: { channelList } } = res;

      const newsInfoList = channelList.map(item => ({ ...item, list: [] }))
      this.setData({ newsInfoList }, () => this.fetchNewsInfo());
    })
  },

  fetchNewsInfo: function () {
    wx.showLoading({ title: '加载中' })
    const { count, page, newsInfoList, current_index, titleScroll } = this.data;
    const channelId = newsInfoList[current_index].channelId;
    const params = `/newsList?channelId=${channelId}&maxResult=${count}&page=${page}`;

    post(api.toutiao_newsInfo, params, (res) => {
      const list = res.showapi_res_body ? res.showapi_res_body.pagebean.contentlist : [];
      if (list.length > 0) newsInfoList[current_index].list.push(...list);
      else newsInfoList[current_index].isNoData = true;
      this.setData({ newsInfoList }, () => wx.hideLoading());
    })
  },

  setTitleScroll: function (offsetLeft) { // 设置菜单位置
    const { windowWidth } = this.data;
    this.setData({ titleScroll: offsetLeft - windowWidth / 3 });
  },

  additionalNews: function () {
    const { page } = this.data;
    this.setData({ page: page + 1 }, () => this.fetchNewsInfo());
  },

  handleSelectId: function (e) {
    const { currentTarget: { dataset: { index: current_index }, offsetLeft } } = e;
    const { newsInfoList, count } = this.data;
    const { length } = newsInfoList[current_index].list;
    this.setTitleScroll(offsetLeft);
    if (length > 0) { // 是否存在数据
      const next_page = length / count;
      this.setData({ page: next_page, current_index });
    } else {
      this.setData({ page: 1, current_index }, () => this.fetchNewsInfo());
    }
  },

  handleRouter:function(event) { // 跳转页面
    const { info } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../newsDetail/index?info=${encodeURIComponent(JSON.stringify(info))}`
    })
  },
})
