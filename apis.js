const apis = {
  kaiyan_feed: 'Kaiyan/feed', // 开眼每日推荐
  kaiyan_related: 'Kaiyan/related', // 开眼根据Id获取相关推荐
  kaiyan_categories: 'Kaiyan/categories', // 开眼视频分类
  kaiyan_videoList: 'Kaiyan/videoList', // 根据分类id获取视频列表
  kaiyan_detail: 'Kaiyan/detail', // 获取视频详情
  kaiyan_rankList: 'Kaiyan/rankList', // 获取开眼视频排行榜
  kaiyan_ranking: 'Kaiyan/ranking', // 根据传递id获取每周、每月、总排行
  kaiyan_search: 'Kaiyan/search', // 搜索相关
  kaiyan_hot: 'Kaiyan/hot', // 搜索热门关键词
  directrequest: 'Kaiyan/directrequest', // 开眼直接访问

  wallpaper360_index: 'Wallpaper360/index', // 360壁纸

  wallpapermobile_hot_new: 'Wallpapermobile/hot_new', // 最新或最热壁纸
  wallpapermobile_category: 'Wallpapermobile/category', // 壁纸分类
  wallpapermobile_paper_list: 'Wallpapermobile/paper_list', // 根据分类获取壁纸列表

  douban_theaters: 'Douban/theaters', // 豆瓣正在热映
  douban_top250: 'Douban/top250', // 豆瓣电影top250
  douban_soon: 'Douban/soon', // 即将上映
  douban_detail: 'Douban/detail', // 电影详情

  toutiao_newsClass: 'Toutiao/newsClass', // 头条分类
  toutiao_newsInfo: 'Toutiao/newsInfo', // 头条列表
}
export default apis;