import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }

  return request({
    url: 'api/account/login',
    method: 'post',
    data
  })
}

// export function logout() {
//   return request({
//     url: '/login/logout',
//     method: 'post'
//   })
// }

export function getUserInfo(user) {
  return request({
    url: 'api/account/info',
    method: 'get',
    params: { user }
  })
}

