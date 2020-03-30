//index.js
//获取应用实例
const app = getApp()

import { post } from '../../utils/request';
import api from '../../apis';
import { secondMinuteFormat, getDateAndWeek } from '../../utils/utils';

const initData = {
  dateTime: getDateAndWeek(),
  current_index: 0,
  Carousel: [], // 轮播
  Carousel_img: [], // 轮播里的图片列表
  movie_list: [], // 电影列表
  total_video_list: [], // 获取的总视频
  video_list: [], // 显示的视频
  video_loading: false, // 加载更多视频loading
  pic_class_list: [],
  wallpaper_list: [], // 图片列表
  news_list: [], // 新闻列表
  MenuList: [
    { id: 1, src: '/public/images/menu1.png', title: '开眼视频', path: 'videoInfo' },
    { id: 2, src: '/public/images/menu2.png', title: '电影', path: 'movieInfo' },
    { id: 3, src: '/public/images/menu3.png', title: '美图', path: 'pictureInfo' },
    { id: 4, src: '/public/images/menu4.png', title: '壁纸', path: 'wallpaperMobile' },
    { id: 5, src: '/public/images/menu5.png', title: '新闻头条', path: 'newsInfo' },
  ],
}

Page({
  data: { ...initData },
  onLoad: function (options) {
    this.fetchCarousel();
    this.validationClass();
    this.fetchMovie();
    this.fetchNews();
    if (options.type) {
      let path = 'videoDetail';
      if (options.type === 'video') path = `../videoDetail/index?info=${options.info}`;
      if (options.type === 'news') path = `../newsDetail/index?info=${options.info}`;
      wx.navigateTo({ url: path });
    }
  },

  onPullDownRefresh: function() {
    setTimeout(() => {
      this.setData({ current_index: 0, video_list: [] }, () => {
        this.fetchCarousel();
        this.validationClass();
        this.fetchMovie();
        this.fetchNews();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      });
    }, 1500);
  },
  
  fetchCarousel: function() { // 获取轮播
    post(api.kaiyan_feed, null, (res) => { // 获取每日推荐视频
      const { issueList } = res;
      const itemList = issueList[0] ? issueList[0].itemList : [];
      const carouselList = [];
      const random = Math.floor(Math.random() * 3)
      itemList.map(item => {
        if (item.type === 'video') {
          carouselList.push({
            id: item.data.id,
            playUrl: item.data.playUrl,
            url: item.data.cover.feed,
            title: item.data.title,
            author_title: `${item.data.author.name} / #${item.data.category}`,
            duration: secondMinuteFormat(item.data.duration),
            type: 1,
          })
        }
      })
      this.fetchVideo(carouselList[random].id);
      const start = 0;
      const count = 10;
      const query = 'c=WallPaper&a=getAppsByOrder&order=create_time'
      const params = `${query}&start=${start}&count=${count}&name=wallpaper360`;
      post(api.wallpaper360_index, params, (res) => { // 获取每日推荐图片
        const Carousel_img = [];
        res.data.map(item => {
          Carousel_img.push({
            type: 2,
            ...item,
            title: item.tag.replace(/_/g, '').replace(/category/g, '').replace(/全部/g, ''),
            utag: item.utag,
            size: `${item.resolution} 1600×960 1440×960 1366×768 1280×800 1024×768`,
          })
        })
        this.setData({ Carousel: [...carouselList, ...Carousel_img], Carousel_img });
      });
    });
  },

  fetchMovie: function() { // 获取电影
    const start = 0;
    const count = 10;
    const params = `start=${start}&count=${count}&apikey=0df993c66c0c636e29ecbb5344252a4a`;
    post(api.douban_soon, params, (res) => {
      const movie_list = res.subjects.map(item => ({
        id: item.id,
        images: item.images.large || item.images.medium || item.images.small,
        average: item.rating.average,
        title: item.title,
        year: item.year,
        genres: item.genres,
      }))
      this.setData({ movie_list });
    })
  },

  fetchVideo: function(id) { // 根据id获取相关视频
    const params = `${id}?num=36`
    const total_video_list = [];
    post(api.kaiyan_related, params, (res) => {
      res.videoList.map(item => {
        total_video_list.push({
          id: item.id,
          playUrl: item.playUrl,
          url: item.coverForDetail,
          title: item.title,
          author_title: `${item.author.name} #${item.category}`,
          duration: secondMinuteFormat(item.duration),
        })
      })
      this.setData({ total_video_list }, () => {
        this.setVideo_list(0, 4);
      });
    });
  },

  setVideo_list: function(start, num) { // 向视频列表里添加视频
    const new_list = [];
    const values_list = this.data.total_video_list;
    const { video_list } = this.data;
    values_list.map((item, index) => {
      if (index >= start && index < (start + num)) {
        new_list.push(item);
      }
      return false;
    })
    this.setData({ video_list: [...video_list, ...new_list]})
  },

  moreVideo: function() { // 查看更多视频
    const videoLength = this.data.video_list.length;
    this.setData({ video_loading: true });
    setTimeout(() => {
      this.setVideo_list(videoLength, 5);
      this.setData({ video_loading: false });
    }, 500);
  },

  validationClass: function () {
    const { pic_class_list } = this.data;
    const random = Math.floor(Math.random() * 15 + 1);
    if (pic_class_list.length <= 0) {
      this.fetPicClass(random)
    } else this.fetchWallpaper(pic_class_list[random].id);
  },

  /**
   * 获取图片分类
   */
  fetPicClass: function (random) {
    const params = 'c=WallPaperAndroid&a=getAllCategories';
    return post(api.wallpaper360_index, params, (res) => {
      this.setData({
        pic_class_list: res.data,
      }, () => this.fetchWallpaper(res.data[random].id));
    })
  },

  fetchWallpaper: function(id) { // 获取图片壁纸
    const skip = 0;
    const limit = 20;
    const paramsMobile = `order=hot&skip=${skip}&limit=${limit}`;
    const params360 = `c=WallPaper&a=getAppsByCategory&cid=${id}&start=${skip}&count=${limit}`
    post(api.wallpapermobile_hot_new, paramsMobile, (res) => {
      const { vertical } = res.res;
      const start = Math.floor(Math.random() * 10);
      const end = Math.floor(Math.random() * (20 - 10) + 10);
      post(api.wallpaper360_index, params360, (res) => {
        const { data } = res;
        const appendList = [
          { url: vertical[start].img, type: 1 },
          { url: vertical[end].img, type: 1 },
        ];
        const value = data.map(item => ({ url: item.url }));

        appendList.splice(1, 0, {
          type: 2,
          value: [value[start], value[end]]}, {type: 2, value: [value[start + 1], value[end - 1]]
        });
        this.setData({ wallpaper_list: appendList });
      });
    });
  },

  fetchNews: function() { // 获取头条新闻
    const channelId = '5572a108b3cdc86cf39001cd';
    const page = 1;
    const count = 10;
    const params = `/newsList?channelId=${channelId}&maxResult=${count}&page=${page}`;
    post(api.toutiao_newsInfo, params, (res) => {
      const list = res.showapi_res_body ? res.showapi_res_body.pagebean.contentlist : [];
      const news_list = list.map(item => {
        return {
          channelId: item.channelId,
          channelName: item.channelName,
          source: item.source,
          pubDate: item.pubDate,
          havePic: item.havePic,
          title: item.title,
          allList: item.allList,
          content: item.content,
          image: item.havePic ? item.imageurls[0].url : '',
        }
      })
      this.setData({ news_list });
    });
  },

  handleSeeImage: function(event) { // 图片壁纸点击事件
    const { type } = event.currentTarget.dataset;
    const { wallpaper_list, Carousel_img } = this.data;
    const wallpaper = [];
    wallpaper_list.map(item => {
      if (item.type === 1) wallpaper.push(item.url);
      else item.value.map(url => wallpaper.push(url.url));
    });
    const Carousel = Carousel_img.map(item => item.url);
    const pic_list = type ? Carousel : wallpaper;
    wx.previewImage({
      current: event.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: pic_list, // 需要预览的图片http链接列表
    })
  },

  handleRouter:function(event) { // 跳转页面
    const { path, info } = event.currentTarget.dataset;
    const pathname = info
      ? `../${path}/index?info=${encodeURIComponent(JSON.stringify(info))}`
      : `../${path}/index`;
    wx.navigateTo({ url: pathname });
  },
})
