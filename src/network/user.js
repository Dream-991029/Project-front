import { request } from './request'

export function getToken (data) {
  return request({
    method: 'post',
    url: '/user/login',
    data
  })
}

export function registerUser (data) {
  return request({
    method: 'post',
    url: '/user/register',
    data
  })
}
