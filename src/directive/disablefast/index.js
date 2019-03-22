import fast from './fast'

const install = function(Vue) {
  Vue.directive('disdbclick', fast)
}

if (window.Vue) {
  window.fast = fast
  Vue.use(install); // eslint-disable-line
}

fast.install = install
export default fast
