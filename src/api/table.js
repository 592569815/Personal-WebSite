import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getAllCountry(pageIndex, pageSize, condition) {
  const data = {
    pageIndex,
    pageSize,
    condition
  }
  return request({
    url: 'api/table/country',
    method: 'post',
    data
  })
}
