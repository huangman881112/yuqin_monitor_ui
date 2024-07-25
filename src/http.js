import axios from 'axios'
import { Loading } from 'element-ui'

let loading

const startLoading = () => {
  const options = {
    lock: true,
    text: "加载中...",
    background: 'rgba(0,0,0,0.7)'
  }
  loading = Loading.service(options);
}

const endLoading = () => {
  loading.close();
}

axios.interceptors.request.use(config => {
  //加载
  startLoading();
  return config;
})

axios.interceptors.response.use(response=>{
  //结束loading
  endLoading();
  return response;
}, error => {
  //结束loading
  endLoading();
  //错误提醒
  return Promise.reject(error);
})

export default axios;