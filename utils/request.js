
import { requestUrl } from '../config';

const post = (path, params, callback) => {
  wx.request({
    url: `${requestUrl}/${path}`,
    data: {params},
    header: {'content-type':'application/json'},
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: (res) => {
      if (res.statusCode === 200) callback(res.data);
    },
    fail: () => {},
    complete: () => {}
  });
};

const get = (path, data, callback) => {
  wx.request({
    url: `${requestUrl}/${path}`,
    data,
    header: {'content-type':'application/json'},
    method: 'get',
    dataType: 'json',
    responseType: 'text',
    success: (res) => {
      if (res.statusCode === 200) callback(res.data);
    },
    fail: () => {},
    complete: () => {}
  });
};

export {
  post,
  get,
}