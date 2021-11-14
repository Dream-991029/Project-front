import { request } from './request'

export function getTreeMenu (id) {
  return request({
    method: 'get',
    url: `/menu/${id}`
  })
}
