import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { message } from 'antd'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('admin-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // HTTP 2xx 即为成功，直接返回 data 字段
    const { data } = response
    return data?.data !== undefined ? data.data : data
  },
  (error: AxiosError<{ code?: string; message?: string }>) => {
    const { response } = error
    if (response) {
      const { status, data } = response
      const msg = data?.message
      if (status === 401) {
        // 登录页的 401 是账号密码错误，不跳转，让登录页自行处理错误提示
        if (window.location.pathname === '/login') {
          return Promise.reject(error)
        }
        message.error(msg || '登录已过期，请重新登录')
        localStorage.removeItem('admin-token')
        window.location.href = '/login'
      } else {
        // 直接使用后端返回的中文消息
        message.error(msg || `请求错误 (${status})`)
      }
    } else {
      message.error('网络连接失败，请检查网络')
    }
    return Promise.reject(error)
  }
)

export default request
