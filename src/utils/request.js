// eslint-disable-next-line import/no-duplicates
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import config from '@/config/env'
// 请求队列
const reqQueue = []

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: config.env.BASE_URL,
  // 超时
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(config => {
  // 确认请求
  config.requestStr = `${config.method}/${config.url}/${JSON.stringify(config.data)}/${JSON.stringify(config.params)}`
  // 判断是否存在
  if (reqQueue.includes(config.requestStr)) {
    const error = new Error('请求重复')
    error.statusCode = 515
    return Promise.reject(error)
  } else {
    // 入列
    reqQueue.push(config.requestStr)
  }
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交
  if (getToken() && !isToken) {
    config.headers.Authorization = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  // 出列
  reqQueue.splice(reqQueue.findIndex(item => item === res.config.requestStr), 1)
  // 未设置状态码则默认成功状态
  if (res.status === 200 || res.statusCode === 200) {
    return Promise.resolve(res.data)
  } else {
    return Promise.reject(res.data)
  }
},
error => {
  console.log('err' + error)
  let { message } = error
  // 重复告警
  if (error.statusCode === 515) return
  // 出列
  reqQueue.splice(reqQueue.findIndex(item => item === error.config.requestStr), 1)

  if (message === 'Network Error') {
    message = '后端接口连接异常'
  } else if (message.includes('timeout')) {
    message = '系统接口请求超时'
  } else if (message.includes('Request failed with status code')) {
    message = '系统接口' + message.substr(message.length - 3) + '异常'
  }
  ElMessage({
    message: message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
}
)

export default service
