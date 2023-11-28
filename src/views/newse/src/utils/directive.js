import Vue from 'vue'
import store from '@/store'
Vue.directive('permission', {
  inserted: (el, api) => {
    const auths = store.state.permission
    if (auths.permission.length !== 0) {
      const flag = auths.permission.includes(api.value)
      if (flag) {
        el.parentNode.removeChild(el)
      }
    }
  }
})
