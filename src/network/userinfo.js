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
    url: '/userinfo/info',
    params: {
      user_name: userName
    }
  })
}

export function addUser (data) {
  return request({
    method: 'post',
    url: '/userinfo/adduser',
    data
  })
}

export function editUser (data) {
  return request({
    method: 'put',
    url: '/userinfo/edituser',
    data
  })
}

export function deleteUser (userId, userName) {
  return request({
    method: 'delete',
    url: '/userinfo/deleteuser',
    params: {
      user_id: userId,
      user_name: userName
    }
  })
}
