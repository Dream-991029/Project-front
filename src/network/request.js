import axios from 'axios'

const that = window.vm

export function request (config) {
  // 创建一个axios实例
  const instance = axios.create({
    baseURL: 'http://192.168.10.7:8024',
    timeout: 5000
  })
  // 请求拦截器
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }, err => {
    return Promise.reject(err)
  })
  // 响应拦截器
  instance.interceptors.response.use(res => {
    if (res.data.msg === '身份验证错误!' || res.data.msg === '身份已过期!') {
      res.data.msg = res.data.msg.replace('!', '') + ',请重新登录'
      setTimeout(() => {
        that.$router.push('/login')
      }, 1500)
    }
    return res.data
  }, err => {
    return Promise.reject(err)
  })

  // 返回axios实例
  return instance(config)
}
