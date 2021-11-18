import { request } from './request'

export function getUserInfoList (data) {
  return request({
    method: 'get',
    url: '/userinfo',
    params: data
  })
}

export function getUserInfo (userName) {
  return request({
    method: 'get',
    url: `/userinfo/${userName}`
  })
}
