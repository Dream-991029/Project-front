import { request } from './request'

export function getUserInfo (data) {
  return request({
    method: 'get',
    url: '/userinfo',
    params: data
  })
}
