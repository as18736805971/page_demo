import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
// import '@/style'
import '@/utils/config'
import '@/utils/directive'
import '@/style/comm/index.scss'
import 'virtual:svg-icons-register'
import './verify'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
