import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getAllCountry() {
  return request({
    url: 'api/getAllCountry',
    method: 'get'
  })
}
