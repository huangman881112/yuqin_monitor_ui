import axios from 'axios'
import { showMessage } from "./status";   // 引入状态码文件
import { Message } from 'element-ui'
import  router from '@/router'
// import getToken from "./commonutil"


// 设置接口超时时间
axios.defaults.timeout = 60000;
// 请求地址
// axios.defaults.baseURL = config[process.env.NODE_ENV].baseUrl
// 携带 cookie，对目前的项目没有什么作用，因为我们是 token 鉴权
axios.defaults.withCredentials = true
// 请求头，headers 信息
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// 默认 post 请求，使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json'

//请求拦截器
axios.interceptors.request.use(async request => {
  let token = localStorage.getItem('msToken')
  request.headers['Authorization'] = token==='' ? '' : 'Bearer '+ token
  return request
})
// 响应拦截器，内部根据返回值，重新组装，统一管理。
axios.interceptors.response.use(
  response => {
    if(response.data.code == -2){
      //JWT过期
      router.replace('/login');
    }
    return response;
  },
  error => {
    const {response} = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      showMessage(response.status);           // 传入响应码，匹配响应码对应信息
      return Promise.reject(response.data);
    } else {
      Message.warning('网络连接异常,请稍后再试!');
    }
  }
)


// 封装 GET POST PUT DELETE 请求并导出
export function request(url='',params={},type='POST'){
  //设置 url params type 的默认值
  return new Promise((resolve,reject)=>{
    let promise
    if( type.toUpperCase()==='GET' ){
      promise = axios({
        url,
        params
      })
    }else if( type.toUpperCase()=== 'POST' ){
      promise = axios({
        method:'POST',
        url,
        data:params
      })
    }else if(type.toUpperCase()=== 'PUT' ){
      promise = axios({
        method:'PUT',
        url,
        data:params
      })
    }else {
      promise = axios({
        method:'DELETE',
        url,
        data:params
      })
    }
    //处理返回
    promise.then(res=>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
}
  
