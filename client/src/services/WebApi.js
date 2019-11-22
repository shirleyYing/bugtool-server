import request from './request';

const { post, get } = request;
const initConfig = { Log: [''], Type: [] };
const initLogContent = [];

export async function getLogAndTypeList() {
  try {
    const data = await get('/getLogAndTypeList');
    if (data.error_code === 0) {
      return data.data;
    }
    return initConfig;
  } catch (e) {
    return initConfig
  }
}


export async function getLogContent(data) {
  try {
    const ret = await post('/getLogContent', data);
    if (ret.error_code === 0) {
      return ret.data;
    }
    return initLogContent;
  } catch (e) {
    return initLogContent
  }
}




