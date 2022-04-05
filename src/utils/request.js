// 基于 axios 封装的请求模块
import axios from 'axios'
import { store } from '../redux/store'

const request = axios.create({
  baseURL: 'http://localhost:5000' // 请求基础路径
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理
    // 开启redux loading
    store.dispatch({
      type: 'change_loading',
      payload: true
    })

    return config
  },
  (error) => {
    // 当请求失败的时候做一些处理
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 在响应成功之后做一些处理
    // 关闭redux loading
    store.dispatch({
      type: 'change_loading',
      payload: false
    })

    return response
  },
  (error) => {
    // 当响应失败的时候做一些处理
    return Promise.reject(error)
  }
)

// 导出请求方法
export default request
