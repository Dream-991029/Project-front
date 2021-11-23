import { request } from './request'

export function updateFileRequest (formData) {
  return request({
    method: 'post',
    url: '/file',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: formData
  })
}
