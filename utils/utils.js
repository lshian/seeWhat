/**
 * 秒转为分秒格式
 */
const secondMinuteFormat = (value) => {
  const minute = Math.floor(value / 60);
  const second = value % 60
  const result = `${minute < 10 ? `0${minute}` : minute}:${second < 10 ? `0${second}` : second}`
  return result;
}

/**
 * 获取当前X月X日 周X
 */
const getDateAndWeek = () => {
  const date = new Date();
  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month < 10 ? `0${month}` : month}月${day < 10 ? `0${day}` : day}日 ${weekday[date.getDay()]}`;
}

/**
 * 时间戳转 MM/DD YYYY格式
 */

 const timeStampToFormat = (timeStamp) => {
   const date = new Date(timeStamp);
   const year = date.getFullYear();
   const month = date.getMonth() + 1;
   const day = date.getDate();
   return `${month < 10 ? `0${month}` : month}/${day < 10 ? `0${day}` : day}  ${year}`;
 }

export {
  secondMinuteFormat,
  getDateAndWeek,
  timeStampToFormat,
}