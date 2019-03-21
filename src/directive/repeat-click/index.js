import repeatClick from './repeat.js'

const install = function(Vue) {
  Vue.directive('repeatClick', repeatClick)
}

if (window.Vue) {
  window.repeatClick = repeatClick
  Vue.use(install); // eslint-disable-line
}

repeatClick.install = install
export default repeatClick
