import request from 'umi-request';


export default {
  async get(url, params = {}) {
    return new Promise((resolve, reject) => {
      request(url, {
        method: 'get',
        params,
        credentials: 'include', // 默认请求是否带上cookie
      })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  },
  async post(url, data) {
    return new Promise((resolve, reject) => {
      request(url, {
        method: 'post',
        data,
        credentials: 'include', // 默认请求是否带上cookie
      })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  },
}
