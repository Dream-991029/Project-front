import { request } from './request'

export function uploadFileRequest (formData) {
  return request({
    method: 'post',
    url: '/file/upload',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: formData
  })
}

export function getTopicRequest (data) {
  return request({
    method: 'get',
    url: '/file',
    params: data
  })
}
