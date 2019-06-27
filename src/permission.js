import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'// 进度条样式
import { getToken } from '@/utils/auth' // 从cookie中获取token

NProgress.configure({ showSpinner: false })// 进度条配置

// 权限判断
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // 管理员权限
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/auth-redirect'] // 重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // 进度条开始
  if (getToken()) { // 确认是否有token
    /* 有权限 */
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // 如果当前页面是主页，则每次挂载后都不会触发，请手动触发
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const roles = res.data.roles // note: roles 必须是一个数组! 例如: ['editor','develop']
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 , 导航就不会留下历史记录
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err)
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    /* 没有权限 */
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // 如果当前页面为登录，则每次挂接后都不会触发，因此请手动处理它
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束进度条
})
