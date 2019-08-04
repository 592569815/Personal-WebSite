import request from '@/utils/request'
const baseUrl = 'http://192.168.1.58:8007'
export function getList(data) {
  return request({
    url: baseUrl + '/InboundShipment/GetInboundShipmentOrder',
    method: 'post',
    data
  })
}
