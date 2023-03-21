import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/config'
import './utils/permission'

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

// 引用高德地图组件
import VueAMap from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '3e86388edfa660601a180ee909b40f0e',
  securityJsCode: '74b46234689598343896b6b9995457ce',
  plugins: ['AMap.DistrictSearch', 'AMap.DistrictLayer']
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
