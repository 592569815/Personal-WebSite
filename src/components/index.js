import search from './PageSearch/index' // 搜索组件
import pagination from './pagination/index.vue' // 分页组件
import operations from './Operations/index.vue' // 分页组件

const install = function(Vue) {
  Vue.component(search.name, search)
  Vue.component(pagination.name, pagination)
  Vue.component(operations.name, operations)
}

export default install
